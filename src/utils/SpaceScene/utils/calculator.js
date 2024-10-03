import {J2000} from '@/utils/SpaceScene/utils/smorrery_const.js'

const updateMeanAnomaly = (T, M, time) => {
  // Mean motion (rad per unit time)
  const n = (2 * Math.PI) / T;

  // New Mean anomaly
  const newM = M + n * time;

  // Ensure it stays within 0 to 2π
  return newM % (2 * Math.PI);
};

const solveKeplerEquation = (e, M) => {
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

const getTrueAnomaly = (e, E) => {
  return (
    2 *
    Math.atan2(
      Math.sqrt(1 + e) * Math.sin(E / 2),
      Math.sqrt(1 - e) * Math.cos(E / 2)
    )
  );
};

const getRadualDistance = (spaceScale, a, e, nu) => {
  return spaceScale * a * (1 - e ** 2) / (1 + e * Math.cos(nu));
};

// Calculate coordinates in the orbital plane
const getCoordinateOrbitalPlane = (r, nu) => {
  const x = r * Math.cos(nu);
  const y = 0;
  const z = -r * Math.sin(nu);
  return [x, y, z];
};

const getOrbitalPeroid = (a) => {
  return Math.sqrt(a ** 3);
};

const updateOrbitaPostion = (T, ma, e, a, spaceScale, yearSinceJ2000) => {
  const M_ = updateMeanAnomaly(T, ma, yearSinceJ2000)
  const E_ = solveKeplerEquation(e, M_)
  const nu_ = getTrueAnomaly(e, E_)
  const r_ = getRadualDistance(spaceScale, a, e, nu_)
  // TODO: Create a position vector and rotate it

  return getCoordinateOrbitalPlane(r_, nu_)
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
  solveKeplerEquation,
  getTrueAnomaly,
  getRadualDistance,
  getCoordinateOrbitalPlane,
  getOrbitalPeroid,
  calculateJulianDate,
  getYearSinceJ2000,
  calculateJulianDateSinceJ2000,
  updateOrbitaPostion,
};
