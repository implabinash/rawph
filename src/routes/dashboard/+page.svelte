<script lang="ts">
	import { Link, LogOut, Plus, Users } from "@lucide/svelte";

	import Seo from "$lib/components/Seo.svelte";
	import { enhance } from "$app/forms";
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

<main class="mt-20 flex h-full w-full flex-col items-center justify-center gap-8">
	<div class="space-y-4 text-center">
		<h1 class="text-heading-1">Welcome</h1>
		<p class="text-body text-subtext-color">Create a new learning session or join your friends</p>
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
					class="flex w-fit cursor-pointer items-center gap-2 rounded-md bg-brand-600 py-2 pr-4 pl-3 text-body-bold text-black hover:bg-brand-500 active:bg-brand-600"
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
					class="w-full rounded-md border border-neutral-border bg-black py-1 pl-7 text-body text-brand-700 placeholder:text-caption"
					required
				/>

				<button
					class="flex cursor-pointer items-center gap-2 rounded-md bg-brand-600 py-2 pr-4 pl-3 text-body-bold text-black hover:bg-brand-500 active:bg-brand-600"
					><Users size="16px" /> Join Session</button
				>
			</form>
		</div>
	</div>
</main>
