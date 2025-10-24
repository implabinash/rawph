<script lang="ts">
	import { Send } from "@lucide/svelte";

	import { enhance } from "$app/forms";

	let lastMessage: HTMLDivElement;

	$effect(() => {
		lastMessage.scrollIntoView();
	});
</script>

<div
	class="flex h-full flex-1 flex-col space-y-2 rounded-lg border border-neutral-border bg-neutral-50 p-4"
>
	<h3 class="text-heading-3">Chat</h3>

	<div class="flex-1 space-y-3 overflow-y-auto">
		<div class="flex items-start justify-baseline gap-3">
			<img src="/images/avatars/0.webp" alt="User" class="mt-1 size-7 rounded-full" />

			<div class="w-[90%] space-y-1">
				<div>
					<span class="text-caption-bold">Name</span>
					<span class="text-caption text-subtext-color">2.30 PM</span>
				</div>

				<p class="text-body">
					Would you also avoid planning mode in agents for that same reason? (lots of tool calls in
					context before implementing)
				</p>
			</div>
		</div>

		<div bind:this={lastMessage}></div>
	</div>

	<form class="flex items-center gap-2" action="?/message" method="POST" use:enhance>
		<input
			type="text"
			name="message"
			placeholder="Type a message..."
			class="w-full rounded-md border border-neutral-border bg-neutral-100 px-2 py-1.5 text-body text-brand-700 placeholder:text-caption"
			required
		/>

		<button type="submit" class="cursor-pointer rounded-md bg-brand-600 p-2 text-default-background"
			><Send size="16px" /></button
		>
	</form>
</div>
