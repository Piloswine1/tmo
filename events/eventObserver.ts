import { BasicSimSlice } from "../simulationSlice.ts";
import { BasicEvent } from "./event.type.ts";

export class EventObserver implements BasicEvent {
  private timeStep: number;
  modelTime: number;

  constructor(modelTime: number, timeStep = 1) {
    this.modelTime = modelTime;
    this.timeStep = timeStep;
  }

  handle(state: BasicSimSlice): BasicSimSlice {
    const k = state.simParams.k;
    const z = state.simParams.z;

	const p = Array(state.rules.maxK * 2 + 1).fill(0);
    if (k === 0 && z === 0) p[0] = 1;
    if (k === 1 && z === 0) p[1] = 1;
    if (k === 1 && z === 0) p[2] = 1;
    if (k === 1 && z === 1) p[3] = 1;
    if (k === 2 && z === 1) p[4] = 1;

    state.eventList.push(
      new EventObserver(this.modelTime + this.timeStep, this.timeStep),
    );
    state.metrics.set(this.modelTime, p);

    return state;
  }
}
