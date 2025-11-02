<script lang="ts">
	import { Eye, EyeOff } from "@lucide/svelte";

	import type { ActionData } from "./$types";
	import { enhance } from "$app/forms";
	import { resolve } from "$app/paths";

	import Seo from "$lib/components/Seo.svelte";

	let { form }: { form: ActionData } = $props();

	let showPassword: boolean = $state(false);
	let isSubmitting: boolean = $state(false);
	let isGoogleSubmitting: boolean = $state(false);
</script>

<Seo title="Join" />

<main class="grid h-screen grid-cols-1 place-items-center lg:grid-cols-2">
	<section class="w-full space-y-8 p-8 md:w-112">
		<div class="flex flex-col items-center space-y-5 text-center">
			<img src="/images/logos/rawph.svg" alt="Rawph Logo" class="size-8" />

			<div class="space-y-2">
				<h1 class="text-heading-2">Welcome to Rawph</h1>

				<p class="text-body text-subtext-color">Register to continue learning together</p>
			</div>
		</div>

		<!-- User Facing Error Messages -->
		{#if form?.message}
			<div class="rounded-md border border-error-200 bg-error-50 px-4 py-3">
				<p class="text-body text-error-700">{form.message}</p>
			</div>
		{/if}

		<form
			class="space-y-4"
			method="POST"
			action="?/manual"
			use:enhance={() => {
				isSubmitting = true;

				return async ({ update }) => {
					await update();
					isSubmitting = false;
				};
			}}
		>
			<!-- Name Field -->
			<div class="flex flex-col gap-1">
				<label for="name" class="text-body-bold">Name <span class="text-error-500">*</span></label>

				<input
					id="name"
					type="text"
					name="name"
					value={form?.data.name ?? ""}
					placeholder="Enter your name"
					class="rounded-md border px-2 py-2 text-body text-brand-700 placeholder:text-caption"
					class:border-neutral-border={!form?.error?.name}
					class:border-error-500={form?.error?.name}
					required
				/>

				{#if form?.error?.name}
					<p class="text-caption text-error-600">{form.error.name[0]}</p>
				{/if}
			</div>

			<!-- Email Field -->
			<div class="flex flex-col gap-1">
				<label for="email" class="text-body-bold">Email <span class="text-error-500">*</span></label
				>

				<input
					id="email"
					type="email"
					name="email"
					value={form?.data.email}
					placeholder="Enter your email"
					class="rounded-md border px-2 py-2 text-body text-brand-700 placeholder:text-caption"
					class:border-neutral-border={!form?.error?.email}
					class:border-error-500={form?.error?.email}
					required
				/>

				{#if form?.error?.email}
					<p class="text-caption text-error-600">{form.error.email[0]}</p>
				{/if}
			</div>

			<!-- Password Filed -->
			<div class="relative flex flex-col gap-1">
				<label for="password" class="text-body-bold"
					>Password <span class="text-error-500">*</span></label
				>

				<input
					id="password"
					type={showPassword ? "text" : "password"}
					name="password"
					placeholder="Enter your password"
					class="rounded-md border px-2 py-2 text-body text-brand-700 placeholder:text-caption"
					class:border-neutral-border={!form?.error?.password}
					class:border-error-500={form?.error?.password}
					required
				/>

				<button
					type="button"
					class="absolute top-8 right-2 w-fit cursor-pointer rounded-md p-1 hover:bg-default-background active:bg-neutral-50"
					onclick={() => {
						showPassword = !showPassword;
					}}
				>
					{#if showPassword}
						<Eye size="16px" />
					{:else}
						<EyeOff size="16px" />
					{/if}
				</button>

				{#if form?.error?.password}
					<p class="text-caption text-error-600">{form.error.password[0]}</p>
				{/if}
			</div>

			<!-- Submit Button -->
			<button
				class="mt-2 w-full cursor-pointer rounded-md bg-brand-600 px-4 py-2 text-body-bold text-default-background hover:bg-brand-500 active:bg-brand-600"
				type="submit">{isSubmitting ? "Creating account..." : "Join Rawph"}</button
			>
		</form>

		<!-- OR Devider -->
		<div class="flex items-center gap-2 text-caption text-subtext-color">
			<hr class="flex-1" />
			<span>or</span>
			<hr class="flex-1" />
		</div>

		<!-- Google Sign Up Button -->
		<form method="GET" action="/api/v1/auth/google" class="space-y-3">
			<button
				class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-neutral-border bg-default-background px-4 py-2 text-body-bold text-brand-700 shadow-2xs hover:bg-neutral-50 active:bg-default-background"
				onclick={() => {
					isGoogleSubmitting = true;
				}}
				type="submit"
			>
				<img src="/images/logos/google.svg" alt="Google" class="" />{isGoogleSubmitting
					? "Connecting..."
					: "Continue with Google"}</button
			>
		</form>

		<!-- Sign In Page -->
		<p class="text-center text-body text-subtext-color">
			Already have an account? <a href={resolve("/signin", {})} class="text-blue-700 underline"
				>Sign In</a
			>
		</p>
	</section>

	<!-- Left Image -->
	<section class="hidden h-full w-full p-4 lg:block">
		<div
			class="h-full w-full rounded-lg bg-[url('/images/bg.png')] bg-cover bg-center bg-no-repeat"
		></div>
	</section>
</main>
