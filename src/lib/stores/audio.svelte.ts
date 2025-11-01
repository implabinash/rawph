import { ws } from "./websocket.svelte";

class SimpleAudio {
	private localStream: MediaStream | null = $state(null);
	private peerConnection: RTCPeerConnection | null = $state(null);
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

	async startCall() {
		this.peerConnection = new RTCPeerConnection({
			iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
		});

		this.localStream?.getTracks().forEach((track) => {
			this.peerConnection!.addTrack(track, this.localStream!);
		});

		this.peerConnection.ontrack = (event) => {
			const audio = new Audio();
			audio.srcObject = event.streams[0];
			audio.play();
		};

		// Send ICE candidates
		this.peerConnection.onicecandidate = (event) => {
			if (event.candidate) {
				ws.send({
					type: "webrtc_ice",
					data: { ice: event.candidate },
					for: "broadcast"
				});
			}
		};

		const offer = await this.peerConnection.createOffer();
		await this.peerConnection.setLocalDescription(offer);

		ws.send({
			type: "webrtc_offer",
			data: { offer },
			for: "broadcast"
		});

		console.log("Call started");
	}

	async handleOffer(offer: RTCSessionDescriptionInit) {
		this.peerConnection = new RTCPeerConnection({
			iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
		});

		this.localStream?.getTracks().forEach((track) => {
			this.peerConnection!.addTrack(track, this.localStream!);
		});

		this.peerConnection.ontrack = (event) => {
			const audio = new Audio();
			audio.srcObject = event.streams[0];
			audio.play();
		};

		this.peerConnection.onicecandidate = (event) => {
			if (event.candidate) {
				ws.send({
					type: "webrtc_ice",
					data: { ice: event.candidate },
					for: "broadcast"
				});
			}
		};

		await this.peerConnection.setRemoteDescription(offer);
		const answer = await this.peerConnection.createAnswer();
		await this.peerConnection.setLocalDescription(answer);

		ws.send({
			type: "webrtc_answer",
			data: { answer },
			for: "broadcast"
		});

		console.log("Answered call");
	}

	async handleAnswer(answer: RTCSessionDescriptionInit) {
		await this.peerConnection?.setRemoteDescription(answer);
		console.log("Call connected");
	}

	async handleIce(ice: RTCIceCandidateInit) {
		await this.peerConnection?.addIceCandidate(ice);
	}

	cleanup() {
		this.localStream?.getTracks().forEach((track) => track.stop());
		this.peerConnection?.close();
		this.localStream = null;
		this.peerConnection = null;
		this.isEnabled = false;
	}
}

export const audio = new SimpleAudio();
