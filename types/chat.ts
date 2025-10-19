export interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: number;
}

export interface ChatSession {
    id: string;
    title: string;
    messages: Message[];
    createdAt: number;
    updatedAt: number;
}

export interface ChatState {
    messages: Message[];
    isLoading: boolean;
}

export interface ChatRequest {
    messages: Message[];
}

export interface ChatResponse {
    message: string;
    error?: string;
}

