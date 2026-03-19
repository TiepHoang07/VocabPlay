import axios from 'axios';

const MERRIAM_WEBSTER_API_KEY = process.env.MERRIAM_WEBSTER_API_KEY;
const BASE_URL = 'https://www.dictionaryapi.com/api/v3/references/learners/json';

// Helper function to clean word (remove :1, :2, etc. suffixes)
function cleanWord(word: string): string {
  if (!word) return word;
  // Remove any colon followed by numbers at the end
  return word.replace(/:\d+$/, '');
}

export interface FormattedDefinition {
  word: string;
  phonetic?: string;
  audio?: string;
  partOfSpeech: string;
  shortDefinition: string;
  definitions: {
    definition: string;
    examples: string[];
  }[];
  idioms?: {
    phrase: string;
    definition: string;
    examples: string[];
  }[];
}

interface MerriamWebsterEntry {
  meta: { id: string };
  hwi?: { prs?: [{ ipa?: string; sound?: { audio: string } }] };
  fl?: string;
  shortdef?: string[];
  def?: any[];
  dros?: any[];
}

function parseEntry(entry: MerriamWebsterEntry, originalWord: string): FormattedDefinition {
  // Clean the word from the meta.id or original word
  const rawWord = entry.meta?.id || originalWord;
  const cleanedWord = cleanWord(rawWord);
  
  // Extract pronunciation and audio
  let phonetic = '';
  let audio = '';
  if (entry.hwi?.prs && entry.hwi.prs.length > 0) {
    phonetic = entry.hwi.prs[0].ipa || '';
    if (entry.hwi.prs[0].sound?.audio) {
      const audioFile = entry.hwi.prs[0].sound.audio;
      const subdirectory = audioFile.charAt(0);
      audio = `https://media.merriam-webster.com/audio/prons/en/us/mp3/${subdirectory}/${audioFile}.mp3`;
    }
  }

  const partOfSpeech = entry.fl || '';
  const shortDefinition = entry.shortdef ? entry.shortdef[0] : '';

  const definitions: { definition: string; examples: string[] }[] = [];
  const idioms: { phrase: string; definition: string; examples: string[] }[] = [];

  if (entry.def) {
    for (const defGroup of entry.def) {
      parseDefinitionGroup(defGroup, definitions);
    }
  }

  if (entry.dros) {
    for (const dro of entry.dros) {
      parseIdiom(dro, idioms);
    }
  }

  return {
    word: cleanedWord, // Use the cleaned word
    phonetic,
    audio,
    partOfSpeech,
    shortDefinition,
    definitions,
    idioms: idioms.length > 0 ? idioms : undefined,
  };
}

function parseDefinitionGroup(defGroup: any, definitions: { definition: string; examples: string[] }[]) {
  if (!defGroup.sseq) return;
  
  for (const senseSeq of defGroup.sseq) {
    for (const senseItem of senseSeq) {
      if (senseItem[0] === 'sense' && senseItem[1]?.dt) {
        let currentDef = '';
        const examples: string[] = [];
        
        for (const item of senseItem[1].dt) {
          if (item[0] === 'text') {
            currentDef = cleanText(item[1]);
          } else if (item[0] === 'vis' && Array.isArray(item[1])) {
            for (const vis of item[1]) {
              if (vis.t) {
                const example = cleanText(vis.t);
                if (example) examples.push(example);
              }
            }
          }
        }
        
        if (currentDef) {
          definitions.push({ definition: currentDef, examples });
        }
      }
    }
  }
}

function parseIdiom(dro: any, idioms: { phrase: string; definition: string; examples: string[] }[]) {
  const phrase = dro.drp || '';
  let defText = '';
  const examples: string[] = [];
  
  if (dro.def) {
    for (const defGroup of dro.def) {
      if (defGroup.sseq) {
        for (const senseSeq of defGroup.sseq) {
          for (const senseItem of senseSeq) {
            if (senseItem[0] === 'sense' && senseItem[1]?.dt) {
              for (const item of senseItem[1].dt) {
                if (item[0] === 'text') {
                  defText = cleanText(item[1]);
                } else if (item[0] === 'vis' && Array.isArray(item[1])) {
                  for (const vis of item[1]) {
                    if (vis.t) {
                      const example = cleanText(vis.t);
                      if (example) examples.push(example);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  
  if (phrase && defText) {
    // Clean idiom phrases too if they have suffixes
    const cleanedPhrase = cleanWord(phrase);
    idioms.push({ phrase: cleanedPhrase, definition: defText, examples });
  }
}

function cleanText(text: string): string {
  return text.replace(/{[^}]*}/g, '').replace(/<[^>]*>/g, '').trim();
}

export const getWordDefinition = async (word: string): Promise<FormattedDefinition> => {
  try {
    const url = `${BASE_URL}/${word.toLowerCase()}?key=${MERRIAM_WEBSTER_API_KEY}`;
    const response = await axios.get(url);
    const data = response.data;

    if (!data || data.length === 0) {
      throw new Error('Word not found');
    }

    const entry: MerriamWebsterEntry = data[0];
    return parseEntry(entry, word);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Word not found');
      }
      console.error('Dictionary API error:', error.message);
      throw new Error('Failed to fetch definition');
    }
    throw error;
  }
};