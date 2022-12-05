import { Event1 } from "./events/event1.ts";
import { BasicMetrics, BasicRules, BasicSimulation } from "./simulation.ts";
import { sumArrays } from "./utils.ts";

export class BasicSimulationPool {
  private simulation = new BasicSimulation();
  private maxIterations = 1000;
  private metrics: BasicMetrics = new Map();
  private intensity = 1;

  private mergeMetrics(metrics: BasicMetrics) {
    metrics.forEach((metric, time) => {
      const rules = this.simulation.getRules();
      const onTime = this.metrics.get(time) ?? Array(rules.maxK + 1).fill(0);
      this.metrics.set(time, sumArrays(onTime, metric));
    });
  }

  setMaxIterations(maxIterations: number) {
    this.maxIterations = maxIterations;
  }

  setIntensity(intensity: number) {
    this.intensity = intensity;
  }

  getSimulation() {
    return this.simulation;
  }

  normalizeMetrics() {
    for (const [time, p] of this.metrics.entries()) {
      this.metrics.set(
        time,
        p.map((e) => e / this.maxIterations),
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
        `t;${this.metrics.get(0)?.map((_, i) => `P${i}`).join(";")}\n`,
      ),
    );

    for (const [time, p] of this.metrics.entries()) {
      await file.write(encoder.encode(`${time};${p.join(";")}\n`));
    }

    file.close();
  }

  run() {
    this.metrics.clear();

    for (let i = 0; i < this.maxIterations; i++) {
      this.simulation.clear();
      this.simulation.setSeed(i);

      const events = Array.from(
        Array(this.intensity),
        () => new Event1(this.simulation.getRandTime() as number),
      );
      this.simulation.setEvents(events);
      this.simulation.run();

      this.mergeMetrics(this.simulation.getMetrics());
    }
  }
}
