import express from 'express';
import axios from 'axios';
import { storeToken } from '../storage/storage';

const router = express.Router();

//Redirect user to Slack OAuth screen
router.get('/auth', (req, res) => {
  const clientId = process.env.SLACK_CLIENT_ID;
  const redirectUri = process.env.SLACK_REDIRECT_URI;

  const scopes = [
    'chat:write',
    'chat:write.public',
    'channels:read',
    'groups:read'
  ].join(',');

  const authUrl = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}`;
  res.redirect(authUrl);
});

//Handle Slack OAuth callback and save bot token
router.get('/callback', async (req, res) => {
  const code = req.query.code as string;

  try {
    const result = await axios.post('https://slack.com/api/oauth.v2.access', null, {
      params: {
        client_id: process.env.SLACK_CLIENT_ID,
        client_secret: process.env.SLACK_CLIENT_SECRET,
        redirect_uri: process.env.SLACK_REDIRECT_URI,
        code
      }
    });

    const data = result.data;

    if (data.ok) {
      const teamId = data.team.id;
      const accessToken = data.access_token;
      const refreshToken = data.refresh_token;
      const expiresIn = data.expires_in;
      const botUserId = data.bot_user_id;
      const botId = data.bot_id;

      const expiresAt = Date.now() + expiresIn * 1000;

      storeToken(teamId, accessToken, refreshToken, expiresAt, botUserId, botId);

      

      // console.log(`Connected workspace: ${data.team.name}`);
      // res.send('Slack workspace connected successfully!');
      res.redirect(
  `http://localhost:3000/dashboard?teamId=${teamId}&teamName=${encodeURIComponent(data.team.name)}&botUserId=${botUserId}`
);

    } else {
      console.error(`OAuth Error ${data.error}`);
      res.status(400).send(`OAuth failed: ${data.error}`);
    }
  } catch (err) {
    console.error('OAuth Callback Error', err);
    res.status(500).send('Server error during Slack OAuth callback');
  }
});

export default router;
