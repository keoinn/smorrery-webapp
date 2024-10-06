import { J2000, J1970, STD_GRAV_PARAM_SUN } from '@/utils/SpaceScene/utils/constants.js';
import { Vector3, Matrix4 } from 'three';

// Calculate the Mean Anomaly (M).
const updateMeanAnomaly = (period, M, year) => {
  const n = 2 * Math.PI / period; // Mean motion (rad per year)
  const newM = M + n * year;      // New mean anomaly
  return newM % (2 * Math.PI);    // Make sure M ∈ [0, 2π)
};

// Calculate the Eccentric Anomaly (E) by Solving Kepler's Equation.
const calcEccentricAnomaly = (e, M) => {
  // Initial guess for Eccentric Anomaly (in radians)
  let E = M;
  const tolerance = 1e-6;
  let delta = 1;

  // Newton-Raphson iteration to solve Kepler's Equation: M = E - e * sin(E)
  while (Math.abs(delta) > tolerance) {
    delta = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    E = E - delta;
  }

  // Eccentric Anomaly (in radians)
  return E;
};

// Calculate the True Anomaly (ν) from Eccentric Anomaly (E).
const calcTrueAnomaly = (e, E) => {
  return (
    2 * Math.atan2(
      Math.sqrt(1 + e) * Math.sin(E / 2),
      Math.sqrt(1 - e) * Math.cos(E / 2)
    )
  );
};

// Calculate the Radial Distance (r) for an Elliptical Orbit on a Plane.
const calcRadialDistance = (a, e, nu) => {
  return a * (1 - e ** 2) / (1 + e * Math.cos(nu));
};

// Convert 2D Polar Coordinates (r, ν) to 3D Cartesian Coordinates (x, y, z).
const polarToCartesian3D = (r, nu) => {
  const x = r * Math.cos(nu);
  const y = 0;
  const z = -r * Math.sin(nu);
  return [x, y, z];
};

// Calculate the Orbital Period using Kepler's 3rd Law.
const calcOrbitalPeroid = (a) => {
  return Math.sqrt(a ** 3);
};

// Calculate the Orbital Rotation Matrix based on the Orbital Elements.
export const getOrbitalRotationMatrix = (i, Omega, w) => {
  const rotationMatrix = new Matrix4();

  // Rotate by Ω (Longitude of Ascending Node) around Y axis
  rotationMatrix.makeRotationY(Omega * Math.PI / 180);

  // Rotate by i (Inclination) around X axis
  const iMatrix = new Matrix4();
  iMatrix.makeRotationX(i * Math.PI / 180);
  rotationMatrix.multiply(iMatrix);

  // Rotate by ω (Argument of Perihelion) around Y axis (within the orbital plane)
  const omega = w - Omega;  // Calculate ω from ϖ (Longitude of Perihelion)
  const omegaMatrix = new Matrix4();
  omegaMatrix.makeRotationY(omega * Math.PI / 180);
  rotationMatrix.multiply(omegaMatrix);

  return rotationMatrix;
}

// Calculate the Position Vector based on Orbital Elements and Year Since J2000.
const calcPosition = (yearSinceJ2000, orbitalParameters, period, SPACE_SCALE) => {
  const { a, e, i, om, w, ma } = orbitalParameters; 

  // Calculate the Anomalies (angular parameters that defines a position along an orbit)
  const M_ = updateMeanAnomaly(period, ma, yearSinceJ2000);
  const E_ = calcEccentricAnomaly(e, M_);
  const nu_ = calcTrueAnomaly(e, E_);

  // Calulate the Coordinates
  const r_ = calcRadialDistance(a, e, nu_);
  const [x_, y_, z_] = polarToCartesian3D(r_, nu_);
  const position = new Vector3(x_, y_, z_);

  // Apply Orbital Rotations and Scaling
  const rotationMatrix = getOrbitalRotationMatrix(i, om, w);
  position.applyMatrix4(rotationMatrix);
  position.multiplyScalar(SPACE_SCALE);

  return position;
}

const calcJulianDate = (date) => {
  return (date.getTime() / 86400000) + J1970;
}

const calcYearSinceJ2000 = (date) => {
  const currentJulianDate = calcJulianDate(date);
  return (currentJulianDate - J2000) / 365.25;
}

/** 
 * Determine the Orbital Elements for a given position and velocity.
 * This is for the LAB MODULE.
 * @param {Vector3} position - The initial position vector of the orbiting object.
 * @param {Vector3} velocity - The initial velocity vector of the orbiting object.
 * @param {number} mu - The standard gravitational parameter of the central object (in AU).
 * @see https://en.wikipedia.org/wiki/Orbit_determination
 */
const determineOrbit = (initPosition, initVelocity, mu, verbose = true) => {
  const initPosMag = initPosition.length();
  const initVelMag = initVelocity.length();

   // Calculate Specific Mechanical Energy (ε)
  const epsilon = initVelMag**2 / 2 - mu / initPosMag;

  // Calculate Semi-major Axis (a)
  const a = -mu / (2 * epsilon);

  // Calculate Specific Angular Momentum Vector (h)
  const h_vec = new Vector3().crossVectors(initPosition, initVelocity);
  
  // Calculate Eccentricity Vector (e_vec) and Eccentricity (e)
  const vCrossHByMu = initVelocity.clone().cross(h_vec).divideScalar(S)
  const e_vec = vCrossHByMu.sub(position.clone().normalize()).multiplyScalar(-1);
  const e = e_vec.length();

  // Calculate Inclination (i)
  const i = Math.acos(h_vec.y / h_vec.length()) * (180 / Math.PI);

  // Calculate Longitude of Ascending Node (Ω)
  let Omega = Math.atan2(h_vec.x, -h_vec.z) * (180 / Math.PI);
  if (Omega < 0) Omega += 360;

  // Calculate Argument of Perihelion (ω)
  const n_vec = new THREE.Vector3(h_vec.z, 0, -h_vec.x);  // Node vector
  const omega = Math.acos(n_vec.dot(e_vec) / (n_vec.length() * e)) * (180 / Math.PI);
  const w = omega + Omega

  if (verbose) {
      printQuantity(mu, 'µ', 'AU^3 yr^(-2)');
      console.log('r0 = ', initPosition, 'AU');
      printQuantity(initPosMag, '|r0|', 'AU');
      console.log('v0 = ', initVelocity, 'AU/yr');
      printQuantity(initVelMag, '|v0|', 'AU/yr');
      printQuantity(epsilon, 'ε', 'EarthMass AU^2 yr^(-2)');
      printQuantity(a, 'a', 'AU');
      console.log('v = ', h_vec);
      console.log('e = ', e_vec);
      printQuantity(e, '|e|');
      printQuantity(i, 'i', '°');
      printQuantity(Omega, 'Ω', '°');
      printQuantity(omega, 'ω', '°');
  }

  return {
      a: a,
      e: e,
      i: i,
      om: Omega,
      w: w, 
      ma: 0, // to be calculated later
      q: a * (1 - e),
      Q: a * (1 + e),
      h_vec: h_vec,
      e_vec: e_vec, 
      n_vec: n_vec
  };
}

export {
  calcRadialDistance,  // for plotting orbit in the future
  polarToCartesian3D,  // for plotting orbit in the future
  calcOrbitalPeroid,  // -> objects.js
  calcYearSinceJ2000,  // -> loop.js
  calcPosition,  // -> objects.js
};
