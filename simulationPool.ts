import { Event1 } from "./events/event1.ts";
import { BasicMetrics, BasicRules, BasicSimulation } from "./simulation.ts";
import { sumArrays } from "./utils.ts";

export class BasicSimulationPool {
  private simulation = new BasicSimulation();
  private maxIterations = 1000;
  private rules: BasicRules = { maxK: 2, maxZ: 1 };
  private metrics: BasicMetrics = new Map();

  private mergeMetrics(metrics: BasicMetrics) {
    metrics.forEach((metric, time) => {
      const onTime = this.metrics.get(time) ??
        Array.from(
          Array(this.rules.maxK + 1),
          () => Array(this.rules.maxZ + 1).fill(0),
        );
      this.metrics.set(time, sumArrays(onTime, metric));
    });
  }

  normalizeMetrics() {
    for (const [time, p] of this.metrics.entries()) {
      this.metrics.set(
        time,
        p.map((row) => row.map((e) => e / this.maxIterations)),
      );
    }
  }

  async dumpCSV(filename: string) {
    const encoder = new TextEncoder();
    const file = await Deno.open(filename, {
      write: true,
      truncate: true,
      create: true,
    });

    await file.write(
      encoder.encode(
        `t;${
          this.metrics.get(0)?.map((row, i) =>
            row.map((_, innerI) => `P${i}${innerI}`)
          ).flat().join(";")
        }\n`,
      ),
    );

    for (const [time, p] of this.metrics.entries()) {
      await file.write(encoder.encode(`${time};${p.flat().join(";")}\n`));
    }

    file.close();
  }

  run() {
    this.metrics.clear();

    for (let i = 0; i < this.maxIterations; i++) {
      this.simulation.clear();
      this.simulation.setSeed(i);
      this.simulation.setRules(this.rules);
      this.simulation.setEvents([new Event1(0)]);
      this.simulation.run();

      this.mergeMetrics(this.simulation.getMetrics());
    }
  }
}
