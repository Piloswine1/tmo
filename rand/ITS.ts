import { randomSeq } from "./rand.ts";

export function makeITS(seed = 1) {
  const random = randomSeq(seed);

  return ({
    next(L = 1) {
      const mean = -1 / L;
      return Math.log(1 - random.next().value) * mean;
    },
  });
}
