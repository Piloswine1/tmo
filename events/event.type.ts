import { BasicSimSlice } from "../simulationSlice.ts";

export interface BasicEvent {
  modelTime: number;

  handle(state: BasicSimSlice): BasicSimSlice;
}
