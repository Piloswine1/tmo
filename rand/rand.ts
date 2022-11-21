export function* randomSeq(x = 1): Generator<number> {
	const A = 84589;
	const C = 45989;
	const N = 217728;

	while (true) {
		x = (A * x + C) % N;
		yield x / N;
	}
}
