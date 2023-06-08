<script lang="ts">
    import type { Genome } from "$lib/scripts/classes/NEAT/Genome";
    import type { Car as _Car } from "$lib/scripts/classes/Car";
    import { onMount } from "svelte";

    let index: any;

    type DING = { CarInstance: _Car; genome: Genome; fitness: number, show: boolean };
    let data: DING[] = [];

    const sortingMethods = [
        (a: DING, b: DING) => {
            if (a.CarInstance.stats.fitness > b.CarInstance.stats.fitness) return -1;
            if (a.CarInstance.stats.fitness < b.CarInstance.stats.fitness) return 1;
            return 0;
        },
        (a: DING, b: DING) => {
            if (a.CarInstance.stats.distanceTravelled < b.CarInstance.stats.distanceTravelled) return 1;
            if (a.CarInstance.stats.distanceTravelled > b.CarInstance.stats.distanceTravelled) return -1;
            return 0;
        },
        (a: DING, b: DING) => {
            if (a.CarInstance.stats.survivalTime < b.CarInstance.stats.survivalTime) return 1;
            if (a.CarInstance.stats.survivalTime > b.CarInstance.stats.survivalTime) return -1;
            return 0;
        },
    ];

    const scoringMethods = [
        ["CarInstance", "stats", "fitness"],
        ["CarInstance", "stats", "distanceTravelled"],
        ["CarInstance", "stats", "survivalTime"],
    ];

    let scoring = scoringMethods[0];

    let sortingMethod = sortingMethods[0];

    onMount(async () => {
        index = await import("$lib/scripts/index");
        index.load();

        addEventListener("keypress", (e) => {
            if (e.key === "p") console.log(index.Cars);
        });

        setInterval(() => {
            data = index.Cars ?? "loading";
            data.sort(sortingMethod);
        }, 1);
    });
</script>

<div id="wrapper">
    <canvas id="canvas" />
    {#if index?.Cars}
        <div class="container">
            <div id="cars">
                {#each data as Car, i}
                    {#if Car.show}
                        <div id="CarInstance">
                            <div class="info">
                                <p class="rank">Nr. {i + 1}</p>
                                <p class="name" style="color:{Car.CarInstance.carColour}">{Car.CarInstance.carName}</p>
                                <p class="score">{JSON.stringify(Math.round(Car[scoring[0]][scoring[1]][scoring[2]]))}</p>
                                <div class="buttons">
                                    <button id="kill" on:click={() => dispatchEvent(new CustomEvent("resetCar", { detail: { id: Car.CarInstance.id } }))}>Restart</button>
                                    <button id="remove" on:click={() => dispatchEvent(new CustomEvent("removeCar", { detail: { id: Car.CarInstance.id } }))}>Verwijderen</button>
                                </div>
                            </div>
                        </div>
                    {/if}
                {/each}
            </div>
        </div>
    {/if}
</div>

<style>
    @import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");

    :global(*) {
        margin: 0;
        padding: 0;
    }

    #wrapper {
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: row;
    }

    #canvas {
        width: 100vh;
        height: auto;
    }

    .container {
        flex-grow: 1;
        display: flex;
        flex-direction: column;

        overflow: hidden;
    }

    #selector {
        /* background-color: red; */
        margin: 10px;

        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 10px;
    }

    #selector button {
        height: 100%;
        width: 100%;

        padding: 20px;

        font-family: "Poppins", sans-serif;

        background-color: #405cf5;

        border-radius: 6px;
        border-width: 0;
        box-shadow: rgba(50, 50, 93, 0.1) 0 0 0 1px inset, rgba(50, 50, 93, 0.1) 0 2px 5px 0, rgba(0, 0, 0, 0.07) 0 1px 1px 0;
        box-sizing: border-box;
        color: #fff;
        cursor: pointer;

        font-size: 100%;

        outline: none;

        text-align: center;
        text-transform: none;
    }

    #selector button:focus {
        box-shadow: rgba(50, 50, 93, 0.1) 0 0 0 1px inset, rgba(50, 50, 93, 0.2) 0 6px 15px 0, rgba(0, 0, 0, 0.1) 0 2px 2px 0, rgba(50, 151, 211, 0.3) 0 0 0 4px;
    }

    #cars {
        padding: 10px;
        padding-right: 0;

        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: repeat(10, 1fr);
        grid-column-gap: 0px;
        grid-row-gap: 10px;
    }

    #CarInstance {
        font-family: "Poppins", sans-serif;
    }

    #CarInstance .info {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: 1fr 1fr;
        grid-column-gap: 0px;
        grid-row-gap: 0px;
    }

    #CarInstance .info .rank {
        color: #3e3e3e;
        font-weight: 800;
        font-size: 100%;

        grid-area: 1 / 1 / 2 / 2;
    }

    #CarInstance .info .score {
        color: #3e3e3e;
        font-weight: 800;
        font-size: 100%;
        text-align: center;

        grid-area: 1 / 2 / 2 / 3;
    }

    #CarInstance .info .name {
        color: #3e3e3e;
        font-weight: 800;
        font-size: 100%;

        grid-area: 2 / 1 / 3 / 2;
    }

    #CarInstance .info .buttons {
        grid-area: 2 / 2 / 3 / 2;
    }

    #CarInstance .info .buttons button {
        padding-top: 2px;
        padding-left: 5px;
        padding-right: 5px;
        padding-bottom: 2px;

        font-family: "Poppins", sans-serif;

        background-color: #405cf5;

        border-radius: 6px;
        border-width: 0;
        box-shadow: rgba(50, 50, 93, 0.1) 0 0 0 1px inset, rgba(50, 50, 93, 0.1) 0 2px 5px 0, rgba(0, 0, 0, 0.07) 0 1px 1px 0;
        box-sizing: border-box;
        color: #fff;
        cursor: pointer;

        outline: none;

        text-align: center;
        text-transform: none;
    }
</style>
