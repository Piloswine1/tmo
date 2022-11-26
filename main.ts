import { Event1 } from "./events/event1.ts";
import { BasicSimulation } from "./simulation.ts";
import { BasicSimulationPool } from "./simulatorPool.ts";

const simPool = new BasicSimulationPool();
simPool.run();
simPool.normalizeMetrics();
simPool.dumpCSV('logs/events.csv');
//simPool.dumpMetrics();

//const sim = new BasicSimulation();
//sim.setRules({maxK: 2});
//sim.setEvents([new Event1(0)]);
//sim.run();
//console.log(sim.getMetrics());
