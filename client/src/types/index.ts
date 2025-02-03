export interface Trackers {
    tokenUsage?: number;
    tokenBreakdown?: {
        agent?: number;
        read?: number;
    };
    [key: string]: any;
}

export interface ActionState {
    action: string;
    thoughts: string;
    URLTargets?: string[];
    answer?: string;
    questionsToAnswer?: string[];
    references?: string[];
    searchQuery?: string;
}

export interface Evaluation {
    definitive: boolean;
    reason?: string;
}

export interface ProgressEvent {
    type: 'progress';
    step: number;
    budgetUsed?: number;
    trackers: Trackers;
    actionState: ActionState;
    badAttempts?: number;
    gaps?: string[];
    evaluation?: Evaluation;
}

export interface FinalEvent {
    type: 'final';
    answer: string;
    thoughts?: string;
    references?: string[];
}

export type MessageType = 'user' | 'assistant' | 'error' | 'progress' | 'thinking';

export interface Message {
    type: MessageType;
    content: string | ProgressEvent | FinalEvent;
    showDetails?: boolean;
} 