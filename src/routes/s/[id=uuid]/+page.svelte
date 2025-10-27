<script lang="ts">
	import type { ActionData, PageData } from "./$types";
	import { page } from "$app/state";

	import Whiteboard from "$lib/components/Whiteboard.svelte";
	import Controls from "$lib/components/Controls.svelte";
	import Video from "$lib/components/Video.svelte";
	import Popup from "$lib/components/Popup.svelte";
	import Chat from "$lib/components/Chat.svelte";
	import { onDestroy, onMount } from "svelte";
	import { websocketServer } from "$lib/stores/websocket.svelte";

	let { data, form }: { data: PageData; form: ActionData } = $props();

	onMount(() => {
		const studySessionId = page.url.pathname.split("/")[2];

		websocketServer.connect(studySessionId, {
			userId: data.user.id,
			name: data.user.name,
			image: data.user.image || "0",
			role: data.sp?.role || "sm"
		});
	});

	onDestroy(() => {
		websocketServer.disconnect();
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
				<Controls user={data.user} />

				<Chat />
			</div>
		</section>

		<section
			class="relative flex h-full flex-1 flex-col gap-2 rounded-lg border border-neutral-border bg-neutral-50 p-4"
		>
			<Whiteboard />
		</section>
	</section>

	{#if !data.isApproved}
		<Popup ss={data.ss!} />
	{/if}
</main>

<!-- <svelte:window on:keydown|preventDefault={handleKeys} /> -->
