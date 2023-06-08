<script lang="ts">
    import { uploadToServer, getActivationFunctions, hardCodedActivationFunctionList } from "$lib/scripts/serverControl";
    import { onMount } from "svelte";

    let activationFunction = "ELU";
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

    let carName = "";

    let carColour = "#3800fe";

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

<h1>Maak je eigen auto!</h1>
<h3>Iets onduidelijk? Vraag ons ernaar!</h3>

{#if lastTimeActivated + 5000 < currentTime && lastTimeActivated != -1}
    <form
        on:submit={async () => {
            formSubmitted = true;
            lastTimeActivated = Date.now();
            localStorage.setItem("lastTimeActivated", lastTimeActivated.toString());
            result = await uploadToServer(activationFunction, addNodeMR, populationSize, addConnectionMR, removeNodeMR, removeConnectionMR, changeWeightMR, c1, c2, c3, compatibilityThreshold, carColour, carName, lastTimeActivated);
        }}
    >
        <label>
            Activatiefunctie
            <select bind:value={activationFunction}>
                {#each activationFunctions as functionName}
                    <option value={functionName}>{functionName}</option>
                {/each}
            </select>
        </label>

        <label>
            Populatiegrootte (2 - 250)
            <input type="number" max="250" min="2" bind:value={populationSize} />
        </label>
        <label>
            Kans op neuronmutatie (0.1 - 100)
            <input type="number" step="0.1" max="100" min="0" bind:value={addNodeMR} />
        </label>
        <label>
            Kans op connectiemutatie (0.1 - 100)
            <input type="number" step="0.1" max="100" min="0" bind:value={addConnectionMR} />
        </label>
        <label>
            Kans dat een neuron weggehaald wordt (0.1 - 100)
            <input type="number" step="0.1" max="100" min="0" bind:value={removeNodeMR} />
        </label>
        <label>
            Kans dat een connectie weggehaald wordt (0.1 - 100)
            <input type="number" step="0.1" max="100" min="0" bind:value={removeConnectionMR} />
        </label>
        <label>
            Kans dat een waarde aangepast wordt (0 - 100)
            <input type="number" step=".01" max="100" min="0" bind:value={changeWeightMR} />
        </label>
        <label>
            C1-waarde (0+)
            <input type="number" step=".1" min="0" bind:value={c1} />
        </label>
        <label>
            C2-waarde (0+)
            <input type="number" step=".1" min="0" bind:value={c2} />
        </label>
        <label>
            C3-waarde (0+)
            <input type="number" step=".1" min="0" bind:value={c3} />
        </label>
        <label>
            "Compatibility threshold" (0+)
            <input type="number" step=".1" min="0" bind:value={compatibilityThreshold} />
        </label>
        <label>
            Uw kleur
            <input type="color" bind:value={carColour} />
        </label>
        <label>
            Uw naam
            <input type="text" placeholder="Naam" bind:value={carName} />
        </label>

        <label>
            Trainen!
            <input type="submit" value="Upload to server" />
        </label>
    </form>
{:else if lastTimeActivated != -1 && formSubmitted}
    <p>{result}</p>
{:else if lastTimeActivated != -1 && !formSubmitted}
    <p>Uw netwerk is geupload!</p>
    <!-- visual -->
{/if}

<style>
    @import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");

    :global(body) {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        min-width: 100vw;
        overflow: hidden;
    }

    h1 {
        font-family: "Poppins", sans-serif;
        margin: 0px;
    }

    h3 {
        font-family: "Poppins", sans-serif;
        margin: 10px;
    }

    form {
        display: grid;
        grid-direction: row;
        gap: 20px;
        width: 40vw;

        font-family: "Poppins", sans-serif;
    }

    form input {
        float: right;
        font-family: "Poppins", sans-serif;
    }

    form select {
        float: right;
        font-family: "Poppins", sans-serif;
    }
</style>
