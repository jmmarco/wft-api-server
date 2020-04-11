// Map over the incoming JSON structure and return usable objects
export function mapAndTransform(json) {
  return JSON.parse(json).map((acr) => {
    const entry = Object.entries(acr)[0];
    return {
      acronym: entry[0],
      definition: entry[1],
    };
  });
}