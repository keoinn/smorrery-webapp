import {
  BackSide,
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  Euler,
  Group,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  MeshStandardMaterial,
  Object3D,
  RingBufferGeometry,
  RingGeometry,
  SphereGeometry,
  TextureLoader,
  TorusGeometry,
  Vector3
} from "three";

import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

import {
  SSS_TEXTURES,
  RADIUS_SCALE,
  SPACE_SCALE,
  MAX_TRACE_STEPS,
} from "@/utils/SpaceScene/utils/constants.js";

import { calcOrbitalPeroid, calcPosition, getOrbitalRotationMatrix } from "@/utils/SpaceScene/utils/calculator.js";
import { EllipseCurve } from "three";

const SCENE_SIZE = 1200;

// ----------------------------------------------------------------

function selectMaterial(texturesPath, category, altColor = 0xffffff) { 
  const texture = texturesPath ? new TextureLoader().load(texturesPath) : null;
  let material;

  if (category === 'planet' ) { // No texture for small bodies
    material = new MeshStandardMaterial({
      map: texture,
      roughness: 0.9,
    });
  } else if (category === 'sun') { // Self-illumination for stars (e.g., Sun)
    material = new MeshStandardMaterial({
      map: texture,              
      roughness: 0,
      metalness: 0,
      emissive: 0xffff00,     // Strong Self-illumination
      emissiveIntensity: 1.0,     
      emissiveMap: texture        
    });
  } else if (category === 'background') { // Self-illumination for backgrounds
    material = new MeshStandardMaterial({
      map: texture,    
      roughness: 0,
      metalness: 0,
      side: BackSide,
      emissive: 0x404040,     // Weak Self-illumination
      emissiveIntensity: 5.0,     
      emissiveMap: texture        
    }); 
  } else {
    material = new MeshStandardMaterial({
      color: altColor,
      roughness: 0.5,
      metalness: 0,
      emissive: 0x000000 
    });
  }

  // Create and return the material with the final options
  return material;
}

/**
 * Create a spherical background with a texture. 
 * The radius (`backgroundRadius`) and texture path (`backgroundTexturePath`) are specified as global constants.
 * This function applies galactic-to-ecliptic rotation sto the background sphere.
 * 
 * @see https://threejs.org/docs/#api/en/geometries/SphereGeometry
 */
function createBackground() {
  const geometry = new SphereGeometry(SCENE_SIZE, 60, 40);
  const material = selectMaterial(SSS_TEXTURES["MILKY_WAY"], "background");
  const backgroundSphere = new Mesh(geometry, material);
  
  // Apply Galactic-to-Ecliptic Rotations
  const eulerAngles = new Euler(62.87 / 180 * Math.PI, 0, -282.86 / 180 * Math.PI);
  backgroundSphere.quaternion.setFromEuler(eulerAngles);

  return backgroundSphere;
}

function getTexturePath( texturePack, name) {
  return (!texturePack || !name) ?  null : texturePack[name.toUpperCase()]
}

/**
 * Class representing a celestial body in the 3D scene.
 * The `CelestialBody` class initializes various properties of the celestial body, 
 * such as its name, radius, orbital elements, and more. It also creates the 3D mesh 
 * representing the celestial body and calculates its orbit based on the provided data.
 */
