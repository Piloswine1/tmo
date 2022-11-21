import { randomSeq } from "./rand.ts";

export function* ITS(seed = 1) {
	const L = 1;
	const mean = -1/L;
	const random = randomSeq(seed);

	while (true)
		yield Math.log(1 - random.next().value) * mean;
}
