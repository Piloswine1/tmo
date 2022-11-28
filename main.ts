import { Command } from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";
import { BasicSimulationPool } from "./simulationPool.ts";

await new Command()
  .name("Sim")
  .version("1.0.0")
  .description(
    "Perfoming basic queueing theory simulation with option of varying of params",
  )
  .option("--intensity <intensity:number>", "Sim intensity", { default: 1 })
  .option("-i, --iterations <iterations:number>", "Sim iterations", {
    default: 1000,
  })
  .option("-k, --maxK <maxK:number>", "Sim maxK", { default: 2 })
  .option("-z, --maxZ <maxZ:number>", "Sim maxZ", { default: 1 })
  .option("-t, --timeStep <timeStep:number>", "Sim timeStep", { default: 1 })
  .option("-o, --output <output:string>", "Sim output", {
    default: "logs/events.csv",
  })
  .action(({ intensity, iterations, maxK, maxZ, timeStep, output }) => {
    const simPool = new BasicSimulationPool();

    simPool.setMaxIterations(iterations);
    simPool.setIntensity(intensity);
    simPool.getSimulation().setRules({ maxZ, maxK });
    simPool.getSimulation().setTimeStep(timeStep);

    simPool.run();
    simPool.normalizeMetrics();
    simPool.dumpCSV(output);
  })
  .parse();
