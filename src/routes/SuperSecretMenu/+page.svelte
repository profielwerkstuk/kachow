<script lang="ts">
    import type { Genome } from "$lib/scripts/classes/NEAT/Genome";
    import type { Car as _Car } from "$lib/scripts/classes/Car";
    import { onMount } from "svelte";
    import { deleteDoc, doc, updateDoc } from "firebase/firestore";
    import { firebase } from "$lib/scripts/serverControl";

    let index: any;

    type DING = { CarInstance: _Car; genome: Genome; fitness: number, show: boolean };
    let data: DING[] = [];

    function removeCar(id: string) {
        console.log("removing car with id: " + id);
        deleteDoc(doc(firebase, `genomes/${id}`));
    }

    function hideCar(id: number) {
        // update document with id to have show = false
        console.log("hiding car with id: " + id);

        updateDoc(doc(firebase, `genomes/${id}`), { show: document.getElementById("hide-" + id).checked });
    }

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
            <!-- 3 way switch with options, A B and C-->
            <div id="selector">
                <button
                    on:click={() => {
                        sortingMethod = sortingMethods[0];
                        scoring = scoringMethods[0];
                    }}>Fitness</button
                >
                <button
                    on:click={() => {
                        sortingMethod = sortingMethods[1];
                        scoring = scoringMethods[1];
                    }}>Afstand afgelegd</button
                >
                <button
                    on:click={() => {
                        sortingMethod = sortingMethods[2];
                        scoring = scoringMethods[2];
                    }}>Tijd overleefd</button
                >
            </div>
            <div id="cars">
                {#each data as Car, i}
                    <div id="CarInstance">
                        <div class="info">
                            <p class="name">{Car.CarInstance.carName}</p>
                            <div class="buttons">
                                <button id="download" on:click={() => console.log(Car.genome.export())}>download</button>
                                <button id="remove" on:click={() => removeCar(Car.CarInstance.id)}>Verwijderen</button>
                                <input type="checkbox" checked={Car.show} id="hide-{Car.CarInstance.id}" on:click={() => hideCar(Car.CarInstance.id)} />
                            </div>
                        </div>
                    </div>
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
        display: none;
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
