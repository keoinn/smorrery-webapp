// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore(
  'app',
  () => {
    const isOpenNav = ref(true)

    const changeOpenNav = () => {
      isOpenNav.value = !isOpenNav.value
      console.log("changeOpenNav", isOpenNav.value)
    }

    return {
      isOpenNav,
      changeOpenNav,
    }
  }
)

// async function fetchSmallBodyData() {
//   try {
//       const response = await fetch('/api/sbdb_query');
//       const data = await response.json();

//       // Check if the response data has the expected structure
//       if (data && data.data) {
//           smallBodiesData = data.data.map(body => {
//               // Fields: full_name, epoch, e, a, q, i, om, w, ma
//               // Extract the name or identifier (first element) as a string
//               const fullName = body[0];
//               const extractedName = extractNameOrNumber(fullName);
          
//               // Parse the remaining orbital parameters as floats
//               const [ epoch, e, a, q, i, om, w, ma ] = body.slice(1).map(parseFloat);
          
//               // Validate parsed orbital data and check for NaN values
//               if ([epoch, e, a, q, i, om, w, ma ].some(isNaN)) {
//                   console.warn(`Invalid data for object: ${fullName}`);
//                   return null; // Return null if any orbital parameter is invalid
//               }
          
//               // Return valid celestial body data
//               return {
//                   name: extractedName,
//                   orbitalParameters: {
//                       a: a,        // Semi-major axis (a), in AU
//                       e: e,        // Eccentricity (e)
//                       i: i,        // Inclination (i), in degrees
//                       om: om,      // Ascending Node (Ω), in degrees
//                       w: w,        // Perihelion (ϖ), in degrees
//                       ma: ma,      // Mean Anomaly (M), in degrees
//                       epoch        // Epoch, in Julian Date, e.g., 2460600.5
//                   },
//                   color: 0xffff00, // Custom color for small bodies
//                   opacity: 0.3,    // Transparency level
//                   radius: 0.2,     // Custom radius
//                   category: 'NEO',
//               };
//           }).filter(Boolean);      // Filter out any null entries

//           console.log(`Fetched and validated ${smallBodiesData.length} small bodies.`);
//           console.log(smallBodiesData);
//       } else {
//           console.error('Unexpected API response structure');
//       }
//   } catch (error) {
//       console.error('Error fetching sbdb_data:', error);
//   }
// }