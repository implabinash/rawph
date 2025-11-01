<script lang="ts">
	import { Trash } from "@lucide/svelte";

	import { onMount, untrack } from "svelte";

	import { ws, type WSMessage } from "$lib/stores/websocket.svelte";

	let whiteboard: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = $state(null);
	let drawing: boolean = $state(false);
	let position = $state({ x: 0, y: 0 });
	let isClear = $state(true);
	let strokeColor = $state("#369EFF");

	onMount(() => {
		ctx = whiteboard.getContext("2d");

		if (ctx) {
			resizeCanvas();
			ctx.lineWidth = 2;
			ctx.lineCap = "round";
			ctx.strokeStyle = strokeColor;
		}

		window.addEventListener("resize", resizeCanvas);

		return () => {
			window.removeEventListener("resize", resizeCanvas);
		};
	});

	$effect(() => {
		if (ctx) {
			ctx.strokeStyle = strokeColor;
		}
	});

	$effect(() => {
		const latestMessage = ws.latestMessage;

		if (!latestMessage) {
			return;
		}

		untrack(() => {
			if (!ctx) {
				return;
			}

			if (latestMessage.type === "drawing") {
				const data = latestMessage.data;

				ctx.strokeStyle = data.color;
				ctx.beginPath();
				ctx.moveTo(data.fromX, data.fromY);
				ctx.lineTo(data.toX, data.toY);
				ctx.stroke();
				ctx.closePath();

				ctx.strokeStyle = strokeColor;
				isClear = false;
			}

			if (latestMessage.type === "clear_canvas") {
				ctx.clearRect(0, 0, whiteboard.width, whiteboard.height);
				isClear = true;
			}
		});
	});

	const resizeCanvas = () => {
		if (!ctx) return;

		const imageData = ctx.getImageData(0, 0, whiteboard.width, whiteboard.height);

		const rect = whiteboard.getBoundingClientRect();
		whiteboard.width = rect.width * window.devicePixelRatio;
		whiteboard.height = rect.height * window.devicePixelRatio;
		ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

		ctx.lineWidth = 2;
		ctx.lineCap = "round";
		ctx.strokeStyle = strokeColor;

		ctx.putImageData(imageData, 0, 0);
	};

	const getMousePos = (e: MouseEvent) => {
		const rect = whiteboard.getBoundingClientRect();

		return {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top
		};
	};

	const startDrawing = (e: MouseEvent) => {
		if (!ctx) return;

		drawing = true;
		isClear = false;
		position = getMousePos(e);
	};

	const draw = (e: MouseEvent) => {
		if (!drawing || !ctx) return;

		const { x, y } = getMousePos(e);
		ctx.beginPath();
		ctx.moveTo(position.x, position.y);
		ctx.lineTo(x, y);
		ctx.stroke();
		ctx.closePath();

		const message: WSMessage = {
			type: "drawing",
			data: {
				fromX: position.x,
				fromY: position.y,
				toX: x,
				toY: y,
				color: strokeColor
			},
			for: "broadcast"
		};

		ws.send(message);

		position = { x, y };
	};

	const stopDrawing = () => {
		drawing = false;
	};

	const clearCanvas = () => {
		if (!ctx) return;
		ctx.clearRect(0, 0, whiteboard.width, whiteboard.height);

		isClear = true;

		const message: WSMessage = {
			type: "clear_canvas",
			for: "broadcast"
		};

		ws.send(message);
	};
</script>

<div class="flex items-center justify-between pr-2 pl-1">
	<span>Whiteboard</span>

	<div class="flex items-center gap-2">
		<button
			class={`${strokeColor === "#F2555A" ? "ring-2 ring-black ring-offset-2 ring-offset-default-background" : ""} size-5 cursor-pointer rounded-full bg-[#F2555A] text-[#F2555A]`}
			onclick={() => {
				strokeColor = "#F2555A";
			}}>.</button
		>

		<button
			class={`${strokeColor === "#55B467" ? "ring-2 ring-black ring-offset-2 ring-offset-default-background" : ""} size-5 cursor-pointer rounded-full bg-[#55B467] text-[#55B467]`}
			onclick={() => {
				strokeColor = "#55B467";
			}}>.</button
		>

		<button
			class={`${strokeColor === "#369EFF" ? "ring-2 ring-black ring-offset-2 ring-offset-default-background" : ""} size-5 cursor-pointer rounded-full bg-[#369EFF] text-[#369EFF]`}
			onclick={() => {
				strokeColor = "#369EFF";
			}}>.</button
		>

		<button
			class={`${strokeColor === "#FFCB47" ? "ring-2 ring-black ring-offset-2 ring-offset-default-background" : ""} size-5 cursor-pointer rounded-full bg-[#FFCB47] text-[#FFCB47]`}
			onclick={() => {
				strokeColor = "#FFCB47";
			}}>.</button
		>

		<button
			class={`${strokeColor === "black" ? "ring-2 ring-black ring-offset-2 ring-offset-default-background" : ""} size-5 cursor-pointer rounded-full bg-black`}
			onclick={() => {
				strokeColor = "black";
			}}>.</button
		>
	</div>

	<button
		class="flex cursor-pointer items-center gap-2 rounded-md bg-error-50 py-1 pr-2 pl-1 text-body-bold text-error-700 hover:bg-error-100 active:bg-error-50"
		onclick={clearCanvas}
		><Trash size="16px" />
		Clear</button
	>
</div>

<canvas
	class="flex-1 rounded-md border border-neutral-border bg-neutral-100"
	bind:this={whiteboard}
	onmousedown={startDrawing}
	onmouseup={stopDrawing}
	onmouseleave={stopDrawing}
	onmousemove={draw}
>
</canvas>

{#if isClear}
	<p class="absolute top-[50%] left-[50%] -translate-1/2 text-body text-subtext-color">
		Collaborative whiteboard space
	</p>
{/if}

<style>
	canvas {
		width: 100%;
		height: 100%;
	}
</style>
