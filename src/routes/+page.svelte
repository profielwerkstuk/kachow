<script lang="ts">
    import { getServerURL } from '$lib/scripts/firebaseControl';

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

    async function uploadToServer() {
        const url = `http://${await baseURL}/?activationFunction=${activationFunction}&addNodeMR=${addNodeMR}&populationSize=${populationSize}&addConnectionMR=${addConnectionMR}&removeNodeMR=${removeNodeMR}&removeConnectionMR=${removeConnectionMR}&changeWeightMR=${changeWeightMR}&c1=${c1}&c2=${c2}&c3=${c3}&compatibilityThreshold=${compatibilityThreshold}`;
        const response = await fetch(url);
        console.log(await response.json());
    }
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<!-- dropdown menu with options: STEP, RELU, SELU -->
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

<button on:click={uploadToServer}>Upload</button>

<!-- url + /?activationFunction=STEP&addNodeMR=0.8&addConnectionMR=0.4&removeNodeMR=0.001&removeConnectionMR=0.00001&changeWeightMR=0.1&c1=4&c2=2.5&c3=2&compatibilityThreshold=1.5 -->