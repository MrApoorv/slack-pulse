import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { getValidAccessToken } from '../utils/authUtils';

const MESSAGES_FILE = path.join(__dirname, '../../data/scheduled_messages.json');

export interface ScheduledMessage {
  id: string;
  teamId: string;
  channel: string;
  message: string;
  scheduleTime: string; // ISO string
}

let scheduledMessages: ScheduledMessage[] = [];

// Load from JSON on startup
export const loadScheduledMessages = () => {
  if (fs.existsSync(MESSAGES_FILE)) {
    const raw = fs.readFileSync(MESSAGES_FILE, 'utf-8');
    scheduledMessages = JSON.parse(raw);
  } else {
    scheduledMessages = [];
  }
};

// Save current scheduled messages
const saveScheduledMessages = () => {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(scheduledMessages, null, 2));
};

export const addScheduledMessage = (msg: ScheduledMessage) => {
  scheduledMessages.push(msg);
  saveScheduledMessages();
};

export const getScheduledMessages = () => scheduledMessages;

export const removeScheduledMessage = (id: string) => {
  const index = scheduledMessages.findIndex((m) => m.id === id);
  if (index !== -1) {
    scheduledMessages.splice(index, 1);
    saveScheduledMessages();
  }
};

export const startScheduler = async () => {
  setInterval(async () => {
    const now = new Date();

    for (const msg of [...scheduledMessages]) {
      const targetTime = new Date(msg.scheduleTime);

      if (now.getTime() >= targetTime.getTime()) {
        // const token = getToken(msg.teamId);
        const token = await getValidAccessToken(msg.teamId);
        if (!token) continue;

        try {
          await axios.post(
            'https://slack.com/api/chat.postMessage',
            {
              channel: msg.channel,
              text: msg.message,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );

          // console.log(`Sent scheduled message: ${msg.message}`);
          removeScheduledMessage(msg.id);
        } catch (error) {
          console.error(`Failed to send scheduled message: ${msg.id}`, error);
        }
      }
    }
  }, 1000);
};
