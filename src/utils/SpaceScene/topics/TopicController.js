export class TopicController {
  constructor(topics) {
    this.topics = topics;
    this.currentTopic = null;
    this.onTopicChange = null; // 新增回調函數
  }

  setTopic(topic, education_scene) {
    if (this.currentTopic !== topic) {
      if (this.currentTopic) {
        this.currentTopic.onExit();
      }
      this.currentTopic = topic;
      this.currentTopic.onEnter(
        education_scene.scene,
        education_scene.camera,
        education_scene.loop
      );

      // 調用回調函數
      if (this.onTopicChange) {
        this.onTopicChange(topic);
      }
    }
  }

  getCurrentTopic() {
    return this.currentTopic;
  }

  setScene(scene) {
    this.currentTopic.scene = scene;
  }
}