class CelestialBody {
  /**
   * Create a celestial body.
   * The constructor initializes the body’s properties and adds it to the scene. 
   * It also handles the creation of orbital elements and visuals for artificial objects and planets.
   * 
   * @param {Object} data - The data object containing properties like name, radius, and orbital elements.
   * @param {Object} [texturePack=SSS_TEXTURES] - Optional texture paths for mapping textures to the celestial body.
   */
  constructor(scene, camera, data, labelRenderer, texturePack = SSS_TEXTURES) {
    this.scene = scene;
    this.camera = camera;
    this.labelRenderer = labelRenderer;

    this.name = data.name || 'Unnamed';  // The name of the celestial body, default is 'Unnamed'
    this.radius = data.radius || 1;  // The radius of the celestial body, default is 1
    this.orbitalParameters = data.orbitalParameters || {};  // Orbital elements such as semi-major axis and eccentricity
    this.category = data.category || 'NEO';  // Category of the body (e.g., planet, NEO)
    this.opacity = data.opacity || 1;  // Opacity of the orbit of celestial body, default is 1
    this.color = data.color || 0x404040;  // Color of the orbit and the mesh of celestial body

    this.texturePath = getTexturePath(texturePack, this.name.toUpperCase())

    // Container to store the celestial body and related elements.
    this.container = new Object3D(); 

    // Create the mesh and label for the celestial body and add them to the container.
    const mesh = this.createMesh();
    this.createLabel(mesh);

    // If the object is Saturn, add rings.
    if (this.name.toUpperCase() === 'SATURN') {
      this.createRing(1.24, 2.27, getTexturePath(texturePack, 'SATURN_RING'));
    }

    // If the object is not the Sun, add some objects related to the orbit.
    if (this.name.toUpperCase() != 'SUN') {
      this.isTraced = false;
      this.trace = [];
      this.traceLine = this.createTraceLine();
      this.period = calcOrbitalPeroid(this.orbitalParameters.a);

      const initPosition = calcPosition(0, this.orbitalParameters, this.period, SPACE_SCALE); // Container for the body and related elements
      this.container.position.copy(initPosition);

      // Update the container's position for the next frame
      this.container.tick = (delta) => {
        const newPosition = calcPosition(delta, this.orbitalParameters, this.period, SPACE_SCALE);
        this.container.position.copy(newPosition);

        // Update the label's font size and opacity
        this.updateLabelStyles();
    
        // Add a new position to the trace if the object has tracing enabled
        if ( this.isTraced ) {
          this.trace.push(newPosition); // Add the current position to the trace
          if ( this.trace.length >= MAX_TRACE_STEPS ){
            this.trace.shift(); // Remove the oldest position to keep trace size fixed
          }
        }
        
        // Update the visual representation of the trace
        this.scene.remove(this.traceLine);
        if(this.trace.length > 0) {
          this.traceLine = this.createTraceLine(); // Create a new trace line based on updated positions
          this.scene.add(this.traceLine);  // Add the new trace line to the scene
        }
      }
    } 

    // Special handling for Mercury in the education module to represent orbital period (Kepler's 2nd Law)
    if (this.name === 'Mercury') {
        this.sweptAreaGroup = new Group();  // Group for swept areas
        this.sweptAreaGroup.visible = false;
    }
  }

  /**
   * Create the 3D mesh of the celestial object and add it to the container.
   * This method generates the geometry and material for the celestial body,
   * applies textures if available, and configures its position and shadow properties.
   * 
   * - For small bodies or objects without textures, a basic color is used.
   * - Random positioning is applied if specified and the object is not the Sun.
   * - The mesh is cast to cast and receive shadows.
   * 
   * @param {boolean} randomPosition - If true, applies a random position to the object (except for the Sun).
   * @returns {THREE.Mesh} The created mesh for the celestial body.
   * 
   * @see https://threejs.org/docs/#api/en/geometries/SphereGeometry
   * @see https://threejs.org/docs/#api/en/materials/MeshStandardMaterial
   */
  createMesh(randomPosition = false) {
    const geometry = new SphereGeometry(this.radius * RADIUS_SCALE, 32, 32);
    const material = selectMaterial(this.texturePath, this.category, this.color);
  
    // Create the mesh and configure shadows
    const mesh = new Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
  
    // Set random position if needed
    if (randomPosition && this.name.toUpperCase() !== 'SUN') {
      const randomX = Math.floor(Math.random() * 51) - 25;
      const randomZ = Math.floor(Math.random() * 51) - 25;
      mesh.position.set(randomX, 0, randomZ);
    }
  
    // Add the mesh to the container
    this.container.add(mesh);
  
    // Return the mesh for further use
    return mesh;
  }
  
  /**
   * Create a 2D label for the celestial object and attach it to the mesh.
   * This method generates a label using v-card for displaying the name of the object.
   * The label is positioned above the celestial body and updated dynamically.
   * 
   * - The label is rendered as a CSS2DObject and is linked to the mesh.
   * - The label is styled using Vuetify's v-card component.
   * 
   * @param {THREE.Mesh} mesh - The mesh to which the label will be attached.
   * 
   * @see https://threejs.org/docs/#examples/en/renderers/CSS2DObject
   */
  createLabel(mesh) {
    // Create the label using v-card
    const labelDiv = document.createElement('div');
    labelDiv.className = 'label';
    labelDiv.innerHTML = `
      <v-card class="pa-2" outlined>
        <v-card-text>${this.name}</v-card-text>
      </v-card>
    `;
  
    // Create CSS2DObject for the label
    const label = new CSS2DObject(labelDiv);
    label.position.set(
      0, 
      (this.radius * RADIUS_SCALE) + 0.5, 
      0
    );
    label.visible = false;  // Hide the label initially
  
    // Attach the label to the mesh
    mesh.add(label);
    this.container.add(label);
  
    // Save references for dynamic updates
    this.labelDiv = labelDiv;
    this.label = label;
  }
  
