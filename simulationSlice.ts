import { IEvent } from "./events/event.type.ts";
import { BasicParams, BasicRules } from "./simulation.ts";

export type SimulationSliceType<T, R> = {
	randomizer: Generator<number>;
	eventList: IEvent<T, R>[];
	simParams: T;
	rules: R;
}

export type BasicSimSlice = SimulationSliceType<BasicParams, BasicRules>
