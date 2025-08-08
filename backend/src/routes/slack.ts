import express from 'express';
import axios from 'axios';
import { addScheduledMessage, getScheduledMessages, removeScheduledMessage } from '../storage/scheduler';
import { v4 as uuidv4 } from 'uuid';
import { getValidAccessToken } from '../utils/authUtils';

const router = express.Router();

//POST - Sends a message immediately to a specified channel
router.post('/message/send', async (req, res) => {
  const { teamId, channel, message } = req.body;

  if (!teamId || !channel || !message) {
    return res.status(400).json({ error: 'Missing teamId, channel, or message' });
  }

  const token = await getValidAccessToken(teamId);
  if (!token) {
    return res.status(401).json({ error: 'Workspace not connected or token not found' });
  }

  try {
    const response = await axios.post(
      'https://slack.com/api/chat.postMessage',
      {
        channel,
        text: message,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.ok) {
      res.json({ success: true, messageTs: response.data.ts });
    } else {
      res.status(400).json({ error: response.data.error });
    }
  } catch (error) {
    console.error('Slack API error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

//GET to fetch all the channels
router.get('/channels', async (req, res) => {
  const teamId = req.query.teamId as string;
  // console.log('Received request:', req.query);
  if (!teamId) {
    return res.status(400).json({ error: 'Missing teamId in query' });
  }

  const token = await getValidAccessToken(teamId);
  if (!token) {
    return res.status(401).json({ error: 'No token found for this teamId' });
  }

  try {
    const response = await axios.get('https://slack.com/api/conversations.list', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        types: 'public_channel',
        limit: 100,
      },
    });

    if (!response.data.ok) {
      return res.status(400).json({ error: response.data.error });
    }

    // Only return ID and name to frontend
    const channels = response.data.channels.map((ch: any) => ({
      id: ch.id,
      name: ch.name,
    }));

    res.json(channels);
  } catch (error) {
    console.error('Error fetching channels:', error);
    res.status(500).json({ error: 'Failed to fetch channels' });
  }
});

//POST to schedule a message
router.post('/message/schedule', async (req, res) => {
  const { teamId, channel, message, scheduleTime } = req.body;

  if (!teamId || !channel || !message || !scheduleTime) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const time = new Date(scheduleTime);
  if (isNaN(time.getTime()) || time <= new Date()) {
    return res.status(400).json({ error: 'Invalid or past schedule time' });
  }

  const id = uuidv4();

  addScheduledMessage({
    id,
    teamId,
    channel,
    message,
    scheduleTime: time.toISOString(),
  });

  // console.log(`Scheduled message ${id} at ${time.toISOString()}`);

  res.json({ success: true, scheduledId: id });
});


router.get('/messages/scheduled', (req, res) => {
  const teamId = req.query.teamId as string;

  if (!teamId) {
    return res.status(400).json({ error: 'Missing teamId in query' });
  }

  const allMessages = getScheduledMessages();

  // Filter messages by team
  const teamMessages = allMessages
    .filter(msg => msg.teamId === teamId)
    .map(msg => ({
      id: msg.id,
      channel: msg.channel,
      message: msg.message,
      scheduleTime: msg.scheduleTime,
    }));

  res.json(teamMessages);
});


router.delete('/message/cancel/:id', (req, res) => {
  const { id } = req.params;
  const teamId = req.query.teamId as string;

  if (!teamId) {
    return res.status(400).json({ error: 'Missing teamId in query' });
  }

  const allMessages = getScheduledMessages();
  // const target = allMessages.find(msg => String(msg.id).trim() === id && msg.teamId === teamId);
  const target = allMessages.find(
  (msg) =>
    msg.id.trim() === id.trim() &&
    msg.teamId.trim() === teamId.trim()
  );

  if (!target) {
    return res.status(404).json({ error: 'Scheduled message not found' });
  }

  removeScheduledMessage(id);
  // console.log(`Cancelled scheduled message ${id}`);

  res.json({ success: true });
});

export default router;
