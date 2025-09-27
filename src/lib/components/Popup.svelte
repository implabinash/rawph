<script lang="ts">
	import { Clock } from "@lucide/svelte";
</script>

<section class="fixed inset-0 grid h-full place-items-center bg-black/40 backdrop-blur-sm">
	<div
		class="space-y-6 rounded-lg border border-neutral-border bg-default-background p-8 shadow-lg"
	>
		<div class="space-y-4 text-center">
			<img
				src="/images/placeholders/0.png"
				alt="Person Name"
				class="mx-auto size-14 rounded-full"
			/>

			<div class="space-y-2">
				<h1 class="text-heading-2">Waiting for approval</h1>

				<p class="text-body text-subtext-color">
					Alex Chen needs to approve your request to join the session.
				</p>
			</div>
		</div>

		<div class="mx-auto flex items-center justify-center gap-2">
			<Clock size="20px" class="text-btext-brand-800 rounded-full bg-brand-100 p-1" />

			<p class="text-caption text-subtext-color">Usually responds within a few minutes</p>
		</div>

		<form action="">
			<button
				class="w-full cursor-pointer rounded-md border border-neutral-border py-2 text-body-bold text-neutral-700 hover:bg-neutral-50 active:bg-default-background"
				>Cancel Request</button
			>
		</form>
	</div>
</section>
