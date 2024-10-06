import { EmptyScene } from "./EmptyScene.js";
import { CelestialBody, createBackground } from "./components/objects.js";
import { createLightSource } from "./components/light.js";
import { PLANETS_DATA, SSS_TEXTURES, SUN_DATA } from "./utils/constants.js";
import { parseSmallBodiesData } from "../APIRequests/preprocessor.js";
import { fetchSbdbApi } from "../APIRequests/apis/event.js";

async function getNeo() {
  const sbdbResponse = await fetchSbdbApi(20);
  return parseSmallBodiesData(sbdbResponse.data);
}

//TODO: add camera movement
class EducationScene extends EmptyScene {
  constructor(container) {
    super(container);

    // Stage props for the scene
    const backgroundSphere = createBackground();
    const sunLight = createLightSource("sun");
    const backgroundLight = createLightSource("ambient");

    [sunLight, backgroundLight, backgroundSphere].forEach((stageProp) => {
      this.scene.add(stageProp);
    });

    // Celestial objects
    const sun = new CelestialBody(this.scene, this.camera, SUN_DATA);
    this.scene.add(sun.container);

    this.orbitingObjects = [];
    PLANETS_DATA.forEach((data) => {
      const obj = new CelestialBody(this.scene, this.camera, data);
      this.orbitingObjects.push(obj);
    });

    // 調用 getNeo 並存儲結果
    this.neoObjects = [];
    this.initNeoObjects();

    // group by category
    this.availableCategories = {};
    this._updateCategories();

    // all 3D objects in scene
    this.objects3d = [];

    this.customTickFunctions = [];

    this.customUpdatable = {
      tick: (delta, scene) => {
        const currentDate = this.loop.currentDate;
        for (const func of this.customTickFunctions) {
          func(delta, scene, currentDate);
        }
      },
    };
    this.loop.updatables.push(this.customUpdatable);

    this.loop.played = 1; // 是否計算下一幀差異
  }

  _updateCategories() {
    this.availableCategories = {}; // 重置類別
    this.orbitingObjects.forEach((obj) => {
      if (!this.availableCategories[obj.category]) {
        this.availableCategories[obj.category] = [];
      }
      this.availableCategories[obj.category].push(obj.name);
    });

    // 添加這行
    this.onCategoriesUpdated(this.availableCategories);
  }

  onCategoriesUpdated(categories) {
    // 這個方法將在 Vue 組件中被覆蓋
  }

  async initNeoObjects() {
    try {
      const neoData = await getNeo();
      neoData.forEach((data) => {
        const obj = new CelestialBody(this.scene, data, SSS_TEXTURES);
        this.orbitingObjects.push(obj);
      });
      this._updateCategories();
    } catch (error) {
      console.error("Error fetching NEO data:", error);
    }
  }

  addCelestialBody(bodyName) {
    const body = this.orbitingObjects.find((obj) => obj.name === bodyName);
    if (body) {
      body.trace = [];
      this.scene.add(body.container);
      this.loop.updatables.push(body.container);
      this.objects3d.push(body.container);
      body.container.name = bodyName;
    }
  }

  removeCelestialBody(bodyName) {
    const body = this.orbitingObjects.find((obj) => obj.name === bodyName);
    if (body) {
      const body3d = this.objects3d.find((obj) => obj.name === bodyName);
      this.scene.remove(body3d);
      this.objects3d = this.objects3d.filter((obj) => obj !== body3d);
      this.loop.updatables = this.loop.updatables.filter(
        (obj) => obj !== body3d
      );
      this.scene.remove(body.traceLine);
    }
  }

  removeAllCelestialBodies() {
    this.orbitingObjects.forEach((obj) => this.removeCelestialBody(obj.name));
  }

  addCustomTickFunction(func) {
    this.customTickFunctions.push(func);
  }

  removeCustomTickFunction(func) {
    const index = this.customTickFunctions.indexOf(func);
    if (index !== -1) {
      this.customTickFunctions.splice(index, 1);
    }
  }

  clearCustomTickFunctions() {
    this.customTickFunctions = [];
  }
}

export { EducationScene };
