type AuthRequest = (method: string, url: string, data?: any) => Promise<any>;

export const updateWordChainScore = async (authRequest: AuthRequest, score: number) => {
  const response = await authRequest("POST", "/game-scores/word-chain", { score });
  return response.data;
};

export const updateMatchingGameScore = async (authRequest: AuthRequest, time: number) => {
  const response = await authRequest("POST", "/game-scores/matching-game", { time });
  return response.data;
};

export const getWordChainHighScore = async (authRequest: AuthRequest) => {
  const response = await authRequest("GET", "/game-scores/word-chain");
  return response.data;
};

export const getMatchingGameFastestTime = async (authRequest: AuthRequest) => {
  const response = await authRequest("GET", "/game-scores/matching-game");
  return response.data;
};
export const getWordChainLeaderboard = async (authRequest: AuthRequest) => {
  const response = await authRequest("GET", "/game-scores/word-chain/leaderboard");
  return response.data;
};

export const getMatchingGameLeaderboard = async (authRequest: AuthRequest) => {
  const response = await authRequest("GET", "/game-scores/matching-game/leaderboard");
  return response.data;
};
