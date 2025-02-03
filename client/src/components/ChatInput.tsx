import React, { useState, KeyboardEvent } from 'react';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
    const [message, setMessage] = useState<string>('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (message.trim()) {
            onSendMessage(message.trim());
            setMessage('');
        }
    };

    const handleKeyPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSubmit(event);
        }
    };

    return (
        <form className="chat-input-form" onSubmit={handleSubmit}>
            <textarea
                className="chat-input"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question..."
                rows={1}
                autoFocus
            />
            <button
                type="submit"
                className="send-button"
                disabled={!message.trim()}
            >
                Send
            </button>
        </form>
    );
};

export default ChatInput; 