import {
    AmbientLight,
    DirectionalLight,
    HemisphereLight,
    PointLight,
  } from 'three';
  
  function createLights() {
    // 背景光源
    const ambientLight = new AmbientLight(0x404040, 0.5);
  
    // 固定光源
    const sunLight = new PointLight('white', 500, 500);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;

    return { ambientLight, sunLight };
  }
  
  export { createLights };