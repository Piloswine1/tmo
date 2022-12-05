import { BasicEvent } from "./events/event.type.ts";
import { BasicMetrics, BasicParams, BasicRules } from "./simulation.ts";

export type SimulationSliceType<T, R, M> = {
  randomizer: { next: (num?: number) => number };
  eventList: BasicEvent[];
  metrics: M;
  simParams: T;
  rules: R;
};

export type BasicSimSlice = SimulationSliceType<
  BasicParams,
  BasicRules,
  BasicMetrics
>;
