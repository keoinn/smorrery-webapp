export class EmptyTopic {
  constructor(title, contentComponent, multiSelect = false) {
    this.title = title;
    this.content = shallowRef(contentComponent);
    this.multiSelect = multiSelect;
    this.scene = null;
    this.pros = null;
  }

  tick() {}

  onEnter(scene) {
    this.scene = scene;
  }

  onExit() {}

  onObjectChange(newObject, oldObject) {}
}
