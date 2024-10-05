import sun_texture from "@/assets/textures/2k_sun.jpg";
import mercury_texture from "@/assets/textures/2k_mercury.jpg";
import venus_texture from "@/assets/textures/2k_venus_surface.jpg";
import earth_texture from "@/assets/textures/2k_earth_daymap.jpg";
import moon_texture from "@/assets/textures/2k_moon.jpg";
import mars_texture from "@/assets/textures/2k_mars.jpg";
import jupiter_texture from "@/assets/textures/2k_jupiter.jpg";
import saturn_texture from "@/assets/textures/2k_saturn.jpg";
import saturn_ring_texture from "@/assets/textures/2k_saturn_ring_alpha.png";
import uranus_texture from "@/assets/textures/2k_uranus.jpg";
import neptune_texture from "@/assets/textures/2k_neptune.jpg";
import milky_way_texture from "@/assets/textures/2k_stars_milky_way.jpg";

// TEXTURES FOR SUN, PLANETS, AND MOONS
const SSS_TEXTURES = {
  SUN: sun_texture,
  MERCURY: mercury_texture,
  VENUS: venus_texture,
  EARTH: earth_texture,
  MOON: moon_texture,
  MARS: mars_texture,
  JUPITER: jupiter_texture,
  SATURN: saturn_texture,
  SATURN_RING: saturn_ring_texture,
  URANUS: uranus_texture,
  NEPTUNE: neptune_texture,
  MILKY_WAY: milky_way_texture,
};

// CONSTANTS FOR SCENE & ANIMATION SETTINGS
const SPACE_SCALE = 20;
const RADIUS_SCALE = 0.5;
const MAX_TRACE_STEPS = 1000
const MAX_FPS = 45
const RENDER_TIMES = 1/ MAX_FPS

// CONSTANTS FOR DATE & TIME
const J2000 = 2451545.0; // Julian Date of January 1, 2000, at 12:00:00 UT
const J1970 = 2440587.5; // Julian Date of January 1, 1970, at 12:00:00 UT
const MIN_DATE = new Date(1900, 0, 1);    // Earliest date we can calculate in the orrery program
const MAX_DATE = new Date(2100, 11, 31);  // Latest date we can calculate in the orrery program

// UNIT CONVERSIONS
const AU_TO_M = 1.4960e11; // AU to meters
const YEAR_TO_SEC = 365.25 * 86400 ; // yr to seconds
const EARTH_MASS_TO_KG = 5.972e24; // Earth mass to kg
const SOLAR_MASS_TO_KG = 1.989e30; // Solar mass to kg

// UNIVERSAL PHYSICAL CONSTANTS
const GRAV_CONST_SI = 6.6738e-11 // Gravitational Constant (m^3 kg^(-1) s^(-2))

// Gravitational Constant = 1.1855e-4 AU^3 EarthMass^(-1) yr^(-2)
const GRAV_CONST_ASTRO = GRAV_CONST_SI * (EARTH_MASS_TO_KG * YEAR_TO_SEC**2) / AU_TO_M**3; 

// Standard Gravitational parameter for the Sun = 39.4835 m^3 s^(-2)
const STD_GRAV_PARAM_SUN =  GRAV_CONST_ASTRO * (SOLAR_MASS_TO_KG / EARTH_MASS_TO_KG);


/*            TABLE FOR ORBITAL & PHYSICAL CONSTANTS
 * ----------------------------------------------------------------
 *   NOTATION    NAME                            UNIT
 * ----------------------------------------------------------------
 * :::ORBITAL CONSTANTS:::
 *   epoch       Epoch of Perihelion Passage     JD
 *   period      Orbital Period                  yr
 *   a           Semi-major Axis                 AU
 *   e           Eccentricity                    none
 *   i           Inclination                     deg
 *   om (Ω)      Longitude of Ascending Node     deg
 *   w (ϖ)[^1]   Longitude of Perihelion         deg
 *   ma (M)      Mean Anomaly                    deg
 * 
 * :::PHYSICAL CONSTANTS:::
 *   mass        Mass (relative to Earth)        Earth masses
 *   radius      Radius (relative to Earth)      Earth radii
 * 
 * -----------------------------------------------------------------
 * [^1]: The old variable name for 'w' in our earlier versions is 'varpi'.
 */

