<script lang="ts">
	import Whiteboard from '$lib/components/Whiteboard.svelte';
</script>

<main class="flex h-screen gap-4 p-4">
	<section class="flex flex-col gap-4">
		<div class="h-112 w-192 rounded-lg border border-neutral-border bg-neutral-50 p-4">
			<div
				class="grid h-full w-full place-items-center rounded-md border border-neutral-border bg-neutral-100"
			>
				video
			</div>
		</div>

		<div class="flex flex-1 gap-4">
			<div class="h-full w-64 rounded-lg border border-neutral-border bg-neutral-50">
				call actions, participants, session link
			</div>

			<div class="h-full flex-1 rounded-lg border border-neutral-border bg-neutral-50">chat</div>
		</div>
	</section>

	<section
		class="relative flex h-full flex-1 flex-col gap-2 rounded-lg border border-neutral-border bg-neutral-50 p-4"
	>
		<Whiteboard />
	</section>
</main>
