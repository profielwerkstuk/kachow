<script lang="ts">
    import { uploadToServer, getActivationFunctions, hardCodedActivationFunctionList } from "$lib/scripts/serverControl";
    import { onMount } from "svelte";

    let activationFunction = "STEP";
    let populationSize = 100;
    let addNodeMR = 80;
    let addConnectionMR = 40;
    let removeNodeMR = 0.1;
    let removeConnectionMR = 0.1;
    let changeWeightMR = 10;
    let c1 = 4;
    let c2 = 2.5;
    let c3 = 2;
    let compatibilityThreshold = 1.5;

    let carName = "superCar";

    let lastTimeActivated = -1;
    let currentTime = -1;

    let activationFunctions = hardCodedActivationFunctionList();

    onMount(async () => {
        lastTimeActivated = parseInt(localStorage.getItem("lastTimeActivated") ?? "0") ?? 0;

        currentTime = Date.now();

        activationFunctions = await getActivationFunctions();

        setInterval(() => {
            currentTime = Date.now();
        }, 1000);
    });

    let formSubmitted = false;
    let result = "Uw aanvraag wordt verwerkt, dit kan maximaal 30 seconden duren!";
</script>

{#if lastTimeActivated + 60000 < currentTime && lastTimeActivated != -1}
    <form
        on:submit={async () => {
            formSubmitted = true;
            lastTimeActivated = Date.now();
            localStorage.setItem("lastTimeActivated", lastTimeActivated.toString());
            result = await uploadToServer(activationFunction, addNodeMR, populationSize, addConnectionMR, removeNodeMR, removeConnectionMR, changeWeightMR, c1, c2, c3, compatibilityThreshold, carName, lastTimeActivated);
        }}
    >
        <select bind:value={activationFunction}>
            {#each activationFunctions as functionName}
                <option value={functionName}>{functionName}</option>
            {/each}
        </select>

        <input type="number" max="250" min="2" bind:value={populationSize} />
        <input type="number" step="0.1" max="100" min="0" bind:value={addNodeMR} />
        <input type="number" step="0.1" max="100" min="0" bind:value={addConnectionMR} />
        <input type="number" step="0.1" max="100" min="0" bind:value={removeNodeMR} />
        <input type="number" step="0.1" max="100" min="0" bind:value={removeConnectionMR} />
        <input type="number" step=".01" max="100" min="0" bind:value={changeWeightMR} />
        <input type="number" step=".1" min="0" bind:value={c1} />
        <input type="number" step=".1" min="0" bind:value={c2} />
        <input type="number" step=".1" min="0" bind:value={c3} />
        <input type="number" step=".1" min="0" bind:value={compatibilityThreshold} />
        <input type="text" bind:value={carName} />

        <input type="submit" value="Upload to server" />
    </form>
{:else if lastTimeActivated != -1 && formSubmitted}
    <p>{result}</p>
{:else if lastTimeActivated != -1 && !formSubmitted}
    <p>Uw netwerk is geupload!</p>
    <!-- visual -->
{/if}
