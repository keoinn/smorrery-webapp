import {
    AmbientLight,
    DirectionalLight,
    HemisphereLight,
    PointLight,
} from 'three';

// Default options for light sources
const sunLightColor = 0xffffff;
const sunLightIntensity = 1;
const sunLightRange = 1000;
const ambientLightColor = 0x404040; 
const ambientLightIntensity = 1;

/**
 * Create a light source based on the specified type.
 * This facotry function return either a `THREE.PointLight` (e.g., for the Sun) 
 * or a `THREE.AmbientLight` instance (e.g., for starry background).
 * 
 * @param {string} [type='ambient'] - The type of light ('sun' for point light, 'ambient' for ambient light).
 * @param {Object} [options={}] - Options for customizing the light, such as intensity and range.
 * @see https://threejs.org/docs/#api/en/lights/PointLight
 * @see https://threejs.org/docs/#api/en/lights/AmbientLight
 */
function createLightSource(type, options = {}) {
  let light; // 'Let there be light!' -- Genesis 1:3 

  if (type === 'sun') {
    light = new PointLight(
      options.color || sunLightColor, 
      options.intensity || sunLightIntensity, 
      options.range || sunLightRange
    );
  } else if (type === 'ambient') {
      light = new AmbientLight(
          options.color || ambientLightColor, 
          options.intensity || ambientLightIntensity
      );
  }

  return light; 
}

export { createLightSource };