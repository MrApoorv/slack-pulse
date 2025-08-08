"use client";
import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Trash2, Send, Clock, LogOut, Hash, Zap, AlertCircle, MessageSquare, Calendar} from 'lucide-react';
import Footer from './Footer';
import { useSearchParams } from 'next/navigation';

interface ScheduledMessage {
  id: string;
  channel: string;
  message: string;
  scheduleTime: string;
  channelName: string;
}

interface Channel {
  id: string;
  name: string;
}

const Dashboard = () => {
  const searchParams = useSearchParams();
  const teamId = searchParams.get('teamId');
  const [selectedChannel, setSelectedChannel] = useState('');
  const [message, setMessage] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [showScheduleInputs, setShowScheduleInputs] = useState(false);
  const [validationError, setValidationError] = useState('');

const fetchScheduled = async () => {
  try {
    const res = await fetch(`https://localhost:5000/slack/messages/scheduled?teamId=${teamId}`);
    const data = await res.json();

    const enriched = data.map((msg: ScheduledMessage) => {
      const matchedChannel = channels.find((c) => c.id === msg.channel);
      return {
        ...msg,
        channelName: matchedChannel ? matchedChannel.name : 'Unknown Channel',
      };
    });

    setScheduledMessages(enriched);
    // console.log('Scheduled Messages:', enriched);
  } catch (err) {
    console.error('Error fetching messages:', err);
  }
};

useEffect(() => {
  if (!teamId) return;

  fetch(`https://localhost:5000/slack/channels?teamId=${teamId}`)
    .then((res) => res.json())
    .then((data) => setChannels(data))
    .catch((err) => console.error('Error fetching channels:', err));
}, [teamId]);

useEffect(() => {
  if (channels.length > 0) {
    fetchScheduled();
  }
}, [channels]);


  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().slice(0, 5);
    return { date, time };
  };

  const validateFutureDateTime = (date: string, time: string): boolean => {
    if (!date || !time) return false;
    const selectedDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    return selectedDateTime > now;
  };

  const handleSendNow = () => {
  if (!selectedChannel || !message.trim()) {
    setValidationError('Please select a channel and enter a message');
    return;
  }

  fetch(`https://localhost:5000/slack/message/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      teamId,
      channel: selectedChannel,
      message
    }),
  })
    .then(() => {
      alert('Message sent successfully!');
      setMessage('');
      setValidationError('');
    })
    .catch((err) => {
      console.error(err);
      setValidationError('Failed to send message');
    });
};


  const handleScheduleMessage = () => {
  if (!selectedChannel || !message.trim()) {
    setValidationError('Please select a channel and enter a message');
    return;
  }

  if (!scheduleDate || !scheduleTime) {
    setValidationError('Please select both date and time for scheduling');
    return;
  }

  if (!validateFutureDateTime(scheduleDate, scheduleTime)) {
    setValidationError('Scheduled date and time must be in the future');
    return;
  }

  const scheduledTime = new Date(`${scheduleDate}T${scheduleTime}`).toISOString();

  fetch(`https://localhost:5000/slack/message/schedule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      teamId,
      channel: selectedChannel,
      message,
      scheduleTime: scheduledTime,
    }),
  })
    .then(() => {
      alert('Message scheduled!');
      fetchScheduled();
      setMessage('');
      setScheduleDate('');
      setScheduleTime('');
      setShowScheduleInputs(false);
      setValidationError('');
    })
    .catch(() => setValidationError('Failed to schedule message'));
};


  const handleDeleteScheduledMessage = (id: string) => {
  fetch(`https://localhost:5000/slack/message/cancel/${id}?teamId=${teamId}`, {
    method: 'DELETE',
  })
    .then(() => {
      setScheduledMessages((prev) => prev.filter((msg) => msg.id !== id));
    })
    .catch(() => setValidationError('Failed to cancel scheduled message'));
};

  const formatScheduledTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

    return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <a href="https://slack-pulse.vercel.app/">
          <button 
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Slack Pulse Dashboard
            </h1>
          </button>
          </a>
          <a href="https://localhost:5000/auth">
          <Button variant="outline" className="flex items-center space-x-2">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
          </a>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Validation Error Alert */}
          {validationError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}

          {/* Message Composer */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-white/20">
            <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <span>Compose Message</span>
            </h2>
            
            {/* Channel Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Channel
              </label>
              <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a channel..." />
                </SelectTrigger>
                <SelectContent>
                  {channels.map((channel) => (
                    <SelectItem key={channel.id} value={channel.id}>
                      <div className="flex items-center space-x-2">
                        <Hash className="w-4 h-4 text-gray-500" />
                        <span>{channel.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Message Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                rows={4}
                className="w-full"
              />
            </div>

            {/* Schedule Inputs (conditional) */}
            {showScheduleInputs && (
              <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-medium mb-3 flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Schedule Details</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <Input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      min={getCurrentDateTime().date}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <Input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
                {scheduleDate && scheduleTime && (
                  <p className="text-sm text-gray-600 mt-2">
                    Scheduled for: {formatScheduledTime(`${scheduleDate}T${scheduleTime}`)}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleSendNow}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                disabled={!selectedChannel || !message.trim()}
              >
                <Send className="w-4 h-4" />
                <span>Send Now</span>
              </Button>
              
              {!showScheduleInputs ? (
                <Button
                  variant="outline"
                  onClick={() => setShowScheduleInputs(true)}
                  className="flex items-center space-x-2 border-blue-300 text-blue-700 hover:bg-blue-50"
                  disabled={!selectedChannel || !message.trim()}
                >
                  <Clock className="w-4 h-4" />
                  <span>Schedule</span>
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={handleScheduleMessage}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Schedule Message</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowScheduleInputs(false);
                      setValidationError('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Scheduled Messages */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-white/20">
            <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <span>Scheduled Messages</span>
              <Badge variant="secondary" className="ml-2">
                {scheduledMessages.length}
              </Badge>
            </h2>
            
            {scheduledMessages.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="font-medium text-gray-700 mb-2">No scheduled messages yet</h3>
                <p className="text-sm">Schedule a message to see it here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {
                scheduledMessages
                  .sort((a, b) => new Date(a.scheduleTime).getTime() - new Date(b.scheduleTime).getTime())
                  .map((msg) => (
                  <div
                    key={msg.id}
                    className="flex items-start justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg hover:from-gray-100 hover:to-blue-100 transition-all duration-200 border border-gray-200"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className="flex items-center space-x-1 bg-white">
                          <Hash className="w-3 h-3" />
                          <span>{msg.channelName}</span>
                        </Badge>
                        <Badge variant="secondary" className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatScheduledTime(msg.scheduleTime)}</span>
                        </Badge>
                      </div>
                      <p className="text-gray-900">{msg.message}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteScheduledMessage(msg.id)}
                      className="ml-4 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};


export default Dashboard;