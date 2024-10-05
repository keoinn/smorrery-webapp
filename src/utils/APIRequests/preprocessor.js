/**
 * Parses and validates small bodies data from an API response.
 * 
 * This function processes the provided API data to extract and convert orbital elements 
 * for small celestial bodies, such as Near-Earth Objects (NEO). It filters out invalid 
 * entries where any orbital parameters are missing or NaN. The valid entries are returned 
 * as an array of objects containing the name and validated orbital elements.
 * 
 * @param {Object} data - The API response containing the small bodies data.
 * @param {Array} data.data - The array of small bodies data, where each row contains:
 *                            - [0] {string} full_name - The full name or identifier of the object.
 *                            - [1] {number} epoch - Julian Date of the epoch (e.g., 2460600.5).
 *                            - [2] {number} e - Eccentricity of the object's orbit.
 *                            - [3] {number} a - Semi-major axis in AU (Astronomical Units).
 *                            - [4] {number} q - Perihelion distance in AU.
 *                            - [5] {number} i - Inclination in degrees.
 *                            - [6] {number} om - Longitude of the ascending node (Ω) in degrees.
 *                            - [7] {number} w - Argument of perihelion (ϖ) in degrees.
 *                            - [8] {number} ma - Mean anomaly (M) in degrees.
 * 
 * @returns {Array<Object>} An array of objects containing validated small bodies data:
 *                          - name: {string} - Extracted name or identifier.
 *                          - orbitalParameters: {Object} - Validated orbital parameters.
 *                            - a: {number} - Semi-major axis in AU.
 *                            - e: {number} - Eccentricity.
 *                            - i: {number} - Inclination in degrees.
 *                            - om: {number} - Longitude of the ascending node in degrees.
 *                            - w: {number} - Argument of perihelion in degrees.
 *                            - ma: {number} - Mean anomaly in degrees.
 *                            - epoch: {number} - Epoch in Julian Date.
 *                          - color: {number} - Custom color (default: 0xffff00).
 *                          - opacity: {number} - Transparency level (default: 0.3).
 *                          - radius: {number} - Radius of the object (default: 0.2).
 *                          - category: {string} - Category of the object (default: 'NEO').
 * 
 * @throws {Error} If the API response structure is unexpected or invalid data is encountered.
 * 
 * @example
 * const apiResponse = {
 *   data: [
 *     ["2021 SM3", 2460600.5, 0.23, 1.2, 0.98, 23.5, 45.6, 200.3, 180.0],
 *     ["2020 AB", 2460595.5, 0.12, 2.1, 1.8, 10.5, 300.6, 140.9, 5.6]
 *   ]
 * };
 * 
 * const smallBodies = parseSmallBodiesData(apiResponse);
 * console.log(smallBodies);
 */
export function parseSmallBodiesData(data) {
  let smallBodiesData = [];

  if (data && data.data) {
    smallBodiesData = data.data.map(entry => {
      // Fields: full_name, epoch, e, a, q, i, om, w, ma
      // Extract the name or identifier (first element) as a string
      const fullName = entry[0];
      const extractedName = extractNameOrNumber(fullName);

      // Parse the remaining orbital parameters as floats
      const [ epoch, e, a, q, i, om, w, ma ] = entry.slice(1).map(parseFloat);

      // Validate parsed orbital data and check for NaN values
      if ([epoch, e, a, q, i, om, w, ma ].some(isNaN)) {
        console.warn(`Invalid data for object: ${fullName}`);
        return null; // Return null if any orbital parameter is invalid
      }

      // Return valid celestial body data
      return {
        name: extractedName,
        orbitalParameters: {
          a: a,        // Semi-major axis (a), in AU
          e: e,        // Eccentricity (e)
          i: i,        // Inclination (i), in degrees
          om: om,      // Ascending Node (Ω), in degrees
          w: w,        // Perihelion (ϖ), in degrees
          ma: ma,      // Mean Anomaly (M), in degrees
          epoch        // Epoch, in Julian Date, e.g., 2460600.5
        },
        color: 0xffff00, // Custom color for small bodies
        opacity: 0.3,    // Transparency level
        radius: 0.2,     // Custom radius
        category: 'NEO',
      };
    }).filter(Boolean);      // Filter out any null entries
  } else {
    console.error('Unexpected API response structure');
  }

  console.log(`Fetched and validated ${smallBodiesData.length} small bodies.`);

  return smallBodiesData;
}

/**
 * Extract the name or number from a given string input.
 * This function uses regular expressions to extract either the name and number of a celestial object 
 * (e.g., '433 Eros') or just the number (e.g., '433') from an input string.
 * 
 * The function first attempts to match a pattern like '433 Eros (A898 PA)' and extract both the number 
 * and name. If this fails, it will try to extract just the number from the input.
 * 
 * @param {string} input - The string input containing the object's name or number.
 * @returns {string|null} - Returns the extracted name/number or `null` if no match is found 
 *                          or the input is not a string.
 * 
 * @example
 * // Returns '433 Eros'
 * extractNameOrNumber(' 433 Eros (A898 PA)');
 * 
 * @example
 * // Returns '433'
 * extractNameOrNumber('433');
 * 
 * @example
 * // Returns null
 * extractNameOrNumber(123);  // Non-string input
 */
export function extractNameOrNumber(input) {
  // Ensure input is a string before processing
  if (typeof input !== 'string') {
      console.warn('Expected a string input, but received:', input);
      return null;
  }

  // Regex to match '433 Eros (A898 PA)' and extract name
  const numberNameRegex = /^\s+(\d+\s+[A-Za-z]+)\s+\(.*\)$/; 
  // Regex to match just the number
  const numberRegex = /^(\d+)/;

  // Try to match the name first
  let match = input.match(numberNameRegex);
  if (match) {
      return match[1];  // Return the name
  }

  // If no name match, try to match the number
  match = input.match(numberRegex);
  if (match) {
      return match[1];  // Return the number
  }

  // Return null if no match
  return null;
}