// https://lweb.cfa.harvard.edu/~dfabricant/huchra/ay145/constants.html


const SUN_DATA = {
  name: "Sun",
  orbitalParameters: {},
  color: 0xffff00,
  mass: 332955.2,
  radius: 3,
  category: 'sun',
  container: null, // DELETE LATER
  label: null, // DELETE LATER
};

const PLANETS_DATA = [
  {
  name: 'Mercury',
  orbitalParameters: {
    a: 0.38709927,          
    e: 0.20563593,
    i: 7.00497902,
    om: 48.33076593,
    w: 77.45779628,
    ma: 174.796,
    epoch: J2000
  },
  color: 0xD3D3D3,    // LightGray
  radius: 0.383,      // Radius 
  mass: 0.055,        // Mass relative to Earth
  category: 'planet'
  },
  {
  name: 'Venus',
  orbitalParameters: {
    a: 0.72333566,
    e: 0.00677672,
    i: 3.39467605,
    om: 76.67984255,
    w: 131.60246718,
    ma: 50.115,
    epoch: J2000
  },
  color: 0xFFFFE0, // LightYellow
  radius: 0.949,
  category: 'planet'
  },
  {
  name: 'Earth',
  orbitalParameters: {
    a: 1.00000261,
    e: 0.01671123,
    i: -0.00001531,
    om: 0.0,
    w: 102.93768193,
    ma: 100.464,
    epoch: J2000
  },
  color: 0x00BFFF, // DeepSkyBlue
  radius: 1,
  category: 'planet'
  },
  {
  name: 'Mars',
  orbitalParameters: {
    a: 1.52371034,
    e: 0.09339410,
    i: 1.84969142,
    om: 49.55953891,
    w: -23.94362959,
    ma: 355.453,
    epoch: J2000
  },
  color: 0xCD5C5C, // IndianRed
  radius: 0.532,
  category: 'planet'
  },
  {
  name: 'Jupiter',
  orbitalParameters: {
    a: 5.20288700,
    e: 0.04838624,
    i: 1.30439695,
    om: 100.47390909,
    w: 14.72847983,
    ma: 19.650,
    epoch: J2000
  },
  color: 0xCD853F, // Peru
  radius: 11.21,
  category: 'planet'
  },
  {
  name: 'Saturn',
  orbitalParameters: {
    a: 9.53667594,
    e: 0.05386179,
    i: 2.48599187,
    om: 113.66242448,
    w: 92.59887831,
    ma: 317.020,
    epoch: J2000
  },
  color: 0xF0E68C, // Khaki
  radius: 9.45,
  category: 'planet'
  },
  {
  name: 'Uranus',
  orbitalParameters: {
    a: 19.18916464,
    e: 0.04725744,
    i: 0.77263783,
    om: 74.01692503,
    w: 170.95427630,
    ma: 142.238,
    epoch: J2000
  },
  color: 0xE0FFFF, // LightCyan
  radius: 4.01,
  category: 'planet'
  },
  {
  name: 'Neptune',
  orbitalParameters: {
    a: 30.06992276,
    e: 0.00859048,
    i: 1.77004347,
    om: 131.78422574,
    w: 44.96476227,
    ma: 256.228,
    epoch: J2000
  },
  color: 0x4169E1, // RoyalBlue
  radius: 3.88,
  category: 'planet'
}
];

export {
  J2000,
  J1970,
  MIN_DATE,
  MAX_DATE,
  MAX_TRACE_STEPS,
  RADIUS_SCALE,
  SPACE_SCALE,
  MAX_FPS,
  RENDER_TIMES,
  GRAV_CONST_ASTRO,
  STD_GRAV_PARAM_SUN,
  SUN_DATA,
  PLANETS_DATA,
  SSS_TEXTURES,
}