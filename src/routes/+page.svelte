<script lang="ts">
    import { uploadToServer } from '$lib/scripts/firebaseControl';
    import { onMount } from 'svelte';

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

    let buttonPressed = false;
    let result = "Uw aanvraag wordt verwerkt...";
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

{#if lastTimeActivated + 60000 < currentTime && lastTimeActivated != -1}
    <form on:submit={async () => {
        buttonPressed = true;
        lastTimeActivated = Date.now();
        localStorage.setItem('lastTimeActivated', lastTimeActivated.toString());
        result = await uploadToServer(activationFunction, addNodeMR, populationSize, addConnectionMR, removeNodeMR, removeConnectionMR, changeWeightMR, c1, c2, c3, compatibilityThreshold, lastTimeActivated)
    }}>
        <select bind:value={activationFunction}>
            <option value="STEP">STEP</option>
            <option value="SIGMOID">SIGMOID</option>
            <option value="RELU">RELU</option>
            <option value="SELU">SELU</option>
        </select>
        
        <input type="number" max=100 min=2 bind:value={populationSize}>
        <input type="number" step=.01 max=1 min=0 bind:value={addNodeMR}>
        <input type="number" step=.01 max=1 min=0 bind:value={addConnectionMR}>
        <input type="number" step=.001 max=1 min=0 bind:value={removeNodeMR}>
        <input type="number" step=.001 max=1 min=0 bind:value={removeConnectionMR}>
        <input type="number" step=.01 max=1 min=0 bind:value={changeWeightMR}>
        <input type="number" step=.5 min=0 bind:value={c1}>
        <input type="number" step=.5 min=0 bind:value={c2}>
        <input type="number" step=.5 min=0 bind:value={c3}>
        <input type="number" step=.5 min=0 bind:value={compatibilityThreshold}>

        <input type="submit" value="Upload to server" />
    </form>
{:else if lastTimeActivated != -1 && buttonPressed}
    <p>{result}</p>
{:else if lastTimeActivated != -1 && !buttonPressed}
    <p>Uw netwerk is geupload!</p>
    <!-- visual -->
{/if}