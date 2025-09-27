import React, { useEffect } from 'react';
import { createChat } from '@n8n/chat';
import '@n8n/chat/style.css';

const LiveChat: React.FC = () => {
  useEffect(() => {
    createChat({
      webhookUrl: 'https://umukandara.app.n8n.cloud/webhook/5042b1bb-0bd1-4700-8bee-e1051648540d/chat'
    });
  }, []);

  return <div id="n8n-chat" />;
};

export default LiveChat;