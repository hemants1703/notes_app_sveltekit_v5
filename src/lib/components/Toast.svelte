<script>
    import { fly } from 'svelte/transition';
    export let type = 'success';
    export let message = '';
    export let show = false;
</script>

{#if show}
    <div
        class="fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg transition-all transform translate-y-0 opacity-100 z-50
        {type === 'success' ? 'bg-green-500' : 'bg-red-500'}"
        in:fly={{ y: 20, duration: 300 }}
        out:fly={{ y: 20, duration: 300 }}
    >
        <p class="text-white">{message}</p>
    </div>
{/if}