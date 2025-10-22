<script lang="ts">
	import {
		Check,
		Copy,
		Eye,
		EyeOff,
		Link,
		LogIn,
		LogOut,
		Mic,
		Plus,
		SquarePen,
		Users,
		Youtube
	} from "@lucide/svelte";

	import type { PageData } from "./$types";
	import { enhance } from "$app/forms";

	import Seo from "$lib/components/Seo.svelte";

	let { data }: { data: PageData } = $props();

	let copied = $state(false);
	let code = $state("9YC5VXW6JV");

	let showCurrentPassword: boolean = $state(false);
	let showNewPassword: boolean = $state(false);
	let showConfirmPassword: boolean = $state(false);

	const copyToClipboard = async () => {
		await navigator.clipboard.writeText(code.toUpperCase());
		copied = true;

		setTimeout(() => (copied = false), 1000);
	};
</script>

<Seo title="Dashboard" />

<header class="flex items-center justify-between border-b border-b-neutral-border px-10 py-4">
	<div class="flex items-center gap-2">
		<img src="/images/logos/rawph.svg" alt="Homepage" class="size-6" />
		<p>Rawph</p>
	</div>

	<button
		class="flex cursor-pointer items-center gap-2 rounded-md bg-error-50 px-4 py-2 text-body-bold text-error-700 hover:bg-error-100 active:bg-error-50"
		><LogOut size="18px" />Log Out</button
	>
</header>