  /**
     * Update the label's style based on the distance between the celestial body and the camera.
     * The **font size** and **opacity** will be adjusted dynamically based on this distance.
     * 
     * The closer the celestial body is to the camera, the larger and less transparent the label becomes.
     * The farther away the body is, the smaller and more transparent the label will be.
     */
  updateLabelStyles() {
    const distance = this.camera.position.distanceTo(this.container.position);
    const fontSize = Math.max(10, SCENE_SIZE / distance * 0.5);  // closer = larger font
    const opacity = Math.min(1, Math.max(0.1, SCENE_SIZE / distance));  // farther = more transparent

    // Apply the updated styles to the label
    this.labelDiv.style.fontSize = `${fontSize}px`;
    this.labelDiv.style.opacity = `${opacity}`;
  }

  createTraceLine() {
      const traceGeometry = new BufferGeometry().setFromPoints(this.trace);
      const traceMaterial = new LineBasicMaterial({
          color: this.color,
          transparent: true,
          opacity: this.opacity 
      });
      return new Line(traceGeometry, traceMaterial);
  }
  
  /**
   * Create a ring around the celestial object and add it to the scene.
   * This function generates a ring with specified inner and outer radii, applies a texture, and adds it
   * to the object (e.g., for Saturn, Jupiter, Uranus, or Neptune).
   * 
   * The ring's texture is loaded and applied to give it the realistic appearance of planetary rings.
   * 
   * @param {number} inner - The inner radius of the ring relative to the object's radius.
   * @param {number} outer - The outer radius of the ring relative to the object's radius.
   * @param {string} ringTexturePath - Path to the texture for the ring.
   * @see https://threejs.org/docs/#api/en/geometries/RingBufferGeometry
   */
  createRing(inner, outer, ringTexturePath) {
      const innerRadius = this.radius * inner * RADIUS_SCALE;
      const outerRadius = this.radius * outer * RADIUS_SCALE;

      const ringGeometry = new RingBufferGeometry(innerRadius, outerRadius, 64);
      const pos = ringGeometry.attributes.position;
      const v3 = new Vector3();
      for (let i = 0; i < pos.count; i++){
          v3.fromBufferAttribute(pos, i);
          ringGeometry.attributes.uv.setXY(i, v3.length() < (innerRadius + outerRadius) / 2 ? 0 : 1, 1);
      }

      const ringMaterial = new MeshBasicMaterial({
          map: new TextureLoader().load(ringTexturePath),
          side: DoubleSide,
          transparent: true,
          opacity: 0.95
      });

      const ring = new Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;  // Rotate the ring to lie flat
      ring.castShadow = true;
      ring.receiveShadow = true;

      this.container.add(ring);
      // console.log('Ring created');
  }

  /**
   * Create an orbit based on the object's orbital elements.
   * This function generates points along the orbit path (elliptical, parabolic, or hyperbolic)
   * and returns a 3D line representing the orbit.
   * 
   * @param {number} numPoints - The number of points to generate along the orbit.
   * @param {boolean} visible - Whether the orbit line is initially visible.
   * @returns {Object3D} — A container holding the orbit line.
   * @see https://en.wikipedia.org/wiki/Conic_section#Conic_parameters
   */
  createOrbit(numPoints = 100, visible = false) {
      const { a, e, i, om, w } = this.orbitalParameters;
      const aScaled = a * SPACE_SCALE;
      
      let points = [];
      if (e >= 0 && e < 1) {
          // Circular or elliptical orbit
          this.orbitShape = (e === 0) ? 'circular' : 'elliptical';
          const b = aScaled * Math.sqrt(1 - e ** 2);  // Semi-minor axis (b)
          const ellipseCurve = new EllipseCurve(
              aScaled * e, 0, // Center offset for elliptical orbit
              aScaled, b,
              0, 2 * Math.PI,
              false,
              0
          );
          points = ellipseCurve.getPoints(numPoints);
      } else if (e === 1) { // Parabolic orbit
          this.orbitShape = 'parabolic';
          const p = aScaled * (1 + e);  // latus rectum
          for (let theta = -Math.PI / 2; theta <= Math.PI / 2; theta += Math.PI / numPoints) {
              const r = p / (1 + Math.cos(theta));
              points.push(new Vector3(-r * Math.cos(theta), 0, r * Math.sin(theta)));
          }
      } else if (e > 1) { // Hypebolic orbit
          this.orbitShape = 'hyperbolic';
          const b = aScaled * Math.sqrt(e ** 2 - 1);
          for (let theta = -Math.PI / 4; theta <= Math.PI / 4; theta += Math.PI / (2 * numPoints)) {
              const r = aScaled * (e ** 2 - 1) / (1 + e * Math.cos(theta));
              points.push(new Vector3(-r * Math.cos(theta), 0, r * Math.sin(theta)));
          }
      } else {
          alert('Invalid eccentricity!');
          this.orbitShape = null;
          return;
      }
  
      // Convert points to 3D space and apply transformations
      const transformedPoints = points.map(p => new Vector3(-p.x, 0, p.y));
  
      // Create a 3D line representing the orbit
      const geometry = new BufferGeometry().setFromPoints(transformedPoints);
      const material = new LineBasicMaterial({
          color: this.color,
          transparent: true,
          opacity: this.opacity,
      });
      const orbitLine = new Line(geometry, material);
  
      // Place the orbit line into a container
      const orbitContainer = new Object3D();
      orbitContainer.add(orbitLine);
  
      // Apply orbital rotations to align the orbit in 3D space
      const rotationMatrix = getOrbitalRotationMatrix(i, om, w);
      orbitContainer.applyMatrix4(rotationMatrix);
  
      orbitContainer.visible = visible;
      // this.scene.add(orbitContainer);

      return orbitContainer;
  }

