import React, { useState, useEffect, useRef } from 'react';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import LoadingAnimation from './LoadingAnimation';
import { Message, ProgressEvent, FinalEvent } from '../types';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Cleanup function to close EventSource on unmount
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const handleSendMessage = async (newMessage: string) => {
    if (!newMessage.trim()) return;

    // Close any existing EventSource
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    setIsLoading(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: 'user', content: newMessage },
      { type: 'thinking', content: 'Analyzing your question...' },
    ]);

    try {
      // First, get the request ID
      const response = await fetch('http://localhost:5001/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: newMessage,
          budget: 1000000,
          maxBadAttempt: 3,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      const requestId = data.requestId;

      if (!requestId) {
        throw new Error('No request ID received');
      }

      // Then, establish SSE connection
      const eventSource = new EventSource(
        `http://localhost:5001/api/query?request_id=${requestId}`
      );
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        const eventData = JSON.parse(event.data);

        if (eventData.type === 'progress') {
          const progressEvent: ProgressEvent = {
            type: 'progress',
            step: eventData.step,
            budgetUsed: eventData.budgetUsed,
            trackers: eventData.trackers,
            actionState: eventData.actionState,
            gaps: eventData.gaps,
            badAttempts: eventData.badAttempts,
          };

          // Append the new progress message without filtering out previous ones
          setMessages((prevMessages) => [
            ...prevMessages.filter((msg) => msg.type !== 'progress' && msg.type !== 'thinking'),
            { type: 'progress', content: progressEvent },
          ]);
        } else if (eventData.type === 'final') {
          const finalEvent: FinalEvent = {
            type: 'final',
            answer: eventData.answer,
            thoughts: eventData.thoughts,
            references: eventData.references,
          };

          setMessages((prevMessages) => [
            ...prevMessages.filter((msg) => msg.type !== 'progress' && msg.type !== 'thinking'),
            { type: 'assistant', content: finalEvent },
          ]);
          eventSource.close();
          eventSourceRef.current = null;
          setIsLoading(false);
        } else if (eventData.type === 'error') {
          setMessages((prevMessages) => [
            ...prevMessages,
            { type: 'error', content: eventData.message },
          ]);
          eventSource.close();
          eventSourceRef.current = null;
          setIsLoading(false);
        }
      };

      eventSource.onerror = (error) => {
        console.error('EventSource failed:', error);
        setMessages((prevMessages) => [
          ...prevMessages.filter((msg) => msg.type !== 'progress' && msg.type !== 'thinking'),
          {
            type: 'error',
            content: 'An error occurred while fetching the response.',
          },
        ]);
        eventSource.close();
        eventSourceRef.current = null;
        setIsLoading(false);
      };
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prevMessages) => [
        ...prevMessages.filter((msg) => msg.type !== 'progress' && msg.type !== 'thinking'),
        {
          type: 'error',
          content:
            error instanceof Error
              ? error.message
              : 'An error occurred',
        },
      ]);
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message}
            showDetails={showDetails}
            setShowDetails={setShowDetails}
          />
        ))}
        {isLoading && <LoadingAnimation />}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSendMessage={handleSendMessage} />
      <button onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? 'Hide All Details' : 'Show All Details'}
      </button>
    </div>
  );
};

export default Chat;