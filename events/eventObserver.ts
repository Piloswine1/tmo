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
    const p = Array(state.rules.maxK + 1).fill(0);

    p[state.simParams.k] = 1;

    state.eventList.push(
      new EventObserver(this.modelTime + this.timeStep, this.timeStep),
    );
    state.metrics.set(this.modelTime, p);

    return state;
  }
}