  /**
   * Create an orbital plane for the celestial object.
   * This function creates a semi-transparent plane that represents the orbital plane of the object
   * in 3D space, based on the provided normal vector.
   * 
   * @param {Vector3} normalVector - The normal vector to define the plane's orientation.
   * @param {boolean} [visible=false] - Whether the orbital plane should be initially visible.
   * @returns {Mesh} - The created orbital plane mesh added to the scene.
   */
  addOrbitalPlane(normalVector, visible = false) {
      const planeSize = this.orbitalParameters.Q * 2.5 * spaceScale;  // Determine the size of the plane
      const plane = createPlane({
          normalVector: normalVector,  // Orientation of the plane
          width: planeSize,
          height: planeSize,
          color: this.color,  // Color of the plane
          opacity: 0.1,       // Make the plane semi-transparent
          transparent: true,
          visible: visible
      });

      // this.scene.add(plane);  // Add the plane to the scene

      return plane;
  }

  /**
   * Create auxilary orbital vectors for the celestial object.
   * This function creates three vectors representing the specific angular momentum (h_vec),
   * eccentricity vector (e_vec), and the node vector (n_vec) for the object's orbit, with distinct colors.
   * 
   * @param {boolean} [visible=false] - Whether the orbital vectors should be initially visible.
   * @returns {ArrowHelper[]} - An array of arrow helpers representing the orbital vectors added to the scene.
   * @see https://en.wikipedia.org/wiki/Orbit_determination#Orbit_determination_from_a_state_vector
   */
  addOrbitalVectors(visible = false) {
    const orbitalVectors = [];
    const { h_vec, e_vec, n_vec } = this.orbitalParameters;  // Destructure the vectors from orbital elements
    const vectorColors = [0xffff00, 0xee0000, 0x0000ff];  // Assign colors: yellow, red, blue

    // Create an arrow for each vector and add it to the scene
    [h_vec, e_vec, n_vec].forEach((vec, i) => {
      const orbitalVector = createArrow({
        dir: vec,  // Direction of the vector
        length: 1 * spaceScale,  // Scaled length of the vector
        color: vectorColors[i],  // Color of the vector
        visible: true
      });
      // this.scene.add(orbitalVector);  // Add the vector to the scene
      orbitalVectors.push(orbitalVector);  // Store the vector in the array
    });

    return orbitalVectors;  // Return the array of vectors
  }

  createOrbitByCategory() {
    const { a, e } = this.orbitalParameters;
    // Validate semi-major axis (a) and eccentricity (e) before computing further elements
    if (a && e && !isNaN(a) && !isNaN(e)) {
        this.period = Math.sqrt(a ** 3);  // Compute orbital period using Kepler's 3rd Law
        this.orbitalParameters.q = a * (1 - e);  // Perihelion distance (closest approach to the Sun)
        this.orbitalParameters.Q = a * (1 + e);  // Apohelion distance (farthest point from the Sun)
    } else {
        console.error(`Invalid orbital elements for ${this.name}: a = ${a} or e = ${e} is not a valid number`);
    }

    // If the object is an artificial satellite or asteroid, generate orbit and orbital plane
    if (this.category === 'artificial') {
        this.orbit = this.createOrbit(300, true);  // Create orbit with 300 points and visibility set to true
        this.orbitalPlane = this.addOrbitalPlane(this.orbitalParameters.h_vec, true);  // Create orbital plane
        this.orbitalVectors = this.addOrbitalVectors(true);  // Create orbital vectors
    } 
    // Otherwise, just create the orbit (default behavior for planets, moons, etc.)
    else { 
        this.orbit = this.createOrbit(100, true);
    }
  }
}

export { createBackground, CelestialBody };
