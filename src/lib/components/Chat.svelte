<script lang="ts">
	import { Send } from "@lucide/svelte";

	import { untrack } from "svelte";

	import { ws, type WSMessage } from "$lib/stores/websocket.svelte";
	import type { User } from "$lib/db/schemas/user.schema";

	let { user }: { user: User } = $props();

	let chatMessages: {
		userID: string;
		name: string;
		message: string;
		image: string;
		timestamp: Date;
	}[] = $state([]);

	let latestMessage: string = $state("");

	let lastMessage: HTMLDivElement;

	$effect(() => {
		const latestMessage = ws.latestMessage;

		if (!latestMessage) {
			return;
		}

		if (latestMessage.type === "new_chat_message") {
			untrack(() => {
				chatMessages.push({
					userID: latestMessage.data.userID,
					name: latestMessage.data.name,
					message: latestMessage.data.message,
					image: latestMessage.data.image,
					timestamp: latestMessage.data.timestamp
				});
			});
		}
	});

	$effect(() => {
		if (chatMessages.length > 0 && lastMessage) {
			setTimeout(() => {
				lastMessage.scrollIntoView({ behavior: "smooth", block: "end" });
			}, 0);
		}
	});

	const handleSubmit = (e: SubmitEvent) => {
		e.preventDefault();

		const timestamp = new Date();

		const newMessage = {
			userID: user.id,
			name: user.name,
			message: latestMessage,
			image: user.image,
			timestamp
		};

		chatMessages.push(newMessage);

		const message: WSMessage = {
			type: "new_chat_message",
			data: newMessage,
			for: "broadcast"
		};

		ws.send(message);

		latestMessage = "";
	};

	const formatTime = (timestamp: Date): string => {
		const date = new Date(timestamp);
		return date.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true
		});
	};
</script>

<div
	class="flex h-full flex-1 flex-col space-y-2 rounded-lg border border-neutral-border bg-neutral-50 p-4"
>
	<h3 class="text-heading-3">Chat</h3>

	<div class="flex-1 space-y-3 overflow-y-auto">
		{#each chatMessages as message (message.timestamp)}
			<div class="flex items-start justify-baseline gap-3">
				<img
					src={message.image.startsWith("http")
						? message.image
						: `/images/avatars/${message.image}.webp`}
					alt={message.name}
					class="mt-1 size-7 rounded-full"
				/>

				<div class="w-[90%] space-y-1">
					<div>
						<span class="text-caption-bold">{message.name}</span>
						<span class="text-caption text-subtext-color">{formatTime(message.timestamp)}</span>
					</div>

					<p class="text-body">
						{message.message}
					</p>
				</div>
			</div>
		{/each}
		<div bind:this={lastMessage} class="h-0"></div>
	</div>

	<form class="flex items-center gap-2" onsubmit={handleSubmit}>
		<input
			type="text"
			name="message"
			bind:value={latestMessage}
			placeholder="Type a message..."
			class="w-full rounded-md border border-neutral-border bg-neutral-100 px-2 py-1.5 text-body text-brand-700 placeholder:text-caption"
			required
		/>

		<button type="submit" class="cursor-pointer rounded-md bg-brand-600 p-2 text-default-background"
			><Send size="16px" /></button
		>
	</form>
</div>
