<script lang="ts">
	import { Check, Copy, Link, LogOut, Mic, MicOff, RefreshCcw, X } from "@lucide/svelte";

	import { enhance } from "$app/forms";
	import { page } from "$app/state";

	let url = $state(page.url);
	let isMute = $state(false);
	let copied = $state(false);

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

		<form method="POST" action="?/hand" use:enhance>
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
			<div class="flex items-center justify-between rounded-md bg-neutral-100 p-1">
				<div class="flex items-center gap-2">
					<img src="/images/placeholders/0.png" alt="Partcipants" class="size-5 rounded-full" />

					<p class="text-caption-bold">Person Name</p>
				</div>

				<div class="flex items-center gap-1">
					<form method="POST" action="?/accept" use:enhance>
						<button
							type="submit"
							class="cursor-pointer rounded-md border border-neutral-border bg-success-50 p-1 text-success-700 hover:bg-success-100 active:bg-success-50"
						>
							<Check size="16px" />
						</button>
					</form>

					<form method="POST" action="?/reject" use:enhance>
						<button
							class="cursor-pointer rounded-md border border-neutral-border bg-error-50 p-1 text-error-700 hover:bg-error-100 active:bg-error-50"
						>
							<X size="16px" />
						</button>
					</form>
				</div>
			</div>
			<div class="flex items-center justify-between rounded-md bg-neutral-100 p-1">
				<div class="flex items-center gap-2">
					<img src="/images/placeholders/0.png" alt="Partcipants" class="size-5 rounded-full" />

					<p class="text-caption-bold">Person Name</p>
				</div>

				<Mic size="16px" class="m-1" />
			</div>
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
