<script lang="ts">
	import { enhance } from "$app/forms";
	import type { User } from "$lib/utils/types";
	import { Clock } from "@lucide/svelte";
	import type { ActionData } from "../../routes/s/[id=uuid]/$types";

	let { ss, form }: { ss: User; form: ActionData } = $props();

	let isRequested: boolean = $state(false);
</script>

<section class="fixed inset-0 grid h-full place-items-center bg-default-font/40 backdrop-blur-sm">
	<div
		class="w-96 space-y-6 rounded-lg border border-neutral-border bg-default-background p-8 shadow-lg"
	>
		<div class="space-y-4 text-center">
			<img
				src={ss.image.startsWith("http") ? ss.image : `/images/avatars/${ss.image}.webp`}
				alt={ss.name}
				class="mx-auto size-14 rounded-full"
			/>

			<div class="space-y-2">
				<h1 class="text-heading-2">
					{#if isRequested}
						Waiting for approval
					{:else}
						You need approval
					{/if}
				</h1>

				<p class="text-body text-subtext-color">
					{ss.name} needs to approve your request to join the session.
				</p>
			</div>
		</div>

		<div class="mx-auto flex items-center justify-center gap-2">
			<Clock size="20px" class="text-btext-brand-800 rounded-full bg-brand-100 p-1" />

			<p class="text-caption text-subtext-color">Usually responds within a minute</p>
		</div>

		{#if isRequested}
			<div class="flex items-center justify-center gap-2">
				<div class="size-2 animate-bounce rounded-full bg-neutral-700"></div>
				<div
					class="size-2 animate-bounce rounded-full bg-neutral-700"
					style="animation-delay: 0.2s"
				></div>
				<div
					class="size-2 animate-bounce rounded-full bg-neutral-700"
					style="animation-delay: 0.4s"
				></div>
			</div>
		{/if}

		{#if isRequested}
			<form method="POST" action="?/request" use:enhance>
				<button
					class="w-full cursor-pointer rounded-md border border-neutral-border py-2 text-body-bold text-neutral-700 hover:bg-neutral-50 active:bg-default-background"
					>Cancel Request</button
				>
			</form>
		{:else}
			<form>
				<button
					class="w-full cursor-pointer rounded-md bg-brand-600 py-2 text-body-bold text-default-background hover:bg-brand-500 active:bg-brand-600"
					>Ask to Join</button
				>
			</form>
		{/if}
	</div>
</section>
