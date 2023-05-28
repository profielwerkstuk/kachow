<script lang="ts">
    import { getServerURL } from '$lib/scripts/firebaseControl';
    import { onMount } from 'svelte';

    const baseURL = getServerURL();

    let activationFunction = 'STEP';
    let populationSize = 100;
    let addNodeMR = 0.8;
    let addConnectionMR = 0.4;
    let removeNodeMR = 0.001;
    let removeConnectionMR = 0.00001;
    let changeWeightMR = 0.1;
    let c1 = 4;
    let c2 = 2.5;
    let c3 = 2;
    let compatibilityThreshold = 1.5;

    let lastTimeActivated = -1;
    let currentTime = -1;

    onMount(() => {
        lastTimeActivated = parseInt(localStorage.getItem('lastTimeActivated') ?? "0") ?? 0;

        currentTime = Date.now();

        setInterval(() => {
            currentTime = Date.now();
        }, 1000);
    })

    async function uploadToServer() {
        const url = `http://${await baseURL}/?activationFunction=${activationFunction}&addNodeMR=${addNodeMR}&populationSize=${populationSize}&addConnectionMR=${addConnectionMR}&removeNodeMR=${removeNodeMR}&removeConnectionMR=${removeConnectionMR}&changeWeightMR=${changeWeightMR}&c1=${c1}&c2=${c2}&c3=${c3}&compatibilityThreshold=${compatibilityThreshold}`;
        const response = await fetch(url);
        console.log(await response.json());

        lastTimeActivated = Date.now();
        localStorage.setItem('lastTimeActivated', lastTimeActivated.toString());
    }
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<select bind:value={activationFunction}>
    <option value="STEP">STEP</option>
    <option value="SIGMOID">SIGMOID</option>
    <option value="RELU">RELU</option>
    <option value="SELU">SELU</option>
</select>

<input type="number" bind:value={populationSize}>
<input type="number" bind:value={addNodeMR}>
<input type="number" bind:value={addConnectionMR}>
<input type="number" bind:value={removeNodeMR}>
<input type="number" bind:value={removeConnectionMR}>
<input type="number" bind:value={changeWeightMR}>
<input type="number" bind:value={c1}>
<input type="number" bind:value={c2}>
<input type="number" bind:value={c3}>
<input type="number" bind:value={compatibilityThreshold}>
<button on:click={uploadToServer}>Upload to server</button>
<!-- {#if lastTimeActivated + 60000 < currentTime && lastTimeActivated != -1}
    <button on:click={uploadToServer}>Upload to server</button>
{:else if lastTimeActivated != -1}
    <button disabled>{Math.round((lastTimeActivated + 60000 - currentTime) / 1000)}</button>
{/if} -->