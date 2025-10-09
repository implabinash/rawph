<script lang="ts">
	import { Twitter } from "@lucide/svelte";

	import { resolve } from "$app/paths";
</script>

<svelte:head>
	<title>Rawph - Collaborative learning with peers</title>
	<meta
		name="description"
		content="Rawph is a co-learning platform where you and your friends can learn from YouTube together. Sync videos, talk in real-time, and brainstorm on a shared whiteboard."
	/>
	<meta
		name="keywords"
		content="Rawph, co-learning platform, learn with friends, YouTube study, collaborative learning, online study tool, group learning, shared whiteboard, watch and learn"
	/>

	<meta property="og:title" content="Rawph - Learn Together, Smarter" />
	<meta
		property="og:description"
		content="Paste a YouTube link, sync it with your friends, discuss over audio calls, and use a whiteboard to collaborate. Rawph makes learning social and fun."
	/>
	<!-- <meta property="og:image" content="https://rawph.com/og-image.png" /> -->
	<!-- <meta property="og:url" content="https://rawph.com" /> -->

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Rawph - Learn Together, Smarter" />
	<meta
		name="twitter:description"
		content="Study with your friends in real time. Watch synced YouTube videos, discuss via audio, and brainstorm on a shared whiteboard with Rawph."
	/>
	<!-- <meta name="twitter:image" content="https://rawph.com/twitter-card.png" /> -->
</svelte:head>

<header
	class="mx-auto my-6 flex max-w-5xl items-center justify-between rounded-md border border-neutral-border px-3 py-3"
>
	<a href={resolve("/")} class="flex items-center gap-2 text-heading-3"
		><img src="/images/logos/rawph.svg" alt="Homepage" class="size-6" />Rawph</a
	>

	<div class="flex items-center gap-2">
		<a
			href={resolve("/signin")}
			class="rounded-md bg-brand-50 px-4 py-2 text-body-bold text-brand-700 hover:bg-brand-100 active:bg-brand-50"
			>Sign In</a
		>
		<a
			href={resolve("/signup")}
			class="rounded-md bg-brand-600 px-4 py-2 text-body-bold text-default-background hover:bg-brand-500 active:bg-brand-600"
			>Try Rawph for Free</a
		>
	</div>
</header>

<main class="mx-auto max-w-5xl">
	<section class="space-y-12 px-6 py-24">
		<div class="w-[80%] space-y-6">
			<h1 class="text-[3.5rem] leading-[3.875rem] font-bold">
				A Smarter and Simpler Way to Learn with Peers
			</h1>

			<p class="text-[1.313rem] leading-[1.75rem] text-subtext-color">
				Study side by side with Rawph. Watch videos together, join a call, chat effortlessly and
				explore your ideas on a clean whiteboard.
			</p>
		</div>

		<div class="flex items-center gap-4">
			<a
				href={resolve("/signup")}
				class="rounded-md bg-brand-600 px-4 py-2 text-body-bold text-default-background hover:bg-brand-500 active:bg-brand-600"
				>Try Rawph for Free</a
			>
			<a
				href={resolve("/signin")}
				class="rounded-md bg-brand-50 px-4 py-2 text-body-bold text-brand-700 hover:bg-brand-100 active:bg-brand-50"
				>Sing In</a
			>
		</div>
	</section>

	<section
		class="mb-24 grid place-items-center rounded-md bg-[url('/images/placeholders/0.png')] p-6"
	>
		<img src="/images/products/demo.png" alt="Rawph Demo" class="rounded-md" />
	</section>
</main>

<footer class="mx-auto mb-12 flex max-w-5xl items-center justify-between">
	<a href={resolve("/")} class="flex items-center gap-2 text-heading-3"
		><img src="/images/logos/rawph.svg" alt="Homepage" class="size-6" />Rawph</a
	>

	<a
		href="https://x.com/implabinash"
		target="_blank"
		class="text-default-font hover:text-brand-400 active:text-default-font"
	>
		<Twitter />
	</a>
</footer>
