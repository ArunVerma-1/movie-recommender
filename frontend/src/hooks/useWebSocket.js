import { useEffect, useRef, useState } from 'react';

export const useWebSocket = (url, clientId) => {
  const [socket, setSocket] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Connecting');

  useEffect(() => {
    console.log('Connecting to WebSocket...', `${url}/${clientId}`);
    const ws = new WebSocket(`${url}/${clientId}`);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setConnectionStatus('Connected');
      setSocket(ws);
    };
    
    ws.onmessage = (event) => {
      console.log('WebSocket message received:', event.data);
      const message = JSON.parse(event.data);
      setLastMessage(message);
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setConnectionStatus('Disconnected');
      setSocket(null);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('Error');
    };

    return () => {
      console.log('Cleaning up WebSocket connection');
      ws.close();
    };
  }, [url, clientId]);

  const sendMessage = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      console.log('Sending WebSocket message:', message);
      socket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected, cannot send message');
    }
  };

  return {
    socket,
    lastMessage,
    connectionStatus,
    sendMessage,
  };
};
