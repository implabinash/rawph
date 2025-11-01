<script lang="ts">
	import { Link } from "@lucide/svelte";

	import type { ActionData } from "../../routes/s/[id=uuid]/$types";
	import { enhance } from "$app/forms";
	import { untrack } from "svelte";

	import { ws, type WSMessage } from "$lib/stores/websocket.svelte";

	let { form }: { form: ActionData } = $props();

	let videoCode: string = $state("");

	$effect(() => {
		const formVideoCode = form?.videoCode;
		const shouldChange = form?.change;

		untrack(() => {
			if (formVideoCode && formVideoCode !== videoCode) {
				videoCode = formVideoCode;

				const message: WSMessage = {
					type: "add_video",
					data: { videoCode: formVideoCode },
					for: "broadcast"
				};

				ws.send(message);
			}

			if (shouldChange && videoCode) {
				const message: WSMessage = {
					type: "remove_video",
					for: "broadcast"
				};

				ws.send(message);

				videoCode = "";
			}
		});
	});

	$effect(() => {
		const latestMessage = ws.latestMessage;

		if (!latestMessage) {
			return;
		}

		untrack(() => {
			if (latestMessage.type == "add_video" && latestMessage.data.videoCode !== videoCode) {
				videoCode = latestMessage.data.videoCode;
			}

			if (latestMessage.type === "remove_video" && videoCode) {
				videoCode = "";
			}
		});
	});
</script>

<div
	class="grid h-full w-full place-items-center rounded-md border border-neutral-border bg-neutral-100"
>
	{#if !videoCode}
		<form class="relative space-y-1.5" method="POST" action="?/addVideo" use:enhance>
			<Link size="14px" class="absolute top-2 left-2 text-subtext-color" />

			<input
				type="url"
				name="videoURL"
				placeholder="Paste YouTube URL here..."
				class="w-112 rounded-md border border-neutral-border bg-default-background py-1 pl-7 text-body text-brand-700 placeholder:text-caption"
				required
			/>

			{#if form?.error?.videoURL}
				<p class="text-caption text-error-600">{form.error.videoURL[0]}</p>
			{/if}
		</form>
	{:else}
		<iframe
			width="560"
			height="315"
			src={`https://www.youtube-nocookie.com/embed/${videoCode}`}
			title="YouTube video player"
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
			referrerpolicy="strict-origin-when-cross-origin"
			allowfullscreen
			class="h-full w-full"
		></iframe>
	{/if}
</div>
