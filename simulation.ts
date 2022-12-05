import { BasicEvent } from "./events/event.type.ts";
import { Event1 } from "./events/event1.ts";
import { EventObserver } from "./events/eventObserver.ts";
import { makeITS } from "./rand/ITS.ts";
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

  intencivityEv1: number;
  intencivityEv2: number;
};

export type BasicMetrics = Map<number, number[]>;

export class BasicSimulation {
  private eventList: BasicEvent[] = [];
  private randomizer = makeITS(0);
  private rules: BasicRules = {
    maxK: 1,
    maxZ: 1,

    intencivityEv1: 1,
    intencivityEv2: 1,
  };
  private simParams: BasicParams = getDefaultParams();
  private maxModelTime = 1000;
  private metrics: BasicMetrics = new Map();
  private timeStep = 1.0;

  initEvents() {
    this.eventList = [new Event1(this.randomizer.next(this.rules.intencivityEv1))];
  }

  setSeed(num: number) {
    this.randomizer = makeITS(num);
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

  getParams() {
    return this.simParams;
  }

  getRandTime(L = 1) {
    return this.randomizer.next(L);
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
    this.eventList = [new EventObserver(0, this.timeStep), ...this.eventList];
  }

  run() {
    this.prepareMetrics();

    while (this.getTime() < this.maxModelTime) {
      this.state = this.getNextEvent().handle(this.state);
    }
  }
}