<main class="mt-24 grid place-items-center">
	<section class="space-y-12">
		<div class="space-y-4 text-center">
			<h1 class="text-heading-1">Welcome, {data.user.name}</h1>
			<p class="text-body text-subtext-color">
				Start learning together with your friends through shared video experiences
			</p>
		</div>

		<!-- Invite Code -->
		<div
			class="flex items-center justify-between rounded-lg border border-neutral-border bg-neutral-50 px-6 py-4 shadow-sm"
		>
			<div class="space-y-1">
				<p class="text-body-bold">Your Invite Code</p>

				<p class="text-caption text-subtext-color">
					Share this code with friends to invite them to Rawph
				</p>
			</div>

			<div class="flex items-center gap-3">
				<p class="text-heading-3 text-brand-primary">{code.toUpperCase()}</p>

				<button
					class="flex cursor-pointer items-center gap-1 rounded-md border border-neutral-border bg-default-background px-3 py-1.5 text-body-bold text-brand-700 hover:bg-neutral-50 active:bg-default-background"
					onclick={copyToClipboard}
					>{#if copied}
						<Check size="16px" />
					{:else}
						<Copy size="16px" />
					{/if}Copy Code</button
				>
			</div>
		</div>

		<div class="grid grid-cols-2 gap-6">
			<!-- Create New Session -->
			<div
				class="flex max-w-96 flex-col justify-between rounded-lg border border-neutral-border p-8 shadow-sm"
			>
				<div class="space-y-6">
					<div class="w-fit rounded-full bg-brand-100">
						<Plus class="size-14 p-3" />
					</div>

					<div class="space-y-3">
						<h2 class="text-heading-2">Create New Session</h2>

						<p class="text-body text-subtext-color">
							Start a new learning session and invite your friends to join you for collaborative
							learning
						</p>
					</div>
				</div>

				<form action="?/create" method="POST" use:enhance>
					<button
						class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-brand-600 py-2 pr-4 pl-3 text-body-bold text-default-background hover:bg-brand-500 active:bg-brand-600"
						><Plus size="18px" /> New Session</button
					>
				</form>
			</div>

			<!-- Join Friend's Session -->
			<div class="max-w-96 space-y-8 rounded-lg border border-neutral-border p-8 shadow-sm">
				<div class="space-y-6">
					<div class="w-fit rounded-full bg-success-100">
						<LogIn class="size-14 p-3 text-success-800" />
					</div>

					<div class="space-y-3">
						<h2 class="text-heading-2">Join Friend's Session</h2>

						<p class="text-body text-subtext-color">
							Join an existing session with your learning friends using their session link
						</p>
					</div>
				</div>

				<form class="relative space-y-4" method="POST" action="?/join" use:enhance>
					<Link size="14px" class="absolute top-2 left-2 text-subtext-color" />

					<input
						type="url"
						name="sessionURL"
						placeholder="Paste session URL here..."
						class="w-full rounded-md border border-neutral-border bg-default-background py-1 pl-7 text-body text-brand-700 placeholder:text-caption"
						required
					/>

					<button
						class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-brand-600 py-2 pr-4 pl-3 text-body-bold text-default-background hover:bg-brand-500 active:bg-brand-600"
						type="submit"><Users size="16px" /> Join Session</button
					>
				</form>
			</div>
		</div>

		<!-- How it works -->
		<div class="mt-20 space-y-6">
			<h2 class="text-heading-2">How it works</h2>

			<div class="grid grid-cols-3 gap-6">
				<div class="max-w-60 space-y-3">
					<div class="w-fit rounded-full bg-brand-100">
						<Youtube class="size-10 p-3" />
					</div>

					<div class="space-y-2">
						<p class="text-body-bold">Share Videos</p>

						<p class="text-caption text-subtext-color">
							Copy any YouTube video link and watch it together in real-time
						</p>
					</div>
				</div>

				<div class="max-w-60 space-y-3">
					<div class="w-fit rounded-full bg-success-100">
						<Mic class="size-10 p-3 text-success-800" />
					</div>

					<div class="space-y-2">
						<p class="text-body-bold">Share Videos</p>

						<p class="text-caption text-subtext-color">
							Copy any YouTube video link and watch it together in real-time
						</p>
					</div>
				</div>

				<div class="max-w-60 space-y-3">
					<div class="w-fit rounded-full bg-warning-100">
						<SquarePen class="size-10 p-3 text-warning-800" />
					</div>

					<div class="space-y-2">
						<p class="text-body-bold">Share Videos</p>

						<p class="text-caption text-subtext-color">
							Copy any YouTube video link and watch it together in real-time
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Chnage Password -->
		<div class="my-24 space-y-6 rounded-lg border border-neutral-border p-8 shadow-sm">
			<div class="space-y-2">
				<h2 class="text-heading-2">Security Settings</h2>

				<p class="text-body text-subtext-color">Update your password to keep your account secure</p>
			</div>

			<form class="space-y-4" method="POST" action="?/manual" use:enhance>
				<div class="relative flex flex-col gap-1">
					<label for="currentPassword" class="text-body-bold"
						>Current Password <span class="text-error-500">*</span></label
					>

					<input
						id="currentPassword"
						type={showCurrentPassword ? "text" : "password"}
						name="currentPassword"
						placeholder="Enter your password"
						class="rounded-md border border-neutral-border px-2 py-2 text-body text-brand-700 placeholder:text-caption"
						required
					/>

					<button
						type="button"
						class="absolute top-8 right-2 w-fit cursor-pointer rounded-md p-1 hover:bg-default-background active:bg-neutral-50"
						onclick={() => {
							showCurrentPassword = !showCurrentPassword;
						}}
					>
						{#if showCurrentPassword}
							<Eye size="16px" />
						{:else}
							<EyeOff size="17px" />
						{/if}
					</button>

					<!-- {#if form?.error.fieldErrors.password} -->
					<!-- <p class="text-caption text-error-600">{form.error.fieldErrors.password}</p> -->
					<!-- {/if} -->
				</div>

				<div class="relative flex flex-col gap-1">
					<label for="newPassword" class="text-body-bold"
						>New Password <span class="text-error-500">*</span></label
					>

					<input
						id="newPassword"
						type={showNewPassword ? "text" : "password"}
						name="newPassword"
						placeholder="Enter your password"
						class="rounded-md border border-neutral-border px-2 py-2 text-body text-brand-700 placeholder:text-caption"
						required
					/>

					<button
						type="button"
						class="absolute top-8 right-2 w-fit cursor-pointer rounded-md p-1 hover:bg-default-background active:bg-neutral-50"
						onclick={() => {
							showNewPassword = !showNewPassword;
						}}
					>
						{#if showNewPassword}
							<Eye size="16px" />
						{:else}
							<EyeOff size="17px" />
						{/if}
					</button>

					<!-- {#if form?.error.fieldErrors.password} -->
					<!-- <p class="text-caption text-error-600">{form.error.fieldErrors.password}</p> -->
					<!-- {/if} -->
				</div>

				<div class="relative flex flex-col gap-1">
					<label for="confirmPassword" class="text-body-bold"
						>Confirm New Password <span class="text-error-500">*</span></label
					>

					<input
						id="confirmPassword"
						type={showConfirmPassword ? "text" : "password"}
						name="confirmPassword"
						placeholder="Enter your password"
						class="rounded-md border border-neutral-border px-2 py-2 text-body text-brand-700 placeholder:text-caption"
						required
					/>

					<button
						type="button"
						class="absolute top-8 right-2 w-fit cursor-pointer rounded-md p-1 hover:bg-default-background active:bg-neutral-50"
						onclick={() => {
							showConfirmPassword = !showConfirmPassword;
						}}
					>
						{#if showConfirmPassword}
							<Eye size="16px" />
						{:else}
							<EyeOff size="17px" />
						{/if}
					</button>

					<!-- {#if form?.error.fieldErrors.password} -->
					<!-- <p class="text-caption text-error-600">{form.error.fieldErrors.password}</p> -->
					<!-- {/if} -->
				</div>

				<button
					class="mt-2 w-full cursor-pointer rounded-md bg-brand-600 px-4 py-2 text-body-bold text-default-background hover:bg-brand-500 active:bg-brand-600"
					>Update Password</button
				>
			</form>
		</div>
	</section>
</main>
