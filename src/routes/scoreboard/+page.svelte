<script lang="ts">
  import type { Genome } from '$lib/scripts/classes/NEAT/Genome';
  import type { Car as _Car } from "$lib/scripts/classes/Car";
  import { onMount } from 'svelte';

    let index: any

    let data: { CarInstance: _Car, genome: Genome, fitness: number }[] = []

    onMount(async () => {
        index = await import('$lib/scripts/index')

        index.load()

		addEventListener("keypress", (e) => {
			if (e.key === "p") console.log(index.Cars);
		})

        setInterval(() => {
            data = index.Cars ?? "loading"

            data.sort((a, b) => {
                if (a.genome.fitness > b.genome.fitness) return -1
                if (a.genome.fitness < b.genome.fitness) return 1
                return 0
            })
        }, 1000)
    })
</script>

<canvas id="canvas">

</canvas>

{#if index?.Cars}
    {#each data as Car}
        <p>{Car.CarInstance.id} - {JSON.stringify(Car.genome.fitness)}</p>
    {/each}
{/if}