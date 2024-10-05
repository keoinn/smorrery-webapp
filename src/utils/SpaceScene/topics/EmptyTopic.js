export class EmptyTopic {
  constructor(title, contentComponent, multiSelect = false) {
    this.title = title;
    this.content = shallowRef(contentComponent);
    this.multiSelect = multiSelect;
    this.scene = null;
    this.pros = null;
  }

  tick() {}

  onEnter(scene, camera, loop) {
    this.scene = scene;
    this.camera = camera;
    this.loop = loop;
  }

  onExit() {}

  onObjectChange(newObject, oldObject) {
    newObject.forEach((object) => {
      object.isTrace = true;
    });
  }
}
