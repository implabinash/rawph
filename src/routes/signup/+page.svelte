<script lang="ts">
	import { Eye, EyeOff } from "@lucide/svelte";

	import type { ActionData } from "./$types";
	import { enhance } from "$app/forms";
	import { resolve } from "$app/paths";

	import Seo from "$lib/components/Seo.svelte";

	let { form }: { form: ActionData } = $props();

	let showPassword: boolean = $state(false);
</script>

<Seo title="Join" />

<main class="grid h-screen place-items-center">
	<section class="w-112 space-y-8 p-8">
		<div class="space-y-2 text-center">
			<h1 class="text-heading-2">Welcome to Rawph</h1>

			<p class="text-body text-subtext-color">Register to continue learning together</p>
		</div>

		<form class="space-y-4" method="POST" action="?/manual" use:enhance>
			<div class="flex flex-col gap-1">
				<label for="name" class="text-body-bold">Name <span class="text-error-500">*</span></label>

				<input
					id="name"
					type="text"
					name="name"
					value={form?.data.name}
					placeholder="Enter your name"
					class="rounded-md border border-neutral-border px-2 py-2 text-body text-brand-700 placeholder:text-caption"
					required
				/>

				{#if form?.error.fieldErrors.name}
					<p class="text-caption text-error-600">{form.error.fieldErrors.name}</p>
				{/if}
			</div>

			<div class="flex flex-col gap-1">
				<label for="email" class="text-body-bold">Email <span class="text-error-500">*</span></label
				>

				<input
					id="email"
					type="email"
					name="email"
					value={form?.data.email}
					placeholder="Enter your email"
					class="rounded-md border border-neutral-border px-2 py-2 text-body text-brand-700 placeholder:text-caption"
					required
				/>

				{#if form?.error.fieldErrors.email}
					<p class="text-caption text-error-600">{form.error.fieldErrors.email}</p>
				{/if}
			</div>

			<div class="relative flex flex-col gap-1">
				<label for="password" class="text-body-bold"
					>Password <span class="text-error-500">*</span></label
				>

				<input
					id="password"
					type={showPassword ? "text" : "password"}
					name="password"
					placeholder="Enter your password"
					class="rounded-md border border-neutral-border px-2 py-2 text-body text-brand-700 placeholder:text-caption"
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

				{#if form?.error.fieldErrors.password}
					<p class="text-caption text-error-600">{form.error.fieldErrors.password}</p>
				{/if}
			</div>

			<button
				class="mt-2 w-full cursor-pointer rounded-md bg-brand-600 px-4 py-2 text-body-bold text-default-background hover:bg-brand-500 active:bg-brand-600"
				type="submit">Join Rawph</button
			>
		</form>

		<div class="flex items-center gap-2 text-caption text-subtext-color">
			<hr class="flex-1" />
			<span>or</span>
			<hr class="flex-1" />
		</div>

		<form action="">
			<button
				class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-neutral-border bg-default-background px-4 py-2 text-body-bold text-brand-700 hover:bg-neutral-50 active:bg-default-background"
				type="submit"
			>
				<img src="/images/logos/google.svg" alt="Google" class="" />Continue with Google</button
			>
		</form>

		<p class="text-center text-body text-subtext-color">
			Already have an account? <a href={resolve("/signin")} class="text-blue-700 underline"
				>Sign In</a
			>
		</p>
	</section>
</main>
