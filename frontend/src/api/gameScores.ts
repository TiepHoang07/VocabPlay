import { api } from "./client";

export const updateWordChainScore = async (score: number) => {
  const response = await api.post("/game-scores/word-chain", { score });
  return response.data;
};

export const updateMatchingGameScore = async (time: number) => {
  const response = await api.post("/game-scores/matching-game", { time });
  return response.data;
};

export const getWordChainHighScore = async () => {
  const response = await api.get("/game-scores/word-chain");
  return response.data;
};

export const getMatchingGameFastestTime = async () => {
  const response = await api.get("/game-scores/matching-game");
  return response.data;
};
export const getWordChainLeaderboard = async () => {
  const response = await api.get("/game-scores/word-chain/leaderboard");
  return response.data;
};

export const getMatchingGameLeaderboard = async () => {
  const response = await api.get("/game-scores/matching-game/leaderboard");
  return response.data;
};
