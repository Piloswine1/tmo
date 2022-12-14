import { BasicEvent } from "./event.type.ts";
import { Event2 } from "./event2.ts";
import { BasicSimSlice } from "../simulationSlice.ts";

export class Event1 implements BasicEvent {
  modelTime: number;

  constructor(start: number) {
    this.modelTime = start;
  }

  handle(state: BasicSimSlice): BasicSimSlice {
    state.simParams.k++;

    if (state.simParams.z < state.rules.maxZ) {
      state.simParams.z++;
      state.eventList.push(
        new Event2(
          this.modelTime + state.randomizer.next(state.rules.intencivityEv2),
        ),
      );
    } else {
      if (state.simParams.k <= state.rules.maxK) {
        // queue
      } else {
        state.simParams.k--;
        state.simParams.failed++;
      }
    }

    state.eventList.push(
      new Event1(
        this.modelTime + state.randomizer.next(state.rules.intencivityEv1),
      ),
    );

    return state;
  }
}
