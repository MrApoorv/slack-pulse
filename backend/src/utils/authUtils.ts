import axios from 'axios';
import { getTokenData, storeToken } from '../storage/storage';

// Returns a valid access token (refreshes if expired)
export const getValidAccessToken = async (teamId: string): Promise<string | null> => {
  const tokenData = getTokenData(teamId);
  if (!tokenData) {
    console.warn(`No token found for team: ${teamId}`);
    return null;
  }

  const { accessToken, refreshToken, expiresAt, botUserId, botId } = tokenData;

  const now = Date.now();
  const buffer = 2 * 60 * 1000; // 2 min buffer

  // If still valid, return existing token
  if (now < expiresAt - buffer) {
    return accessToken;
  }

  console.log(`Token expired or near expiry for team ${teamId}. Refreshing...`);

  try {
    const response = await axios.post('https://slack.com/api/tooling.tokens.rotate', null, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      params: {
        client_id: process.env.SLACK_CLIENT_ID,
        client_secret: process.env.SLACK_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }
    });

    const data = response.data;

    if (!data.ok) {
      console.error(`Failed to refresh token for ${teamId}: ${data.error}`);
      return null;
    }

    const newAccessToken = data.access_token;
    const newRefreshToken = data.refresh_token;
    const newExpiresAt = Date.now() + data.expires_in * 1000;

    storeToken(teamId, newAccessToken, newRefreshToken, newExpiresAt, botUserId, botId);
    console.log(`Token refreshed for team ${teamId}.`);

    return newAccessToken;

  } catch (err) {
    console.error(`Error during token refresh for team ${teamId}`, err);
    return null;
  }
};
