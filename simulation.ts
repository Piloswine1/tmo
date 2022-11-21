import { IEvent } from "./events/event.type.ts";
import { ITS } from "./rand/ITS.ts";
import { SimulationSliceType } from "./simulationSlice.ts";

const eventsSorter = <T, R>(a: IEvent<T, R>, b: IEvent<T, R>) => a.modelTime - b.modelTime;
const copyObject = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj))

export type BasicParams = {
	k: number;
	z: number;

	done: number;
	failed: number;
}

export type BasicRules = {
	maxK: number;
}

export class BasicSimulation {
	private eventList: IEvent<BasicParams, BasicRules>[];
	private randomizer = ITS(0);
	private rules: BasicRules = {
		maxK: 1,
	};
	private simParams: BasicParams = {
		k: 0,
		z: 0,

		done: 0,
		failed: 0,
	};
	private maxModelTime = 1000;
	private metrics: Map<number, BasicParams> = new Map();

	constructor(events: IEvent<BasicParams, BasicRules>[]) {
		this.eventList = events;
	}

	setSeed(num: number) {
		this.randomizer = ITS(num);
	}

	setParams(params: BasicParams) {
		this.simParams = params;
	}

	setRules(rules: BasicRules) {
		this.rules = rules;
	}

	/**
	 * @returns state without first (e.g. next) event
	 */
	private get state(): SimulationSliceType<BasicParams, BasicRules> {
		return ({
			randomizer: this.randomizer,
			eventList: this.eventList.slice(1),
			simParams: this.simParams,
			rules: this.rules,
		});
	}

	private set state(slice: SimulationSliceType<BasicParams, BasicRules>) {
		this.randomizer = slice.randomizer;
		this.eventList = slice.eventList.sort(eventsSorter);
		this.simParams  = slice.simParams;
	}

	private getNextEvent() {
		return this.eventList[0];
	}

	private getTime() {
		return this.eventList[0].modelTime;
	}

	private gatherMetrics() {
		this.metrics.set(
			this.getTime(),
			copyObject(this.simParams)
		);
	}

	dumpMap() {
		for (const [time, metrics] of this.metrics) {
			const prefix = `[${time}]:`.padEnd(25);
			console.log(prefix + JSON.stringify(metrics));
		}
	}

	async dumpToCSV(filename: string) {
		const encoder = new TextEncoder();
		const file = await Deno.open(filename, { create: true, write: true, truncate: true });
		await file.write(encoder.encode("t;k;z;done;failed\n"));

		for (const [time, metrics] of this.metrics) {
			await file.write(encoder.encode(
				`${time};${metrics.k};${metrics.z};${metrics.done};${metrics.failed}\n`
			));
		}

		file.close();
	}

	run() {
		this.metrics = new Map();
		this.gatherMetrics();

		while (this.getTime() < this.maxModelTime) {
			this.state = this.getNextEvent().handle(this.state);

			this.gatherMetrics();
		}
	}
}
