import Kepler3rdLawPage from "@/components/topics/Kepler3rdLawPage.vue";
import { EmptyTopic } from "./EmptyTopic";
import { ref } from "vue";

export class Kepler3rdLaw extends EmptyTopic {
  constructor() {
    super("Kepler's Third Law", Kepler3rdLawPage, true);
    this.currentObjects = [];
    this.pros = ref({ objects: [] });
  }

  onObjectChange(addedObjects, removedObjects) {
    super.onObjectChange(addedObjects, removedObjects);
    this.currentObjects = [
      ...this.currentObjects,
      ...addedObjects.filter(
        (obj) =>
          !this.currentObjects.some(
            (existingObj) => existingObj.name === obj.name
          )
      ),
    ];

    this.currentObjects = this.currentObjects.filter(
      (obj) =>
        !removedObjects.some((removedObj) => removedObj.name === obj.name)
    );

    this._updatePros();
  }

  _updatePros() {
    this.pros.value = { objects: [...this.currentObjects] };
  }
}
