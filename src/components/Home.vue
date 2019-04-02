<template>
	<div class="container py-2 px-4">
			<h1>Timer</h1>
			<app-timer></app-timer>
	</div>
</template>

<script>
	import Timer from './Timer.vue';

	export default {
		components: {
			appTimer: Timer
		}
	}
</script>

<style scoped>

	.container {
		border: 1px solid rgba(0,0,0,.1);
		border-radius: 0.25rem;
	}

</style>