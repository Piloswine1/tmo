export const copyObject = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

export const makeMDArray = (n: number, m: number): number[][] =>
  Array.from(Array(n), () => Array(m).fill(0));

export const sumArrays = (a: number[][], b: number[][]): number[][] => {
  for (let i = 0; i < a.length; i++) {
    for (let n = 0; n < a[i].length; n++) {
      b[i][n] += a[i][n];
    }
  }
  return b;
};
