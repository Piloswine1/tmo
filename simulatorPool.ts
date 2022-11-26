import { Event1 } from "./events/event1.ts";
import { BasicMetrics, BasicRules, BasicSimulation } from "./simulation.ts";
import { sumArrays } from "./utils.ts";

export class BasicSimulationPool {
  private simulation = new BasicSimulation();
  private maxIterations = 1000;
  private rules: BasicRules = { maxK: 2 };
  private metrics: BasicMetrics = new Map();

  private mergeMetrics(metrics: BasicMetrics) {
    metrics.forEach((metric, time) => {
      const onTime = this.metrics.get(time) ?? Array(this.rules.maxK * 2 + 1).fill(0);
      this.metrics.set(time, sumArrays(onTime, metric));
    });
  }

  normalizeMetrics() {
    for (const [time, metric] of this.metrics.entries()) {
      this.metrics.set(time, metric.map((e) => e / this.maxIterations));
    }
  }

  dumpMetrics() {
    const asArray = Array.from(this.metrics.entries());
    asArray.forEach(([time, p]) => {
      console.log(`[${time}]: ${p.map((val, i) => `P${i}=${val}`).join(',')}`);
    });
  }

  async dumpCSV(filename: string) {
	const encoder = new TextEncoder();
	const file = await Deno.open(filename, {write: true, truncate: true, create: true});

	await file.write(encoder.encode(`t;${this.metrics.get(0)?.map((_, i) => `P${i}`).join(';')}\n`));

	for (const [time, p] of this.metrics.entries()) {
		await file.write(encoder.encode(`${time};${p.join(';')}\n`));
	}

	file.close();
  }

  run() {
    this.metrics.clear();

    for (let i = 0; i < this.maxIterations; i++) {
      this.simulation.setSeed(i);
      this.simulation.setRules(this.rules);
      this.simulation.setEvents([new Event1(0)]);
      this.simulation.run();

      this.mergeMetrics(this.simulation.getMetrics());
    }
  }
}
