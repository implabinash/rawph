<script lang="ts">
	import { Check } from "@lucide/svelte";

	import type { ActionData } from "./$types";
	import { enhance } from "$app/forms";

	import Seo from "$lib/components/Seo.svelte";

	let { form }: { form: ActionData } = $props();

	let isVerifying: boolean = $state(false);
</script>

<Seo title="Invite" />

<main class="grid h-screen place-items-center">
	<section class="w-[90%] space-y-8 md:max-w-100">
		<div class="flex flex-col items-center gap-6">
			<img src="/images/logos/rawph.svg" alt="Rawph Logo" class="size-8" />

			<div class="flex w-full flex-col items-center justify-center space-y-3 text-center">
				<h1 class="text-heading-1">Welcome to Rawph</h1>

				<p class="w-[80%] text-body text-subtext-color">
					Rawph is currently in private beta. Enter your invite code to get started.
				</p>
			</div>
		</div>

		{#if form?.message}
			<div class="rounded-md border border-error-200 bg-error-50 px-4 py-3">
				<p class="text-body text-error-700">{form.message}</p>
			</div>
		{/if}

		<form
			class="space-y-2"
			method="POST"
			use:enhance={() => {
				isVerifying = true;

				return async ({ update }) => {
					await update();
					isVerifying = false;
				};
			}}
		>
			<div class="flex flex-col gap-1">
				<label for="code" class="text-body-bold"
					>Invite Code <span class="text-error-500">*</span></label
				>

				<input
					id="code"
					type="text"
					name="code"
					placeholder="Enter your invite code"
					class="rounded-md border border-neutral-border px-2 py-2 text-body text-brand-700 placeholder:text-caption"
					required
				/>

				{#if form?.error.code}
					<p class="text-caption text-error-600">{form.error.code[0]}</p>
				{/if}
			</div>

			<button
				class="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-body-bold text-default-background hover:bg-brand-500 active:bg-brand-600"
				type="submit"
			>
				{#if isVerifying}
					<img src="/images/icons/loader.svg" alt="loader" class="size-5" />
				{:else}
					<Check size="18px" /> Verify Code
				{/if}
			</button>
		</form>

		<div class="flex items-center gap-2 text-caption text-subtext-color">
			<hr class="flex-1" />
			<span>or</span>
			<hr class="flex-1" />
		</div>

		<div class="space-y-2 rounded-md bg-neutral-50 p-6 text-center shadow">
			<p class="text-heading-3">Don't have an invite code?</p>

			<p class="text-body text-subtext-color">
				No worries! You're already on our waitlist and we'll notify you as soon as the next beta
				launch opens up.
			</p>
		</div>
	</section>
</main>
