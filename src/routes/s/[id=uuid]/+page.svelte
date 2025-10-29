<script lang="ts">
	import type { ActionData, PageData } from "./$types";
	import { onDestroy, onMount } from "svelte";
	import { page } from "$app/state";
	import { PUBLIC_BASE_URL } from "$env/static/public";

	import Whiteboard from "$lib/components/Whiteboard.svelte";
	import Controls from "$lib/components/Controls.svelte";
	import Video from "$lib/components/Video.svelte";
	import Popup from "$lib/components/Popup.svelte";
	import Chat from "$lib/components/Chat.svelte";

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let ws = $state<WebSocket | null>(null);
	let isApproved: boolean = $state(false);

	onMount(() => {
		const studySessionID = page.url.pathname.split("/")[2];

		if (ws?.readyState === WebSocket.OPEN) {
			console.log("WebSocket already connected");
			return;
		}

		const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";

		const params = new URLSearchParams({
			user_id: data.user.id,
			name: data.user.name,
			image: data.user.image || "0",
			user_role: data.currentSP?.role || "sm"
		});

		const wsURL = `${protocol}//${PUBLIC_BASE_URL}/ws/${studySessionID}?${params}`;

		ws = new WebSocket(wsURL);

		ws.addEventListener("open", () => {
			console.log("WebSocket connected successfully");
		});

		ws.addEventListener("error", (error) => {
			console.error("WebSocket connection error:", error);
		});

		ws.addEventListener("close", () => {
			console.log("WebSocket connection closed");
		});
	});

	$effect(() => {
		if (ws) {
			const handleMessage = async (event) => {
				const message = JSON.parse(event.data);

				if (message.type === "new_participant_added") {
					console.log("Participant approved!");
					isApproved = true;
				}
			};

			ws.addEventListener("message", handleMessage);

			return () => {
				if (ws) {
					ws.removeEventListener("message", handleMessage);
				}
			};
		}
	});

	$effect(() => {
		if (data.isApproved) {
			isApproved = data.isApproved;
		}
	});

	onDestroy(() => {
		if (ws?.readyState === WebSocket.OPEN) {
			ws.close();
		}
	});

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
				<Controls {ws} joinRequests={data.allJoinRequests} allSPs={data.allSPs} />

				<Chat />
			</div>
		</section>

		<section
			class="relative flex h-full flex-1 flex-col gap-2 rounded-lg border border-neutral-border bg-neutral-50 p-4"
		>
			<Whiteboard />
		</section>
	</section>

	{#if !isApproved}
		<Popup ss={data.ss!} {ws} {form} user={data.user} />
	{/if}
</main>

<!-- <svelte:window on:keydown|preventDefault={handleKeys} /> -->
