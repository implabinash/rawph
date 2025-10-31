type MessageType =
	| "new_join_request"
	| "cancel_join_request"
	| "add_new_participant"
	| "handle_mute"
	| "new_chat_message"
	| "add_video"
	| "remove_video";

export type WSMessage = {
	type: MessageType;
	data?: any;
	for: "ss" | "all" | "broadcast";
};

type ConnectionState = "disconnected" | "connecting" | "connected" | "error";

class WebSocketStore {
	private ws: WebSocket | null = $state(null);
	private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
	private reconnectAttempts = 0;
	private maxReconnectAttempts = 5;
	private wsUrl = $state("");
	private messages = $state<WSMessage[]>([]);

	connectionState = $state<ConnectionState>("disconnected");

	joinRequestsMessages = $derived<WSMessage[]>(
		this.messages.filter((m) => m.type === "new_join_request")
	);
	cancelRequestMessages = $derived<WSMessage[]>(
		this.messages.filter((m) => m.type === "cancel_join_request")
	);
	newParticipantsMessages = $derived<WSMessage[]>(
		this.messages.filter((m) => m.type === "add_new_participant")
	);
	chatMessages = $derived<WSMessage[]>(this.messages.filter((m) => m.type === "new_chat_message"));
	latestMessage = $derived<WSMessage | undefined>(
		this.messages.length > 0 ? this.messages[this.messages.length - 1] : undefined
	);

	connect(url: string) {
		if (this.ws?.readyState === WebSocket.OPEN) {
			console.log("WebSocket already connected");
			return;
		}

		this.wsUrl = url;
		this.connectionState = "connecting";

		try {
			this.ws = new WebSocket(url);
			this.setupListeners();
		} catch (error) {
			console.error("WebSocket connection error:", error);
			this.connectionState = "error";
			this.scheduleReconnect();
		}
	}

	private setupListeners() {
		if (!this.ws) return;

		this.ws.onopen = () => {
			console.log("WebSocket connected");
			this.connectionState = "connected";
			this.reconnectAttempts = 0;
		};

		this.ws.onmessage = (event) => {
			try {
				const message: WSMessage = JSON.parse(event.data);
				this.messages = [...this.messages.slice(-100), message];
			} catch (error) {
				console.error("Failed to parse message:", error);
			}
		};

		this.ws.onerror = (error) => {
			console.error("WebSocket error:", error);
			this.connectionState = "error";
		};

		this.ws.onclose = (event) => {
			console.log("WebSocket closed:", event.code, event.reason);
			this.connectionState = "disconnected";
			this.scheduleReconnect();
		};
	}

	send(message: WSMessage): boolean {
		if (this.ws?.readyState !== WebSocket.OPEN) {
			console.warn("WebSocket not connected. Cannot send message.");
			return false;
		}

		try {
			this.ws.send(JSON.stringify(message));
			return true;
		} catch (error) {
			console.error("Failed to send message:", error);
			return false;
		}
	}

	private scheduleReconnect() {
		if (this.reconnectTimer) return;

		if (this.reconnectAttempts >= this.maxReconnectAttempts) {
			console.error("Max reconnection attempts reached");
			return;
		}

		this.reconnectAttempts++;
		const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);

		console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

		this.reconnectTimer = setTimeout(() => {
			this.reconnectTimer = null;
			if (this.wsUrl) {
				this.connect(this.wsUrl);
			}
		}, delay);
	}

	disconnect() {
		if (this.reconnectTimer) {
			clearTimeout(this.reconnectTimer);
			this.reconnectTimer = null;
		}

		if (this.ws) {
			this.ws.close();
			this.ws = null;
		}

		this.connectionState = "disconnected";
		this.reconnectAttempts = 0;
	}

	clearMessages() {
		this.messages = [];
	}

	getLatestMessage(type: string): WSMessage | undefined {
		return [...this.messages].reverse().find((msg) => msg.type === type);
	}
}

export const ws = new WebSocketStore();
