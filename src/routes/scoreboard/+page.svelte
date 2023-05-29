<script lang="ts">
  import type { Genome } from '$lib/scripts/classes/NEAT/Genome';
  import type { Car as _Car } from "$lib/scripts/classes/Car";
  import { onMount } from 'svelte';

    let index: any

    let data: { CarInstance: _Car, genome: Genome, fitness: number }[] = []

    const sortingMethods = [(a, b) => {
                if (a.CarInstance.stats.fitness > b.CarInstance.stats.fitness) return -1
                if (a.CarInstance.stats.fitness < b.CarInstance.stats.fitness) return 1
                return 0
            }, (a, b) => {
                if (a.CarInstance.stats.distanceTraveled < b.CarInstance.stats.distanceTraveled) return -1
                if (a.CarInstance.stats.distanceTraveled > b.CarInstance.distanceTraveled) return 1
                return 0
            }, (a, b) => {
                if (a.CarInstance.stats.survivalTime < b.CarInstance.stats.survivalTime) return -1
                if (a.CarInstance.stats.survivalTime > b.CarInstance.stats.survivalTime) return 1
                return 0
            }]

    const scoringMethods = [["CarInstance", "stats", "fitness"], ["CarInstance", "stats", "distanceTravelled"], ["CarInstance", "stats", "survivalTime"]]

    let scoring = scoringMethods[0]

    let sortingMethod = sortingMethods[0]

    onMount(async () => {
        index = await import('$lib/scripts/index')

        index.load()

		addEventListener("keypress", (e) => {
			if (e.key === "p") console.log(index.Cars);
		})

        setInterval(() => {
            data = index.Cars ?? "loading"

            data.sort(sortingMethod)
        }, 1)
    })
</script>

<div id="wrapper">
    <canvas id="canvas">

    </canvas>
    {#if index?.Cars}
        <div class="container">
            <!-- 3 way switch with options, A B and C-->
            <div id="selector">
                <button on:click={() => {sortingMethod = sortingMethods[0]; scoring = scoringMethods[0]}}>A</button>
                <button on:click={() => {sortingMethod = sortingMethods[1]; scoring = scoringMethods[1]}}>B</button>
                <button on:click={() => {sortingMethod = sortingMethods[2]; scoring = scoringMethods[2]}}>C</button>
            </div>
            {#each data as Car, i}
                <div id="CarInstance">
                    <p>Nr {i + 1} ({Car.CarInstance.id}) <br> Score: {JSON.stringify(Math.round(Car[scoring[0]][scoring[1]][scoring[2]]))}</p>
                    <button id="kill" on:click={() => dispatchEvent(new CustomEvent("resetCar", {detail: {id: Car.CarInstance.id}}))}>Kill</button>
                    <button id="remove" on:click={() => dispatchEvent(new CustomEvent("removeCar", {detail: {id: Car.CarInstance.id}}))}>Remove</button>
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    /* put the canvas to the left for 70% and the container to the right for 30% each car being its own row */
    #wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    #canvas {
        /* set width to whatever is lowers, 100vh or 70vw */
        width: 100vh;
        height: 100vh;
    }

    .container {
        margin-left: 5vw;
        width: 25vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    #selector {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    #selector button {
        width: 33%;
        height: 50px;
    }

    #selector button:hover {
        background-color: #333;
        color: #fff;
    }

    #selector button:active {
        background-color: #000;
        color: #fff;
    }

    #selector button:focus {
        outline: none;
    }
</style>