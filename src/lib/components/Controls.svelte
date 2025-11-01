<script lang="ts">
	import { Check, Copy, Link, LogOut, Mic, MicOff, RefreshCcw } from "@lucide/svelte";

	import { enhance } from "$app/forms";
	import { page } from "$app/state";
	import { untrack } from "svelte";

	import type { JoinRequests, SP } from "$lib/db/queries/studysessions.query";
	import { ws, type WSMessage } from "$lib/stores/websocket.svelte";
	import type { User } from "$lib/db/schemas/user.schema";
	import { audio } from "$lib/stores/audio.svelte";

	type Props = {
		user: User;
		allSPs: SP[];
		joinRequests: JoinRequests;
	};

	let { user, allSPs, joinRequests }: Props = $props();

	let copied = $state(false);

	let muteList: Record<string, boolean> = $state({});

	$effect(() => {
		const latestMessage = ws.latestMessage;

		if (!latestMessage) return;

		untrack(() => {
			if (latestMessage.type === "handle_mute") {
				muteList[latestMessage.data.userID] = latestMessage.data.isMuted;
			}
		});
	});

	$effect(() => {
		allSPs.forEach((sp) => {
			if (!(sp.userID in muteList)) {
				muteList[sp.userID] = true;
			}
		});
	});

	const copyToClipboard = async () => {
		await navigator.clipboard.writeText(page.url.toString());
		copied = true;
		setTimeout(() => (copied = false), 1000);
	};

	const handleMute = () => {
		muteList[user.id] = !muteList[user.id];

		audio.toggleMute();
	};
</script>

<div
	class="flex h-full w-64 flex-col justify-between rounded-lg border border-neutral-border bg-neutral-50 p-4"
>
	<div class="flex items-center justify-between">
		<button
			type="submit"
			class={`${audio.isMuted ? "bg-error-600 text-default-background hover:bg-error-500" : "bg-default-background hover:bg-neutral-100 active:bg-default-background"} cursor-pointer rounded-md border border-neutral-border p-2`}
			onclick={handleMute}
			disabled={!audio.isEnabled}
		>
			{#if audio.isMuted}
				<MicOff size="20px" />
			{:else}
				<Mic size="20px" />
			{/if}
		</button>

		<form method="POST" action="?/changeVideo" use:enhance>
			<button
				type="submit"
				class="cursor-pointer rounded-md border border-neutral-border bg-default-background p-2 hover:bg-neutral-100 active:bg-default-background"
				><RefreshCcw
					size="20px"
					class="transition-transform duration-500 active:rotate-180"
				/></button
			>
		</form>

		<form method="POST" action="?/leave" use:enhance>
			<button
				type="submit"
				class="cursor-pointer rounded-md border border-neutral-border bg-error-600 p-2 text-default-background hover:bg-error-500 active:bg-error-600"
				><LogOut size="20px" /></button
			>
		</form>
	</div>

	<div class="space-y-2">
		<p class="text-caption-bold">Participants</p>

		<div class="space-y-2">
			{#each joinRequests as joinRequest (joinRequest.requestedBy)}
				<div class="flex items-center justify-between rounded-md bg-neutral-100 p-1">
					<div class="flex items-center gap-2">
						<img
							src={joinRequest.requestBy.image.startsWith("http")
								? joinRequest.requestBy.image
								: `/images/avatars/${joinRequest.requestBy.image}.webp`}
							alt={joinRequest.requestBy.name}
							class="size-5 rounded-full"
						/>

						<p class="text-caption-bold">{joinRequest.requestBy.name}</p>
					</div>

					<div class="flex items-center gap-1">
						<form
							method="POST"
							action="?/accept"
							use:enhance={() => {
								return async ({ update }) => {
									await update();

									const message: WSMessage = {
										type: "add_new_participant",
										for: "all"
									};

									ws.send(message);
								};
							}}
						>
							<input type="hidden" value={joinRequest.requestBy.id} name="pendingParticipant" />

							<button
								type="submit"
								class="flex cursor-pointer items-center gap-1 rounded-md border border-neutral-border bg-success-50 p-1 text-caption-bold text-success-700 hover:bg-success-100 active:bg-success-50"
							>
								<Check size="16px" /> Accept
							</button>
						</form>
					</div>
				</div>
			{/each}

			{#each allSPs as sp (sp.id)}
				<div class="flex items-center justify-between rounded-md bg-neutral-100 p-1">
					<div class="flex items-center gap-2">
						<img
							src={sp.user.image.startsWith("http")
								? sp.user.image
								: `/images/avatars/${sp.user.image}.webp`}
							alt={sp.user.name}
							class="size-5 rounded-full"
						/>

						<p class="text-caption-bold">{sp.user.name}</p>
					</div>

					{#if muteList[sp.userID]}
						<MicOff size="16px" class="m-1" />
					{:else}
						<Mic size="16px" class="m-1" />
					{/if}
				</div>
			{/each}
		</div>
	</div>

	<div class="space-y-1">
		<p class="text-caption-bold">Session Link</p>

		<div class="flex items-center gap-2">
			<div
				class="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-neutral-border bg-default-background p-2 text-subtext-color"
			>
				<Link size="12px" class="min-w-fit" />
				<p class="truncate overflow-x-clip text-caption-bold">{page.url}</p>
			</div>

			<button
				class="cursor-pointer rounded-md border border-neutral-border bg-default-background p-2 hover:bg-neutral-100 active:bg-default-background"
				onclick={copyToClipboard}
				>{#if copied}
					<Check size="16px" />
				{:else}
					<Copy size="16px" />
				{/if}</button
			>
		</div>
	</div>
</div>
