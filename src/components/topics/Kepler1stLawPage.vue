<template>
  <div>
    <p>
      <strong>Johannes Kepler</strong> (1571–1630), a German astronomer,
      succeeded Tycho Brahe after serving as his assistant. Brahe tasked Kepler
      with analyzing Mars' orbit, which showed significant discrepancies. Using
      Brahe’s precise data, Kepler spent eight years on calculations and, in
      1609, discovered that planets move in elliptical orbits with the Sun at
      one focus. This became known as Kepler's First Law of planetary motion.
      Though nearly circular, planetary orbits are slightly elliptical.
    </p>
    <p>
      <img
        src="http://www.faculty.umb.edu/gary_zabel/Courses/Phil%20281b/Philosophy%20of%20Magic/Arcana/Renaissance/Kepler02.gif"
        referrerpolicy="no-referrer"
        alt="Kepler Portrait"
        style="width: 50%; height: auto"
      />
    </p>
    <blockquote>
      <p>
        <strong>Hint:</strong> You can use the controls in the upper right
        corner to adjust the orbital elements of your planet, known as
        <strong>Keplerian elements</strong>. Slide the bars to see how changes
        in these parameters affect the shape and orientation of your orbit.
      </p>
    </blockquote>
    <p>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Orbit1.svg/290px-Orbit1.svg.png"
        referrerpolicy="no-referrer"
        alt="Orbital elements - Wikipedia"
        style="
          background-color: #f0f0f0;
          /* padding: 10px; */
          max-width: 100%;
          height: auto;
        "
      />
    </p>
    <ul>
      <li>
        <strong>Semi-major axis (a)</strong>: This defines the size of the
        orbit. It represents half the longest diameter of the elliptical orbit
        and indicates how far the orbiting body is from the central body on
        average.
      </li>
      <li>
        <strong>Eccentricity (e)</strong>: This measures the shape of the orbit,
        describing how &quot;stretched&quot; or elliptical it is. A value of 0
        indicates a perfect circle, while values closer to 1 indicate a more
        elongated orbit.
      </li>
      <li>
        <strong>Inclination (i)</strong>: This is the tilt of the orbit relative
        to a reference plane, such as the equatorial plane of the central body.
        It describes how &quot;tilted&quot; the orbit is compared to that plane.
      </li>
      <li>
        <strong>Longitude of the ascending node (Ω)</strong>: This defines the
        horizontal orientation of the orbit, specifically the angle between a
        reference direction (like the vernal equinox) and the point where the
        orbit crosses the reference plane from below (ascending node).
      </li>
      <li>
        <strong>Argument of periapsis (ω)</strong>: This specifies where the
        closest approach to the central body (periapsis) occurs within the
        orbit. It measures the angle between the ascending node and the point of
        periapsis.
      </li>
      <li>
        <strong>True anomaly (ν)</strong>: This defines the position of the
        orbiting body at a particular time. It is the angle between the
        periapsis and the current position of the object along its orbit.
      </li>
    </ul>
  </div>
</template>
