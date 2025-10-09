<script lang="ts">
	import { Copy, Link, LogOut, Plus, Users } from "@lucide/svelte";

	import { enhance } from "$app/forms";

	import Seo from "$lib/components/Seo.svelte";
</script>

<Seo title="Dashboard" />

<header class="flex items-center justify-between px-10 py-4">
	<div class="flex items-center gap-2">
		<img src="/images/logos/rawph.svg" alt="Homepage" class="size-6" />
		<p>Rawph</p>
	</div>

	<button
		class="flex cursor-pointer items-center gap-2 rounded-md bg-error-50 px-4 py-2 text-body-bold text-error-700 hover:bg-error-100 active:bg-error-50"
		><LogOut size="18px" /> Log Out</button
	>
</header>

<main class="mt-24 grid place-items-center">
	<section class="space-y-8">
		<div class="space-y-4 text-center">
			<h1 class="text-heading-1">Welcome</h1>
			<p class="text-body text-subtext-color">Create a new learning session or join your friends</p>
		</div>

		<div
			class="flex items-center justify-between rounded-lg border border-neutral-border bg-neutral-50 px-6 py-4"
		>
			<div class="space-y-1">
				<p class="text-body-bold">Your Referral Code</p>

				<p class="text-caption text-subtext-color">Share this code with friends to invite them</p>
			</div>

			<div class="flex items-center gap-3">
				<p class="text-heading-3 text-brand-primary">9YC5VXW6JV</p>

				<button
					class="flex cursor-pointer items-center gap-2 rounded-md border border-neutral-border bg-default-background px-4 py-2 text-body-bold text-brand-700 hover:bg-neutral-50 active:bg-default-background"
					><Copy size="16px" class="active:animate-ping" /> Copy Code</button
				>
			</div>
		</div>

		<div class="grid grid-cols-2 gap-6">
			<div
				class="flex flex-col justify-between rounded-lg border border-neutral-border bg-neutral-50 p-6"
			>
				<div class="space-y-2">
					<h2 class="text-heading-2">Start a Session</h2>

					<p class="text-body text-subtext-color">
						Create a new learning room to watch videos together
					</p>
				</div>

				<form action="">
					<button
						class="flex w-fit cursor-pointer items-center gap-2 rounded-md bg-brand-600 py-2 pr-4 pl-3 text-body-bold text-default-background hover:bg-brand-500 active:bg-brand-600"
						><Plus size="18px" /> Create New Session</button
					>
				</form>
			</div>

			<div class="space-y-6 rounded-lg border border-neutral-border bg-neutral-50 p-6">
				<div class="space-y-2">
					<h2 class="text-heading-2">Join Friends</h2>

					<p class="text-body text-subtext-color">Enter a session link to join your friends</p>
				</div>

				<form class="relative space-y-6" method="POST" action="" use:enhance>
					<Link size="14px" class="absolute top-2 left-2 text-subtext-color" />

					<input
						type="url"
						name="videoURL"
						placeholder="Paste YouTube URL here..."
						class="w-full rounded-md border border-neutral-border bg-default-background py-1 pl-7 text-body text-brand-700 placeholder:text-caption"
						required
					/>

					<button
						class="flex cursor-pointer items-center gap-2 rounded-md bg-brand-600 py-2 pr-4 pl-3 text-body-bold text-default-background hover:bg-brand-500 active:bg-brand-600"
						><Users size="16px" /> Join Session</button
					>
				</form>
			</div>
		</div>
	</section>
</main>
