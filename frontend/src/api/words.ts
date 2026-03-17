import { api } from "./client"


export const getUserWords = async (authRequest: any) => {
  const res = await authRequest("get", "/words");
  return res.data;
};

export const searchWord = async (word: string) => {
  const response = await api.get(`/words/search/${word}`);
  return response.data;
};

export const addWordToDictionary = async (authRequest: any, wordData: any) => {
  const response = await authRequest("post", "/words", wordData);
  return response.data;
};

export const deleteWord = async (authRequest: any, id: number) => {
  const response = await authRequest("delete", `/words/${id}`);
  return response.data;
};
