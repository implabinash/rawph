<script lang="ts">
	import { Clock } from "@lucide/svelte";

	import type { ActionData } from "../../routes/s/[id=uuid]/$types";
	import { enhance } from "$app/forms";
	import { onDestroy } from "svelte";

	import { ws, type WSMessage } from "$lib/stores/websocket.svelte";
	import type { SP } from "$lib/db/queries/studysessions.query";
	import type { User } from "$lib/db/schemas/user.schema";
	import toast from "svelte-french-toast";

	type Props = {
		ss: SP;
		user: User;
		form: ActionData;
	};

	let { ss, user }: Props = $props();

	let isRequested: boolean = $state(false);
	let isRequesting: boolean = $state(false);
	let isCanceling: boolean = $state(false);

	const cancelRequest = () => {
		const message: WSMessage = {
			type: "cancel_join_request",
			for: "ss"
		};

		ws.send(message);

		isRequested = false;
	};

	onDestroy(() => {
		cancelRequest();
	});

	if (typeof window !== "undefined") {
		window.addEventListener("beforeunload", cancelRequest);

		onDestroy(() => {
			window.removeEventListener("beforeunload", cancelRequest);
		});
	}
</script>

<section class="fixed inset-0 grid h-full place-items-center bg-default-font/40 backdrop-blur-sm">
	<div
		class="w-96 space-y-6 rounded-lg border border-neutral-border bg-default-background p-8 shadow-lg"
	>
		<div class="space-y-4 text-center">
			<img
				src={ss.user.image.startsWith("http")
					? ss.user.image
					: `/images/avatars/${ss.user.image}.webp`}
				alt={ss.user.name}
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
					{ss.user.name} needs to approve your request to join the session.
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
			<form
				method="POST"
				action="?/cancel"
				use:enhance={() => {
					isCanceling = true;

					return async ({ update }) => {
						await update();
						cancelRequest();

						isCanceling = false;
						toast.success("Request canceled.");
					};
				}}
			>
				<button
					class="flex w-full cursor-pointer items-center justify-center rounded-md border border-neutral-border py-2 text-body-bold text-neutral-700 hover:bg-neutral-50 active:bg-default-background"
					type="submit"
				>
					{#if isCanceling}
						<img src="/images/icons/loader.svg" alt="loader" class="size-5" />
					{:else}
						Cancel Request
					{/if}
				</button>
			</form>
		{:else}
			<form
				method="POST"
				action="?/request"
				use:enhance={() => {
					isRequesting = true;

					return async ({ update }) => {
						await update();

						const message: WSMessage = {
							type: "new_join_request",
							data: {
								userID: user.id,
								name: user.name,
								image: user.image,
								userRole: "sm"
							},
							for: "ss"
						};

						ws.send(message);

						isRequested = true;
						isRequesting = false;
						toast.success("Request sent.");
					};
				}}
			>
				<button
					class="flex w-full cursor-pointer items-center justify-center rounded-md bg-brand-600 py-2 text-body-bold text-default-background hover:bg-brand-500 active:bg-brand-600"
					type="submit"
				>
					{#if isRequesting}
						<img src="/images/icons/loader.svg" alt="loader" class="size-5" />
					{:else}
						Ask to Join
					{/if}
				</button>
			</form>
		{/if}
	</div>
</section>
