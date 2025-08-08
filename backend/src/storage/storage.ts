import fs from 'fs';
import path from 'path';

const TOKENS_FILE = path.join(__dirname, '../../data/tokens.json');

interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // UNIX timestamp
  botUserId: string;
  botId: string;
}


let tokens: Record<string, TokenData> = {};

// Load tokens from file
export const loadTokens = () => {
  if (fs.existsSync(TOKENS_FILE)) {
    tokens = JSON.parse(fs.readFileSync(TOKENS_FILE, 'utf-8'));
  } else {
    tokens = {};
  }
};

// Save tokens to file
const saveTokens = () => {
  fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2));
};

export const storeToken = (
  teamId: string,
  accessToken: string,
  refreshToken: string,
  expiresAt: number,
  botUserId: string,
  botId: string
) => {
  tokens[teamId] = { accessToken, refreshToken, expiresAt, botUserId, botId };
  saveTokens();
};

export const getTokenData = (teamId: string): TokenData | undefined => {
  return tokens[teamId];
};


export const getAllTokens = () => tokens;
