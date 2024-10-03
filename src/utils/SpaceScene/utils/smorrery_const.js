import milky_way_texture from "@/assets/textures/2k_stars_milky_way.jpg";
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

export const SSS_TEXTURES = {
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

export const J2000 = 2451545.0;
export const MIN_DATE = new Date(1900, 0, 1);
export const MAX_DATE = new Date(2100, 11, 31);
export const MAX_TRACE_STEPS = 1000

export const radiusScale = 0.5;
export const spaceScale = 20;

export const MAX_FPS = 45
export const RENDER_TIMES = 1/ MAX_FPS

export const SUN_INFO = {
  name: "Sun",
  radius: 9,
  container: null,
  label: null,
  color: 0xffff00, // 自定義太陽的顏色，備用
};

export const planets_const = [
  {
    name: "Mercury",
    a: 0.38709927, // Semi-major Axis (a), AU
    e: 0.20563593, // Eccentricity (e)
    i: 7.00497902, // Inclination (i), deg
    om: 48.33076593, // Longitude of Ascending Node (Ω), deg
    varpi: 77.45779628, // Longitude of Perihelion (ϖ), deg
    ma: 174.796, // Mean Anomaly (M), deg
    epoch: J2000,
    color: 0xd3d3d3, //LightGray
    radius: 0.383, // Radius (R), of Earth radius
    category: "planet",
  },
  {
    name: "Venus",
    a: 0.72333566,
    e: 0.00677672,
    i: 3.39467605,
    om: 76.67984255,
    varpi: 131.60246718,
    ma: 50.115,
    epoch: J2000,
    color: 0xffffe0, // LightYellow
    radius: 0.949,
    category: "planet",
  },
  {
    name: "Earth",
    a: 1.00000261,
    e: 0.01671123,
    i: -0.00001531,
    om: 0.0,
    varpi: 102.93768193,
    ma: 100.464,
    epoch: J2000,
    color: 0x00bfff, // DeepSkyBlue
    radius: 1,
    category: "planet",
  },
  {
    name: "Mars",
    a: 1.52371034,
    e: 0.0933941,
    i: 1.84969142,
    om: 49.55953891,
    varpi: -23.94362959,
    ma: 355.453,
    epoch: J2000,
    color: 0xcd5c5c, // IndianRed
    radius: 0.532,
    category: "planet",
  },
  {
    name: "Jupiter",
    a: 5.202887,
    e: 0.04838624,
    i: 1.30439695,
    om: 100.47390909,
    varpi: 14.72847983,
    ma: 19.65,
    epoch: J2000,
    color: 0xcd853f, // Peru
    radius: 11.21,
    category: "planet",
  },
  {
    name: "Saturn",
    a: 9.53667594,
    e: 0.05386179,
    i: 2.48599187,
    om: 113.66242448,
    varpi: 92.59887831,
    ma: 317.02,
    epoch: J2000,
    color: 0xf0e68c, // Khaki
    radius: 9.45,
    category: "planet",
  },
  {
    name: "Uranus",
    a: 19.18916464,
    e: 0.04725744,
    i: 0.77263783,
    om: 74.01692503,
    varpi: 170.9542763,
    ma: 142.238,
    epoch: J2000,
    color: 0xe0ffff, // LightCyan
    radius: 4.01,
    category: "planet",
  },
  {
    name: "Neptune",
    a: 30.06992276,
    e: 0.00859048,
    i: 1.77004347,
    om: 131.78422574,
    varpi: 44.96476227,
    ma: 256.228,
    epoch: J2000,
    color: 0x4169e1, // RoyalBlue
    radius: 3.88,
    category: "planet",
  },
];
