import React from 'react';
import { Message, ProgressEvent, FinalEvent } from '../types';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: Message;
  showDetails: boolean;
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, showDetails, setShowDetails }) => {
  if (!message || !message.content) {
    return (
      <div className="message error">
        <div className="message-content">
          <p>Invalid message data</p>
        </div>
      </div>
    );
  }

  if (message.type === 'progress' && typeof message.content !== 'string') {
    const progress = message.content as ProgressEvent;
    return (
      <div className="message progress">
        <div className="progress-content">
          <div className="progress-header">
            <p className="step">Step {progress.step}</p>
            {progress.budgetUsed !== undefined && (
              <p className="budget">
                Budget used: {(progress.budgetUsed * 100).toFixed(2)}%
              </p>
            )}
            {/* No need for a toggle button here, as it's controlled globally */}
          </div>

          {/* Always show gaps if they exist */}
          {progress.gaps && progress.gaps.length > 0 && (
            <div className="gaps">
              <h4>Gaps:</h4>
              <ul>
                {progress.gaps.map((gap, index) => (
                  <li key={index}>{gap}</li>
                ))}
              </ul>
            </div>
          )}

          {progress.actionState && (
            <div className="action-state">
              <p className="action">
                Action: {progress.actionState.action}
              </p>
              {showDetails && ( // Only show details if showDetails is true
                <>
                  <div className="thoughts">
                    <h4>Thoughts:</h4>
                    <p>{progress.actionState.thoughts}</p>
                  </div>
                  {progress.actionState.searchQuery && (
                    <div className="search-query">
                      <h4>Search Query:</h4>
                      <p>{progress.actionState.searchQuery}</p>
                    </div>
                  )}
                  {progress.actionState.answer && (
                    <div className="interim-answer">
                      <h4>Current Answer:</h4>
                      <p>{progress.actionState.answer}</p>
                    </div>
                  )}
                  {progress.actionState.URLTargets &&
                    progress.actionState.URLTargets.length > 0 && (
                      <div className="url-targets">
                        <h4>URLs:</h4>
                        <ul>
                          {progress.actionState.URLTargets.map((url, index) => (
                            <li key={index}>{url}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  {progress.actionState.questionsToAnswer &&
                    progress.actionState.questionsToAnswer.length > 0 && (
                      <div className="questions">
                        <h4>Questions to Answer:</h4>
                        <ul>
                          {progress.actionState.questionsToAnswer.map(
                            (q, index) => (
                              <li key={index}>{q}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                </>
              )}
            </div>
          )}

          {showDetails && progress.trackers && ( // Only show details if showDetails is true
            <div className="trackers">
              {progress.trackers.tokenUsage && (
                <p className="token-usage">
                  Token Usage: {progress.trackers.tokenUsage}
                </p>
              )}
              {progress.trackers.tokenBreakdown && (
                <div className="token-breakdown">
                  {progress.trackers.tokenBreakdown.agent && (
                    <p>Agent: {progress.trackers.tokenBreakdown.agent}</p>
                  )}
                  {progress.trackers.tokenBreakdown.read && (
                    <p>Read: {progress.trackers.tokenBreakdown.read}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {showDetails && progress.evaluation && ( // Only show details if showDetails is true
            <div className="evaluation">
              <h4>Evaluation:</h4>
              <p>
                <strong>Definitive:</strong>{' '}
                {progress.evaluation.definitive ? 'Yes' : 'No'}
              </p>
              {progress.evaluation.reason && (
                <p>
                  <strong>Reason:</strong> {progress.evaluation.reason}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  const getMessageClass = () => {
    switch (message.type) {
      case 'user':
        return 'message user';
      case 'assistant':
        return 'message assistant';
      case 'error':
        return 'message error';
      case 'thinking':
        return 'message thinking';
      default:
        return 'message';
    }
  };

  const renderFinalAnswer = (content: FinalEvent) => {
    return (
      <div className="final-answer">
        <ReactMarkdown>{content.answer}</ReactMarkdown>
        {/* Moved the button and details inside final-answer */}
        <button
          className="toggle-details"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
        {content.thoughts && showDetails && (
          <div className="thoughts">
            <h4>Thoughts:</h4>
            <p>{content.thoughts}</p>
          </div>
        )}
        {content.references && content.references.length > 0 && showDetails && (
          <div className="references">
            <h4>References:</h4>
            <ul>
              {content.references.map((ref, index) => (
                <li key={index}>{ref}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={getMessageClass()}>
      <div className="message-content">
        {typeof message.content === 'string' ? (
          <ReactMarkdown>{message.content}</ReactMarkdown>
        ) : message.type === 'assistant' &&
          (message.content as FinalEvent).answer ? (
          renderFinalAnswer(message.content as FinalEvent)
        ) : (
          <pre>{JSON.stringify(message.content, null, 2)}</pre>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;