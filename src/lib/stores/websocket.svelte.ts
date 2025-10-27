import { PUBLIC_BASE_URL } from "$env/static/public";

type SessionData = {
	userId: string;
	name: string;
	image: string;
	role: "ss" | "sr" | "sm";
};

type WSMessage = {
	type: string;
	[key: string]: any;
};

class WebSocketServer {
	private ws = $state<WebSocket | null>(null);

	public messages = $state<WSMessage[]>([]);
	public participants = $state<SessionData[]>([]);
	public pendingParticipants = $state<SessionData[]>([]);

	connect(studySessionId: string, sessionData: SessionData) {
		if (this.ws?.readyState === WebSocket.OPEN) {
			console.log("WebSocket already connected");
			return;
		}

		const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";

		const params = new URLSearchParams({
			user_id: sessionData.userId,
			name: sessionData.name,
			image: sessionData.image,
			user_role: sessionData.role
		});

		const wsUrl = `${protocol}//${PUBLIC_BASE_URL}/ws/${studySessionId}?${params}`;

		this.ws = new WebSocket(wsUrl);

		this.ws.onopen = () => {
			console.log("WebSocket connected");
		};

		this.ws.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);
				this.handleMessage(data);
			} catch (err) {
				console.error("Failed to parse message:", err);
			}
		};

		this.ws.onclose = () => {
			console.log("WebSocket disconnected");
		};

		this.ws.onerror = (error) => {
			console.error("WebSocket error:", error);
		};
	}

	private handleMessage(message: WSMessage) {
		if (message.type === "request_new_participant") {
			const existingPendingRequest = this.pendingParticipants.find(
				(pendingParticipant) => pendingParticipant.userId === message.data.userId
			);

			if (!existingPendingRequest) {
				this.pendingParticipants.push(message.data);
			}
		}

		if (message.type === "cancel_participant_requset") {
			this.pendingParticipants = this.pendingParticipants.filter(
				(pendingParticipant) => pendingParticipant.userId !== message.data.userId
			);
		}
	}

	send(message: WSMessage) {
		if (this.ws?.readyState === WebSocket.OPEN) {
			this.ws.send(JSON.stringify(message));
		} else {
			console.error("WebSocket is not connected");
		}
	}

	disconnect() {
		if (this.ws) {
			this.ws.close();
			this.ws = null;
		}

		this.messages = [];
		this.participants = [];
	}
}

export const websocketServer = new WebSocketServer();
