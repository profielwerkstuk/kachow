import { MersenneTwister, generateTile } from "../utils";
import { RoadGenerator } from "./RoadGenerator";

import type { Coordinate, Tile } from "../types";
import { getLineFormula, setWalls } from "../Mathamphetamine";

export class Simulation {
	public tiles: Tile[] = [];
	private roadGenerator: RoadGenerator;
	public mersenneTwister = new MersenneTwister(0);

	constructor(
		public gridSize: [number, number],
		public tileSize: number,
		public roadWidth: number,
		public roadCurveResolution: number,
		public circuit = false
	) {
		this.roadGenerator = new RoadGenerator(this.tileSize, this.roadCurveResolution, this.roadWidth);

		addEventListener("generateTile", () => {
			if (!this.circuit) {
				const generatedTile = generateTile(this.tiles[this.tiles.length - 1], this.tileSize, this.gridSize, this.mersenneTwister);
				const nextTile = this.roadGenerator.createTile(...generatedTile);
				this.tiles.push(nextTile);

				// Only keep 3 tiles on the screen at all times
				if (this.tiles.length > 3) this.tiles.shift();
			}
		})
	}

	init = () => {
		this.tiles = [];

		if (!this.circuit) {
			const event = new CustomEvent("generateTile");
			dispatchEvent(event);
			dispatchEvent(event);
		} else {
			this.tiles.push(this.roadGenerator.createTile({ from: "right", to: "bottom" }, [0, 0]));
			this.tiles.push(this.roadGenerator.createTile({ from: "top", to: "bottom" }, [0 * this.tileSize, 1 * this.tileSize]));
			this.tiles.push(this.roadGenerator.createTile({ from: "top", to: "bottom" }, [0 * this.tileSize, 2 * this.tileSize]));
			this.tiles.push(this.roadGenerator.createTile({ from: "top", to: "bottom" }, [0 * this.tileSize, 3 * this.tileSize]));
			this.tiles.push(this.roadGenerator.createTile({ from: "top", to: "right" }, [0 * this.tileSize, 4 * this.tileSize]));
			this.tiles.push(this.roadGenerator.createTile({ from: "left", to: "top" }, [1 * this.tileSize, 4 * this.tileSize]));
			this.tiles.push(this.roadGenerator.createTile({ from: "bottom", to: "right" }, [1 * this.tileSize, 3 * this.tileSize]));
			this.tiles.push(this.roadGenerator.createTile({ from: "left", to: "bottom" }, [2 * this.tileSize, 3 * this.tileSize]));
			this.tiles.push(this.roadGenerator.createTile({ from: "top", to: "right" }, [2 * this.tileSize, 4 * this.tileSize]));
			this.tiles.push(this.roadGenerator.createTile({ from: "left", to: "right" }, [3 * this.tileSize, 4 * this.tileSize]));
			this.tiles.push(this.roadGenerator.createTile({ from: "left", to: "top" }, [4 * this.tileSize, 4 * this.tileSize]));
			this.tiles.push(this.roadGenerator.createTile({ from: "bottom", to: "top" }, [4 * this.tileSize, 3 * this.tileSize]));
			this.tiles.push(this.roadGenerator.createTile({ from: "bottom", to: "top" }, [4 * this.tileSize, 2 * this.tileSize]));
			this.tiles.push(this.roadGenerator.createTile({ from: "bottom", to: "top" }, [4 * this.tileSize, 1 * this.tileSize]));
			this.tiles.push(this.roadGenerator.createTile({ from: "bottom", to: "left" }, [4 * this.tileSize, 0 * this.tileSize]));
			this.tiles.push(this.roadGenerator.createTile({ from: "right", to: "left" }, [3 * this.tileSize, 0 * this.tileSize]));
			this.tiles.push(this.roadGenerator.createTile({ from: "right", to: "bottom" }, [2 * this.tileSize, 0 * this.tileSize]));
			this.tiles.push(this.roadGenerator.createTile({ from: "top", to: "right" }, [2 * this.tileSize, 1 * this.tileSize]));
			this.tiles.push(this.roadGenerator.createTile({ from: "left", to: "bottom" }, [3 * this.tileSize, 1 * this.tileSize]));
			this.tiles.push(this.roadGenerator.createTile({ from: "top", to: "left" }, [3 * this.tileSize, 2 * this.tileSize]));
			this.tiles.push(this.roadGenerator.createTile({ from: "right", to: "left" }, [2 * this.tileSize, 2 * this.tileSize]));
			this.tiles.push(this.roadGenerator.createTile({ from: "right", to: "top" }, [1 * this.tileSize, 2 * this.tileSize]));
			this.tiles.push(this.roadGenerator.createTile({ from: "bottom", to: "top" }, [1 * this.tileSize, 1 * this.tileSize]));
			this.tiles.push(this.roadGenerator.createTile({ from: "bottom", to: "left" }, [1 * this.tileSize, 0 * this.tileSize]));

			// this.tiles.push(this.roadGenerator.createTile({ from: "right", to: "bottom" }, [0, 0]));
			// this.tiles.push(this.roadGenerator.createTile({ from: "top", to: "bottom" }, [0, this.tileSize]));
			// this.tiles.push(this.roadGenerator.createTile({ from: "top", to: "right" }, [0, 2 * this.tileSize]));
			// this.tiles.push(this.roadGenerator.createTile({ from: "right", to: "left" }, [this.tileSize, 2 * this.tileSize]));
			// this.tiles.push(this.roadGenerator.createTile({ from: "left", to: "top" }, [2 * this.tileSize, 2 * this.tileSize]));
			// this.tiles.push(this.roadGenerator.createTile({ from: "bottom", to: "top" }, [2 * this.tileSize, this.tileSize]));
			// this.tiles.push(this.roadGenerator.createTile({ from: "bottom", to: "left" }, [2 * this.tileSize, 0]));
			// this.tiles.push(this.roadGenerator.createTile({ from: "left", to: "right" }, [this.tileSize, 0]));
		}

		const TL = [0, 0] as Coordinate;
		const BL = [0, this.gridSize[0] * this.tileSize] as Coordinate;
		const TR = [this.gridSize[1] * this.tileSize, 0] as Coordinate;
		const BR = [this.gridSize[1] * this.tileSize, this.gridSize[0] * this.tileSize] as Coordinate;

		setWalls([
			getLineFormula(TL, TR),
			getLineFormula(TR, BR),
			getLineFormula(BL, BR),
			getLineFormula(TL, BL)
		])
	}

	reset = () => {
		this.init();
	}
}