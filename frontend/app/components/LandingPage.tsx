"use client";
import React, { useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { CheckCircle, MessageSquare,  Zap, Users, Clock, Shield } from 'lucide-react';
import Footer from './Footer';


const LandingPage = () => {

  const quickFeatures = [
    "Connect to Slack via OAuth",
    "View and select Slack channels", 
    "Send messages instantly or on a schedule",
    "View and manage scheduled messages"
  ];
  useEffect(() => {
    fetch(`https://localhost:5000/`);
  }, [])
  
  const detailedFeatures = [
    {
      icon: <Shield className="w-8 h-8 text-blue-500" />,
      title: "Secure OAuth Integration",
      description: "Connect safely to your Slack workspace using official OAuth 2.0 authentication. Your credentials are never stored on our servers."
    },
    {
      icon: <Users className="w-8 h-8 text-green-500" />,
      title: "Channel Management",
      description: "View and access all channels from your connected workspace in one centralized dashboard. Switch between channels effortlessly."
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-purple-500" />,
      title: "Instant & Scheduled Messaging",
      description: "Send messages immediately or schedule them for the perfect timing. Perfect for announcements, reminders, and time-zone coordination."
    },
    {
      icon: <Clock className="w-8 h-8 text-orange-500" />,
      title: "Message Queue Management",
      description: "View, edit, and manage all your scheduled messages in one place. Cancel or reschedule messages before they're sent."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col relative overflow-hidden">
      {/* Background Wave Pattern */}
      <div className="absolute inset-0 opacity-30">
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,320L48,341.3C96,363,192,405,288,410.7C384,416,480,384,576,346.7C672,309,768,267,864,266.7C960,267,1056,309,1152,330.7C1248,352,1344,352,1392,352L1440,352L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" fill="url(#gradient1)"/>
          <path d="M0,480L48,458.7C96,437,192,395,288,389.3C384,384,480,416,576,453.3C672,491,768,533,864,533.3C960,533,1056,491,1152,469.3C1248,448,1344,448,1392,448L1440,448L1440,800L1392,800C1344,800,1248,800,1152,800C1056,800,960,800,864,800C768,800,672,800,576,800C480,800,384,800,288,800C192,800,96,800,48,800L0,800Z" fill="url(#gradient2)"/>
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.1"/>
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.05"/>
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.1"/>
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Header Navigation */}
      <header className="relative z-10 bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Slack Pulse
              </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 container mx-auto px-4 py-16 text-center">
        <div className="max-w-6xl mx-auto">
          {/* Hero Content */}
          <div className="mb-16">
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 bg-clip-text text-transparent mb-6">
              Slack Pulse
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-8 mx-auto leading-relaxed">
              Manage Slack communication like a pro — send or schedule messages easily.
            </p>

            {/* Quick Features List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-12">
              {quickFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 text-left">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-700">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <a href="https://localhost:5000/auth">
              <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Get Started
            </Button>
            </a>
            
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {detailedFeatures.map((feature, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-white/20 hover:bg-white/90 group">
                <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;