<script lang="ts">
	import { Link } from "@lucide/svelte";

	import type { ActionData } from "../../routes/s/[id=uuid]/$types";
	import { enhance } from "$app/forms";
	import { onMount, untrack } from "svelte";

	import { ws, type WSMessage } from "$lib/stores/websocket.svelte";

	let { form }: { form: ActionData } = $props();

	let videoCode: string = $state("");
	let player: any = null;
	let isReady: boolean = $state(false);
	let ignoreNextEvent: boolean = false;

	onMount(() => {
		if (!window.YT) {
			const tag = document.createElement("script");
			tag.src = "https://www.youtube.com/iframe_api";
			const firstScriptTag = document.getElementsByTagName("script")[0];
			firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
		}

		window.onYouTubeIframeAPIReady = () => {
			console.log("YouTube API ready");
		};
	});

	$effect(() => {
		if (videoCode && window.YT) {
			if (player) {
				player.destroy();
			}

			setTimeout(() => {
				player = new window.YT.Player("youtube-player", {
					videoId: videoCode,
					playerVars: {
						autoplay: 0,
						controls: 1
					},
					events: {
						onReady: onPlayerReady,
						onStateChange: onPlayerStateChange
					}
				});
			}, 100);
		}
	});

	function onPlayerReady(event: any) {
		isReady = true;
		console.log("Player ready");
	}

	function onPlayerStateChange(event: any) {
		if (ignoreNextEvent) {
			ignoreNextEvent = false;
			return;
		}

		const state = event.data;

		if (state === 1) {
			const currentTime = player.getCurrentTime();

			const message: WSMessage = {
				type: "video_play",
				data: { time: currentTime },
				for: "broadcast"
			};

			ws.send(message);

			console.log("Video played at", currentTime);
		}

		if (state === 2) {
			const currentTime = player.getCurrentTime();

			const message: WSMessage = {
				type: "video_pause",
				data: { time: currentTime },
				for: "broadcast"
			};

			ws.send(message);

			console.log("Video paused at", currentTime);
		}
	}

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
				if (player) {
					player.destroy();
					player = null;
				}
			}
		});
	});

	$effect(() => {
		const latestMessage = ws.latestMessage;
		if (!latestMessage) return;

		untrack(() => {
			if (latestMessage.type === "add_video" && latestMessage.data.videoCode !== videoCode) {
				videoCode = latestMessage.data.videoCode;
			}

			if (latestMessage.type === "remove_video" && videoCode) {
				videoCode = "";
				if (player) {
					player.destroy();
					player = null;
				}
			}

			if (!player || !isReady) return;

			if (latestMessage.type === "video_play") {
				ignoreNextEvent = true;

				const targetTime = latestMessage.data.time;
				const currentTime = player.getCurrentTime();

				if (Math.abs(currentTime - targetTime) > 1) {
					player.seekTo(targetTime, true);
				}

				player.playVideo();
				console.log("Synced play at", targetTime);
			}

			if (latestMessage.type === "video_pause") {
				ignoreNextEvent = true;

				const targetTime = latestMessage.data.time;

				player.seekTo(targetTime, true);
				player.pauseVideo();

				console.log("Synced pause at", targetTime);
			}

			if (latestMessage.type === "video_seek") {
				ignoreNextEvent = true;

				player.seekTo(latestMessage.data.time, true);

				console.log("Synced seek to", latestMessage.data.time);
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
		<div id="youtube-player" class="h-full w-full"></div>
	{/if}
</div>
