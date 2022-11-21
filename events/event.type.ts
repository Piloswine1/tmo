import { SimulationSliceType } from "../simulationSlice.ts";

export interface IEvent<T, R> {
	modelTime: number;

	handle(state: SimulationSliceType<T, R>): SimulationSliceType<T, R>;
}
