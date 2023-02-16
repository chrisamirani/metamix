import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import { render, renderer, camera, orbit } from "./index";

const ItemControls = () => {
  const controls = new TransformControls(camera, renderer.domElement);
  controls.addEventListener("change", render);

  controls.addEventListener("dragging-changed", function (event) {
    orbit.enabled = !event.value;
  });

  return controls;
};

export default ItemControls;
