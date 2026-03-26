import { api } from "./client"


export const getUserWords = async () => {
  const res = await api.get("/words");
  return res.data;
};

export const searchWord = async (word: string) => {
  const response = await api.get(`/words/search/${word}`);
  return response.data;
};

export const addWordToDictionary = async (wordData: any) => {
  const response = await api.post("/words", wordData);
  return response.data;
};

export const memorizeWord = async (id: number) => {
  const response = await api.post(`/words/${id}/memorize`);
  return response.data;
};


export const deleteWord = async (id: number) => {
  const response = await api.delete(`/words/${id}`);
  return response.data;
};
