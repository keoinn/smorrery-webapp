export class EmptyTopic {
  constructor(title, contentComponent, multiSelect = false) {
    this.title = title;
    this.content = shallowRef(contentComponent);
    this.multiSelect = multiSelect;
    this.scene = null;
    this.pros = null;
  }

  tick() {}

  onEnter(scene, camera) {
    this.scene = scene;
    this.camera = camera;
  }

  onExit() {}

  onObjectChange(newObject, oldObject) {}
}
