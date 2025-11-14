import { ws } from "./websocket.svelte";

class SimpleAudio {
	private localStream: MediaStream | null = $state(null);
	private peerConnections: Map<string, RTCPeerConnection> = new Map();
	private myUserID: string = "";

	isMuted = $state(true);
	isEnabled = $state(false);

	async init(userID: string) {
		this.myUserID = userID;

		try {
			this.localStream = await navigator.mediaDevices.getUserMedia({
				audio: true,
				video: false
			});

			this.localStream.getAudioTracks()[0].enabled = false;

			this.isEnabled = true;
			console.log("Audio ready");
		} catch (err) {
			console.error("Mic error:", err);
		}
	}

	toggleMute() {
		if (!this.localStream) return;

		this.isMuted = !this.isMuted;
		this.localStream.getAudioTracks()[0].enabled = !this.isMuted;

		ws.send({
			type: "handle_mute",
			data: { userID: this.myUserID, isMuted: this.isMuted },
			for: "broadcast"
		});
	}

	async startCall(remoteUserID: string) {
		if (this.peerConnections.has(remoteUserID)) {
			console.log(`Already have connection with ${remoteUserID}`);
			return;
		}

		const pc = new RTCPeerConnection({
			iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
		});

		this.peerConnections.set(remoteUserID, pc);

		this.localStream?.getTracks().forEach((track) => {
			pc.addTrack(track, this.localStream!);
		});

		pc.ontrack = (event) => {
			const audio = new Audio();
			audio.srcObject = event.streams[0];
			audio.play();
		};

		pc.onicecandidate = (event) => {
			if (event.candidate) {
				ws.send({
					type: "webrtc_ice",
					data: { ice: event.candidate, fromUserID: this.myUserID, toUserID: remoteUserID },
					for: "broadcast"
				});
			}
		};

		const offer = await pc.createOffer();
		await pc.setLocalDescription(offer);

		ws.send({
			type: "webrtc_offer",
			data: { offer, fromUserID: this.myUserID, toUserID: remoteUserID },
			for: "broadcast"
		});

		console.log(`Call started with ${remoteUserID}`);
	}

	async handleOffer(offer: RTCSessionDescriptionInit, fromUserID: string) {
		if (this.peerConnections.has(fromUserID)) {
			console.log(`Already have connection with ${fromUserID}`);
			return;
		}

		const pc = new RTCPeerConnection({
			iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
		});

		this.peerConnections.set(fromUserID, pc);

		this.localStream?.getTracks().forEach((track) => {
			pc.addTrack(track, this.localStream!);
		});

		pc.ontrack = (event) => {
			const audio = new Audio();
			audio.srcObject = event.streams[0];
			audio.play();
		};

		pc.onicecandidate = (event) => {
			if (event.candidate) {
				ws.send({
					type: "webrtc_ice",
					data: { ice: event.candidate, fromUserID: this.myUserID, toUserID: fromUserID },
					for: "broadcast"
				});
			}
		};

		await pc.setRemoteDescription(offer);
		const answer = await pc.createAnswer();
		await pc.setLocalDescription(answer);

		ws.send({
			type: "webrtc_answer",
			data: { answer, fromUserID: this.myUserID, toUserID: fromUserID },
			for: "broadcast"
		});

		console.log(`Answered call from ${fromUserID}`);
	}

	async handleAnswer(answer: RTCSessionDescriptionInit, fromUserID: string) {
		const pc = this.peerConnections.get(fromUserID);
		if (!pc) {
			console.log(`No peer connection found for ${fromUserID}`);
			return;
		}
		await pc.setRemoteDescription(answer);
		console.log(`Call connected with ${fromUserID}`);
	}

	async handleIce(ice: RTCIceCandidateInit, fromUserID: string) {
		const pc = this.peerConnections.get(fromUserID);
		if (!pc) {
			console.log(`No peer connection found for ICE from ${fromUserID}`);
			return;
		}
		await pc.addIceCandidate(ice);
	}

	removePeer(userID: string) {
		const pc = this.peerConnections.get(userID);
		if (pc) {
			pc.close();
			this.peerConnections.delete(userID);
			console.log(`Removed peer connection for ${userID}`);
		}
	}

	hasPeerConnection(userID: string): boolean {
		return this.peerConnections.has(userID);
	}

	cleanup() {
		this.localStream?.getTracks().forEach((track) => track.stop());
		this.peerConnections.forEach((pc) => pc.close());
		this.peerConnections.clear();
		this.localStream = null;
		this.isEnabled = false;
	}
}

export const audio = new SimpleAudio();
