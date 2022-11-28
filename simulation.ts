import { BasicEvent } from "./events/event.type.ts";
import { EventObserver } from "./events/eventObserver.ts";
import { ITS } from "./rand/ITS.ts";
import { BasicSimSlice } from "./simulationSlice.ts";

const eventsSorter = (a: BasicEvent, b: BasicEvent) =>
  a.modelTime - b.modelTime;
const getDefaultParams = () => ({
  k: 0,
  z: 0,
  done: 0,
  failed: 0,
});

export type BasicParams = {
  k: number;
  z: number;

  done: number;
  failed: number;
};

export type BasicRules = {
  maxK: number;
  maxZ: number;
};

export type BasicMetrics = Map<number, number[]>;

export class BasicSimulation {
  private eventList: BasicEvent[] = [];
  private randomizer = ITS(0);
  private rules: BasicRules = {
    maxK: 1,
    maxZ: 1,
  };
  private simParams: BasicParams = getDefaultParams();
  private maxModelTime = 1000;
  private metrics: BasicMetrics = new Map();
  private timeStep = 1.0;

  setEvents(events: BasicEvent[]) {
    this.eventList = events;
  }

  setSeed(num: number) {
    this.randomizer = ITS(num);
  }

  clear() {
    this.simParams = getDefaultParams();
  }

  setRules(rules: BasicRules) {
    this.rules = rules;
  }

  setTimeStep(timeStep: number) {
    this.timeStep = timeStep;
  }

  getRules() {
    return this.rules;
  }

  setMaxModelTime(time: number) {
    this.maxModelTime = time;
  }

  /**
   * @returns state without first (e.g. next) event
   */
  private get state(): BasicSimSlice {
    return ({
      randomizer: this.randomizer,
      eventList: this.eventList.slice(1),
      simParams: this.simParams,
      metrics: this.metrics,
      rules: this.rules,
    });
  }

  private set state(slice: BasicSimSlice) {
    this.eventList = slice.eventList.sort(eventsSorter);
  }

  getMetrics() {
    return this.metrics;
  }

  private getNextEvent() {
    return this.eventList[0];
  }

  private getTime() {
    return this.eventList[0].modelTime;
  }

  private prepareMetrics() {
    this.metrics.clear();
    this.eventList.push(new EventObserver(0, this.timeStep));
  }

  run() {
    this.prepareMetrics();

    while (this.getTime() < this.maxModelTime) {
      this.state = this.getNextEvent().handle(this.state);
    }
  }
}
