import { BasicEvent } from "./event.type.ts";
import { BasicSimSlice } from "../simulationSlice.ts";

export class Event2 implements BasicEvent {
  modelTime: number;

  constructor(start: number) {
    this.modelTime = start;
  }

  handle(state: BasicSimSlice): BasicSimSlice {
    state.simParams.k--;
    state.simParams.done++;

    if (state.simParams.k > state.rules.maxK) {
      state.eventList.push(
        new Event2(this.modelTime + state.randomizer.next().value),
      );
    } else {
      state.simParams.z--;
    }

    return state;
  }
}
