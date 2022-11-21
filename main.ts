import { Event1 } from "./events/event1.ts";
import { BasicSimulation } from "./simulation.ts";


for (let i = 0; i < 2; i++) {
	const simulation = new BasicSimulation([new Event1(0)])
	simulation.setSeed(i);
	simulation.setRules({ maxK: 2 });

	simulation.run();
	simulation.dumpToCSV(`logs/${i}.csv`);
}
