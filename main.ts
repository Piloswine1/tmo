import { Command } from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";
import { BasicSimulationPool } from "./simulationPool.ts";

await new Command()
  .name("Sim")
  .version("1.0.0")
  .description(
    "Perfoming basic queueing theory simulation with option of varying of params",
  )
  .option("-L, --intensityL <intensityEv1:number>", "Sim intensity", {
    default: 1,
  })
  .option("-M, --intensityM <intensityEv2:number>", "Sim intensity", {
    default: 1,
  })
  .option("-i, --iterations <iterations:number>", "Sim iterations", {
    default: 1000,
  })
  .option("-k, --maxK <maxK:number>", "Sim maxK", { default: 2 })
  .option("-z, --maxZ <maxZ:number>", "Sim maxZ", { default: 1 })
  .option("-s, --timeStep <timeStep:number>", "Sim timeStep", { default: 1 })
  .option("-t, --maxTime <maxTime:number>", "Sim maxTime", { default: 1000 })
  .option("-o, --output <output:string>", "Sim output", {
    default: "logs/events.csv",
  })
  .action(
    (
      {
        intensityL,
        intensityM,
        iterations,
        maxK,
        maxZ,
        timeStep,
        maxTime,
        output,
      },
    ) => {
      const simPool = new BasicSimulationPool();

      simPool.setMaxIterations(iterations);
      simPool.getSimulation().setRules({
        maxZ,
        maxK,
        intencivityEv1: intensityL,
        intencivityEv2: intensityM,
      });
      simPool.getSimulation().setTimeStep(timeStep);
      simPool.getSimulation().setMaxModelTime(maxTime);

      //console.log({params: simPool.getSimulation().getParams()});
      simPool.run();
      simPool.normalizeMetrics();
      simPool.dumpCSV(output);
    },
  )
  .parse();
