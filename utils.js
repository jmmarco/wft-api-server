export function mapAndTransform(arr) {
  return arr.map((acr) => {
    const entry = Object.entries(acr)[0];
    return {
      acronym: entry[0],
      definition: entry[1],
    };
  });
}