<script lang="ts">
	import { Link } from "@lucide/svelte";

	import type { ActionData } from "../../routes/[id=uuid]/$types";
	import { enhance } from "$app/forms";

	let { form }: { form: ActionData } = $props();

	let videoCode: string = $state("");

	$effect(() => {
		if (!videoCode) {
			videoCode = form?.videoCode || "";
		}
	});
</script>

<div
	class="grid h-full w-full place-items-center rounded-md border border-neutral-border bg-neutral-100"
>
	{#if !videoCode}
		<form class="relative" method="POST" action="?/youtube" use:enhance>
			<Link size="14px" class="absolute top-2 left-2 text-subtext-color" />

			<input
				type="url"
				name="videoURL"
				placeholder="Paste YouTube URL here..."
				class="w-112 rounded-md border border-neutral-border bg-default-background py-1 pl-7 text-body text-brand-700 placeholder:text-caption"
				required
			/>
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
