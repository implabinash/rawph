<script lang="ts">
	import { PUBLIC_BASE_URL } from "$env/static/public";
	import type { ActionData, PageData } from "./$types";
	import { onDestroy, onMount } from "svelte";
	import { page } from "$app/state";

	import type { JoinRequests, SP } from "$lib/db/queries/studysessions.query";
	import { ws, type WSMessage } from "$lib/stores/websocket.svelte";
	import { audio } from "$lib/stores/audio.svelte";

	import Whiteboard from "$lib/components/Whiteboard.svelte";
	import Controls from "$lib/components/Controls.svelte";
	import Video from "$lib/components/Video.svelte";
	import Popup from "$lib/components/Popup.svelte";
	import Chat from "$lib/components/Chat.svelte";

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let allJoinRequests: JoinRequests = $state(data.allJoinRequests);
	let newSPs: SP[] = $state(data.allSPs);

	let isApproved: boolean = $state(data.isApproved);
	let studySessionID = page.url.pathname.split("/")[2];

	onMount(() => {
		const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";

		const params = new URLSearchParams({
			user_id: data.user.id,
			name: data.user.name,
			image: data.user.image || "0",
			user_role: data.currentSP?.role || "sm"
		});

		const wsURL = `${protocol}//${PUBLIC_BASE_URL}/ws/${studySessionID}?${params}`;

		ws.connect(wsURL);

		if (isApproved) {
			(async () => {
				await audio.init(data.user.id);

				if (newSPs.length > 1) {
					// Start call with each other participant
					for (const sp of newSPs) {
						if (sp.userID !== data.user.id) {
							audio.startCall(sp.userID);
						}
					}
				}
			})();

			joinStudySession();
		}

		return () => {
			leaveStudySession();
			audio.cleanup();
			ws.disconnect();
			ws.clearMessages();
		};
	});

	$effect(() => {
		const latestMessage = ws.latestMessage;

		if (!latestMessage) {
			return;
		}

		if (latestMessage.type == "new_join_request" || latestMessage.type === "cancel_join_request") {
			fetchJoinRequests();
		}

		if (latestMessage.type === "add_new_participant") {
			isApproved = true;

			fetchJoinRequests();
			fetchParticipants();

			if (!audio.isEnabled) {
				audio.init(data.user.id).then(async () => {
					const participants = await fetchParticipants();
					for (const sp of participants) {
						if (sp.userID !== data.user.id) {
							audio.startCall(sp.userID);
						}
					}
				});
			}
		}

		if (latestMessage.type === "webrtc_offer") {
			const { offer, fromUserID, toUserID } = latestMessage.data;
			if (toUserID === data.user.id || !toUserID) {
				audio.handleOffer(offer, fromUserID);
			}
		}

		if (latestMessage.type === "webrtc_answer") {
			const { answer, fromUserID, toUserID } = latestMessage.data;
			if (toUserID === data.user.id || !toUserID) {
				audio.handleAnswer(answer, fromUserID);
			}
		}

		if (latestMessage.type === "webrtc_ice") {
			const { ice, fromUserID, toUserID } = latestMessage.data;
			if (toUserID === data.user.id || !toUserID) {
				audio.handleIce(ice, fromUserID);
			}
		}

		if (latestMessage.type === "leave") {
			const userID = latestMessage.data.userID;
			audio.removePeer(userID);
			newSPs = newSPs.filter((sp) => sp.userID !== userID);
		}

		if (latestMessage.type === "join") {
			(async () => {
				const participants = await fetchParticipants();
				// Start call with the new participant
				for (const sp of participants) {
					if (sp.userID !== data.user.id && !audio.hasPeerConnection(sp.userID)) {
						audio.startCall(sp.userID);
					}
				}
			})();
		}
	});

	onDestroy(() => {
		leaveStudySession();
		audio.cleanup();
		ws.disconnect();
		ws.clearMessages();
	});

	const fetchParticipants = async () => {
		const res = await fetch(`/api/v1/study-session/${studySessionID}/participants`);
		const data: SP[] = await res.json();
		newSPs = data;
		return data;
	};

	const fetchJoinRequests = async () => {
		const res = await fetch(`/api/v1/study-session/${studySessionID}/join-requests`);
		const data: JoinRequests = await res.json();
		allJoinRequests = data;
	};

	const leaveStudySession = () => {
		const message: WSMessage = {
			type: "leave",
			data: {
				userID: data.user.id
			},
			for: "broadcast"
		};

		ws.send(message);
	};

	const joinStudySession = () => {
		const message: WSMessage = {
			type: "join",
			for: "broadcast"
		};

		ws.send(message);
	};

	// let keyBuffer = "";
	// let bufferTimeout: ReturnType<typeof setTimeout>;

	// const handleKeys = (e: KeyboardEvent) => {
	// 	if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
	// 		keyBuffer += e.key.toLowerCase();

	// 		clearTimeout(bufferTimeout);
	// 		bufferTimeout = setTimeout(() => (keyBuffer = ""), 2000);

	// 		if (keyBuffer.endsWith("awesome")) {
	// 			alert("🎉 Awesome!");
	// 			keyBuffer = "";
	// 		} else if (keyBuffer.endsWith("cool")) {
	// 			alert("😎 Cool!");
	// 			keyBuffer = "";
	// 		}
	// 	}
	// };
</script>

<main class="relative">
	<section class="flex h-screen gap-4 p-4">
		<section class="flex h-full w-192 flex-col gap-4">
			<div class="h-112 rounded-lg border border-neutral-border bg-neutral-50 p-4">
				<Video {form} />
			</div>

			<div class="flex min-h-0 flex-1 gap-4">
				<Controls user={data.user} joinRequests={allJoinRequests} allSPs={newSPs} />

				<Chat user={data.user} />
			</div>
		</section>

		<section
			class="relative flex h-full flex-1 flex-col gap-2 rounded-lg border border-neutral-border bg-neutral-50 p-4"
		>
			<Whiteboard />
		</section>
	</section>

	{#if !isApproved}
		<Popup ss={data.ss!} {form} user={data.user} />
	{/if}
</main>

<!-- <svelte:window on:keydown|preventDefault={handleKeys} /> -->
