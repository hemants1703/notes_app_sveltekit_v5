<script lang="ts">
    import Navbar from '$lib/components/Navbar.svelte';
    import '../app.css';
    let { children } = $props();
</script>

<div class="min-h-screen bg-black text-white selection:bg-white selection:text-black">
    <Navbar />
    <main class="max-w-[2000px] mx-auto">
        {@render children()}
    </main>
</div>