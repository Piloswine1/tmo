export const copyObject = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

export const makeMDArray = (n: number, m: number): number[][] =>
  Array.from(Array(n), () => Array(m).fill(0));

export const sumArrays = (a: number[], b: number[]): number[] =>
  a.map((x, i) => b[i] + x);
