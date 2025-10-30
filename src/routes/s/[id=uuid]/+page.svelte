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
	import { ws } from "$lib/stores/websocket.svelte";

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let isApproved: boolean = $state(data.isApproved);

	onMount(() => {
		const studySessionID = page.url.pathname.split("/")[2];
		const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";

		const params = new URLSearchParams({
			user_id: data.user.id,
			name: data.user.name,
			image: data.user.image || "0",
			user_role: data.currentSP?.role || "sm"
		});

		const wsURL = `${protocol}//${PUBLIC_BASE_URL}/ws/${studySessionID}?${params}`;

		ws.connect(wsURL);

		return () => {
			ws.disconnect();
			ws.clearMessages();
		};
	});

	$effect(() => {
		const latestMessage = ws.newParticipantsMessages[ws.newParticipantsMessages.length - 1];

		if (latestMessage) {
			isApproved = true;
		}
	});

	onDestroy(() => {
		ws.disconnect();
		ws.clearMessages();
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
				<Controls user={data.user} joinRequests={data.allJoinRequests} allSPs={data.allSPs} />

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
		<Popup ss={data.ss!} {form} user={data.user} />
	{/if}
</main>

<!-- <svelte:window on:keydown|preventDefault={handleKeys} /> -->
