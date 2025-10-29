<script lang="ts">
	import { Check, Copy, Link, LogOut, Mic, MicOff, RefreshCcw } from "@lucide/svelte";

	import { enhance } from "$app/forms";
	import { page } from "$app/state";

	import type { JoinRequests, SP } from "$lib/db/queries/studysessions.query";
	import { onMount } from "svelte";

	type Props = {
		allSPs: SP[];
		joinRequests: JoinRequests;
		ws: WebSocket | null;
	};

	let { allSPs, joinRequests, ws }: Props = $props();

	let url = $state(page.url);
	let isMute = $state(false);
	let copied = $state(false);
	let allJoinRequests: JoinRequests = $state(joinRequests);
	let newSPs: SP[] = $state(allSPs);

	$effect(() => {
		if (ws) {
			ws.addEventListener("message", async (event) => {
				const message = JSON.parse(event.data);

				if (
					message.type === "request_new_participant" ||
					message.type === "cancel_participant_requset"
				) {
					const res = await fetch(
						`/api/v1/study-session/${url.pathname.split("/")[2]}/join-requests`
					);

					const data = await res.json();
					allJoinRequests = data;
				}

				if (message.type === "new_participant_added") {
					const joinRequetsRes = await fetch(
						`/api/v1/study-session/${url.pathname.split("/")[2]}/join-requests`
					);

					const joinRequestsData = await joinRequetsRes.json();
					allJoinRequests = joinRequestsData;

					const newSPsRes = await fetch(
						`/api/v1/study-session/${url.pathname.split("/")[2]}/participants`
					);

					const newSPsData = await newSPsRes.json();
					newSPs = newSPsData;
				}
			});
		}
	});

	const copyToClipboard = async () => {
		await navigator.clipboard.writeText(url.toString());
		copied = true;
		setTimeout(() => (copied = false), 1000);
	};
</script>

<div
	class="flex h-full w-64 flex-col justify-between rounded-lg border border-neutral-border bg-neutral-50 p-4"
>
	<div class="flex items-center justify-between">
		<button
			type="submit"
			class={`${isMute ? "bg-error-600 text-default-background hover:bg-error-500" : "bg-default-background hover:bg-neutral-100 active:bg-default-background"} cursor-pointer rounded-md border border-neutral-border p-2`}
			onclick={() => (isMute = !isMute)}
		>
			{#if isMute}
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
			{#each allJoinRequests as joinRequest (joinRequest.requestedBy)}
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

									const message = {
										type: "new_participant_added",
										for: "all"
									};

									if (ws?.readyState === WebSocket.OPEN) {
										ws.send(JSON.stringify(message));
									}
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

			{#each newSPs as sp (sp.userID)}
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

					<Mic size="16px" class="m-1" />
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
				<p class="truncate overflow-x-clip text-caption-bold">{url}</p>
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
