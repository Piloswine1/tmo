export function* randomSeq(x = 1): Generator<number> {
	const N = 4294967296;
	const A = 1664525;
	const C = 1013904223;

	while (true) {
		x = (A * x + C) % N;
		yield x / N;
	}
}
