import { BasicEvent } from "./events/event.type.ts";
import { EventObserver } from "./events/eventObserver.ts";
import { ITS } from "./rand/ITS.ts";
import { BasicSimSlice } from "./simulationSlice.ts";

const eventsSorter = (a: BasicEvent, b: BasicEvent) =>
  a.modelTime - b.modelTime;

export type BasicParams = {
  k: number;
  z: number;

  done: number;
  failed: number;
};

export type BasicRules = {
  maxK: number;
};

export type BasicMetrics = Map<number, number[]>;

export class BasicSimulation {
  private eventList: BasicEvent[] = [];
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
  private metrics: BasicMetrics = new Map();

  setEvents(events: BasicEvent[]) {
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
    this.randomizer = slice.randomizer;
    this.eventList = slice.eventList.sort(eventsSorter);
    this.simParams = slice.simParams;
    this.metrics = slice.metrics;
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
    this.eventList.push(new EventObserver(0, 1));
  }

  run() {
    this.prepareMetrics();

    while (this.getTime() < this.maxModelTime) {
      this.state = this.getNextEvent().handle(this.state);
    }
  }
}
