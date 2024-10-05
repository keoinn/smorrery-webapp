import { J2000 } from '@/utils/SpaceScene/utils/smorrery_const.js';
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
const getOrbitalRotationMatrix = (i, Omega, varpi) => {
  const rotationMatrix = new Matrix4();

  // Rotate by Ω (Longitude of Ascending Node) around Y axis
  rotationMatrix.makeRotationY(Omega * Math.PI / 180);

  // Rotate by i (Inclination) around X axis
  const iMatrix = new Matrix4();
  iMatrix.makeRotationX(i * Math.PI / 180);
  rotationMatrix.multiply(iMatrix);

  // Rotate by ω (Argument of Perihelion) around Y axis (within the orbital plane)
  const omega = varpi - Omega;  // Calculate ω from ϖ (Longitude of Perihelion)
  const omegaMatrix = new Matrix4();
  omegaMatrix.makeRotationY(omega * Math.PI / 180);
  rotationMatrix.multiply(omegaMatrix);

  return rotationMatrix;
}

// Calculate the Position Vector based on Orbital Elements and Year Since J2000.
const calcPosition = (yearSinceJ2000, orbitalElements, spaceScale) => {
  const { a, e, i, om, varpi, ma } = orbitalElements; 
  const period = calcOrbitalPeroid(a);

  // Calculate the Anomalies (angular parameters that defines a position along an orbit)
  const M_ = updateMeanAnomaly(period, ma, yearSinceJ2000);
  const E_ = calcEccentricAnomaly(e, M_);
  const nu_ = calcTrueAnomaly(e, E_);

  // Calulate the Coordinates
  const r_ = calcRadialDistance(a, e, nu_);
  const [x_, y_, z_] = polarToCartesian3D(r_, nu_);
  const position = new Vector3(x_, y_, z_);

  // Apply Orbital Rotations and Scaling
  const rotationMatrix = getOrbitalRotationMatrix(i, om, varpi);
  position.applyMatrix4(rotationMatrix);
  position.multiplyScalar(spaceScale);

  // Test for Random Postion 
  // const randomX = Math.floor(Math.random() * 51;
  // const randomZ = Math.floor(Math.random() * 51);
  // const position = new Vector3(randomX, 0, randomZ);

  return position;
}




const calculateJulianDate = (date) => {
  return (date.getTime() / 86400000) + 2440587.5;
}

const getYearSinceJ2000 = (currentJulianDate) => {
  return (currentJulianDate - J2000) / 365.25;
}

const calculateJulianDateSinceJ2000 = (date) => {
  return ((date.getTime() / 86400000) + 2440587.5 - J2000) / 365.25;
}

export {
  updateMeanAnomaly,
  calcEccentricAnomaly,
  calcTrueAnomaly,
  calcRadialDistance,
  polarToCartesian3D,
  calcOrbitalPeroid,
  calculateJulianDate,
  getYearSinceJ2000,
  calculateJulianDateSinceJ2000,
  calcPosition,
};
