// import { PUBLIC_BASE_URL } from "$env/static/public";

// type SessionData = {
// 	userID: string;
// 	name: string;
// 	image: string;
// 	role: "ss" | "sr" | "sm";
// };

// type WSMessage = {
// 	type: string;
// 	[key: string]: any;
// };

// class WebSocketServer {
// 	private ws = $state<WebSocket | null>(null);

// 	connect(studySessionID: string, sessionData: SessionData) {
// 		if (this.ws?.readyState === WebSocket.OPEN) {
// 			console.log("WebSocket already connected");
// 			return;
// 		}

// 		const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";

// 		const params = new URLSearchParams({
// 			user_id: sessionData.userID,
// 			name: sessionData.name,
// 			image: sessionData.image,
// 			user_role: sessionData.role
// 		});

// 		const wsURL = `${protocol}//${PUBLIC_BASE_URL}/ws/${studySessionID}?${params}`;

// 		this.ws = new WebSocket(wsURL);

// 		this.ws.onopen = () => {
// 			console.log("WebSocket connected");
// 		};

// 		this.ws.onmessage = (event) => {
// 			try {
// 				const data = JSON.parse(event.data);
// 				this.handleMessage(data);
// 			} catch (err) {
// 				console.error("Failed to parse message:", err);
// 			}
// 		};

// 		this.ws.onclose = () => {
// 			console.log("WebSocket disconnected");
// 		};

// 		this.ws.onerror = (error) => {
// 			console.error("WebSocket error:", error);
// 		};
// 	}
// 	send(message: WSMessage) {
// 		if (this.ws?.readyState === WebSocket.OPEN) {
// 			this.ws.send(JSON.stringify(message));
// 		} else {
// 			console.error("WebSocket is not connected");
// 		}
// 	}

// 	disconnect() {
// 		if (this.ws) {
// 			this.ws.close();
// 			this.ws = null;
// 		}
// 	}

// 	private handleMessage(message: WSMessage) {
// 		if (message.type === "request_new_participant") {
// 			const existingPendingRequest = this.pendingParticipants.find(
// 				(pendingParticipant) => pendingParticipant.userID === message.data.userID
// 			);

// 			if (!existingPendingRequest) {
// 				this.pendingParticipants.push(message.data);
// 			}
// 		}

// 		console.log(message);
// 		if (message.type === "add_new_participant") {
// 			const existingParticipant = this.participants.find(
// 				(participant) => participant.userID === message.data.userID
// 			);

// 			if (!existingParticipant) {
// 				this.participants.push(message.data);
// 			}
// 		}

// 		if (message.type === "cancel_participant_requset") {
// 			this.pendingParticipants = this.pendingParticipants.filter(
// 				(pendingParticipant) => pendingParticipant.userID !== message.data.userID
// 			);
// 		}
// 	}
// }

// export const websocketServer = new WebSocketServer();
