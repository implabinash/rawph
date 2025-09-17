<script lang="ts">
	import { Twitter } from '@lucide/svelte';
</script>

<svelte:head>
	<title>Rawph</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<header
	class="mx-auto my-6 flex max-w-5xl items-center justify-between rounded-md border border-neutral-border px-3 py-3"
>
	<a href="/" class="flex items-center gap-2 text-heading-3"
		><img src="/images/logo.svg" alt="Homepage" class="size-6" />Rawph</a
	>

	<div class="flex items-center gap-2">
		<a
			href="/"
			class="rounded-md bg-brand-50 px-4 py-2 text-body-bold text-brand-700 hover:bg-brand-100 active:bg-brand-50"
			>Sing In</a
		>
		<a
			href="/"
			class="rounded-md bg-brand-600 px-4 py-2 text-body-bold text-black hover:bg-brand-500 active:bg-brand-600"
			>Try Rawph for Free</a
		>
	</div>
</header>

<main class="mx-auto max-w-5xl">
	<section class="space-y-12 px-6 py-24">
		<div class="space-y-6">
			<h1 class="text-[3.5rem] leading-[3.875rem] font-bold">
				AI-powered assistant for the modern software team
			</h1>

			<p class="text-[1.313rem] leading-[1.75rem] text-subtext-color">
				Elevate your workflow with intelligent agents. Streamline coding, debugging, and project
				management with AI.
			</p>
		</div>

		<div class="flex items-center gap-4">
			<a
				href="/"
				class="rounded-md bg-brand-600 px-4 py-2 text-body-bold text-black hover:bg-brand-500 active:bg-brand-600"
				>Try Rawph for Free</a
			>
			<a
				href="/"
				class="rounded-md bg-brand-50 px-4 py-2 text-body-bold text-brand-700 hover:bg-brand-100 active:bg-brand-50"
				>Sing In</a
			>
		</div>
	</section>

	<section class="mb-24 h-144 w-5xl bg-[url('/images/placeholder.png')]"></section>
</main>

<footer class="mx-auto mb-12 flex max-w-5xl items-center justify-between">
	<a href="/" class="flex items-center gap-2"
		><img src="/images/logo.svg" alt="Homepage" class="size-6" />Rawph</a
	>

	<a
		href="https://x.com/implabinash"
		target="_blank"
		class="text-white hover:text-brand-600 active:text-white"
	>
		<Twitter />
	</a>
</footer>
