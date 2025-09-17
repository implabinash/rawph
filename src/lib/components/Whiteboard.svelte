<script lang="ts">
	import { Trash } from '@lucide/svelte';
	import { onMount } from 'svelte';

	let whiteboard: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = $state(null);
	let drawing: boolean = $state(false);
	let position = $state({ x: 0, y: 0 });
	let isClear = $state(true);
	let strokeColor = $state('#F2555A');

	onMount(() => {
		ctx = whiteboard.getContext('2d');

		if (ctx) {
			resizeCanvas();
			ctx.lineWidth = 2;
			ctx.lineCap = 'round';
			ctx.strokeStyle = strokeColor;
		}
	});

	$effect(() => {
		if (ctx) {
			ctx.strokeStyle = strokeColor;
		}
	});

	const resizeCanvas = () => {
		const rect = whiteboard.getBoundingClientRect();
		whiteboard.width = rect.width * window.devicePixelRatio;
		whiteboard.height = rect.height * window.devicePixelRatio;
		ctx?.scale(window.devicePixelRatio, window.devicePixelRatio);
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

		position = { x, y };
	};

	const stopDrawing = () => {
		drawing = false;
	};

	const clearCanvas = () => {
		if (!ctx) return;
		ctx.clearRect(0, 0, whiteboard.width, whiteboard.height);

		isClear = true;
	};
</script>

<div class="flex items-center justify-between pr-2 pl-1">
	<span>Whiteboard</span>

	<div class="flex items-center gap-2">
		<button
			class="size-5 cursor-pointer rounded-full bg-[#F2555A] text-error-700"
			onclick={() => {
				strokeColor = '#F2555A';
			}}>.</button
		>

		<button
			class="size-5 cursor-pointer rounded-full bg-[#55B467] text-success-700"
			onclick={() => {
				strokeColor = '#55B467';
			}}>.</button
		>

		<button
			class="size-5 cursor-pointer rounded-full bg-[#369EFF] text-[#369EFF]"
			onclick={() => {
				strokeColor = '#369EFF';
			}}>.</button
		>

		<button
			class="size-5 cursor-pointer rounded-full bg-[#FFCB47] text-warning-700"
			onclick={() => {
				strokeColor = '#FFCB47';
			}}>.</button
		>

		<button
			class="size-5 cursor-pointer rounded-full bg-white"
			onclick={() => {
				strokeColor = 'white';
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
