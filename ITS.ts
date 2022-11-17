import { randomSeq } from "./rand.ts";

export function* ITS() {
	const L = 1;
	const random = randomSeq();

	while (true)
		yield Math.log(1 - random.next().value) / -L;
}
