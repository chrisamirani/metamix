import setupScene from "./SceneSetup";
import * as THREE from "three";
import ItemControls from "./ItemControls";
import populateCategoriesList from "./LoadCategories";
import { loadRoom, loadItems } from "./Room";
import { USDZExporter } from "three/examples/jsm/exporters/USDZExporter.js";
const controlPanelBtn = document.querySelector(".panel-open-btn");
const scene3DBtn = document.querySelector("#main-view");
const sceneFloorBtn = document.querySelector("#planner-view");
const itemsPanel = document.querySelector(".items-panel");
const rendererContainer = document.querySelector("#renderer");
const translateBtn = document.querySelector("#translate-btn");
const rotateBtn = document.querySelector("#rotate-btn");

const showARBtn = document.querySelector("#arBtn");

const {
  scenes: { Scene3D, SceneFloor },
  camera: { camera2D, camera3D },
  orbit: { orbit2D, orbit3D },
  renderer: { renderer2D, renderer3D },
} = setupScene();

controlPanelBtn.addEventListener("click", onControlPanelDisplayClick);

let scene = Scene3D;
let camera = camera3D;
let orbit = orbit3D;
let renderer = renderer3D;
rendererContainer.appendChild(renderer.domElement);
scene3DBtn.addEventListener("click", () => {
  scene = Scene3D;
  camera = camera3D;
  orbit = orbit3D;
  renderer = renderer3D;
  scene3DBtn.classList.add("control-btn-active");
  sceneFloorBtn.classList.remove("control-btn-active");
  itemsPanel.style.display = "block";
  rendererContainer.innerHTML = "";
  rendererContainer.appendChild(renderer.domElement);
});
sceneFloorBtn.addEventListener("click", () => {
  scene = SceneFloor;
  camera = camera2D;
  orbit = orbit2D;

  renderer = renderer2D;

  scene3DBtn.classList.remove("control-btn-active");
  sceneFloorBtn.classList.add("control-btn-active");

  itemsPanel.style.display = "none";
  rendererContainer.innerHTML = "";
  rendererContainer.appendChild(renderer.domElement);
});
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
populateCategoriesList();
const controls = ItemControls();

function mouseMove(event) {
  event.preventDefault();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  showItemBoundingBox(mouse, camera, raycaster, scene);
}

function onClick(event) {
  event.preventDefault();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  var intersects = raycaster.intersectObjects(scene.children);
  const BoundingBox = intersects.find((i) => i.object.name == "BoundingBox");

  if (BoundingBox) {
    controls.attach(BoundingBox.object.parent);
    scene.add(controls);
  }
}

function animate() {
  requestAnimationFrame(animate);
  orbit.update();
  renderer.render(scene, camera);
}

animate();
function render() {
  renderer.render(scene, camera);
}

const getPoint = (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
};

import FloorPlan from "./floor.json";
import { onControlPanelDisplayClick } from "./ControlPlanel";
import { showItemBoundingBox } from "./MouseMoveEvents";
import { setControlMode } from "./MouseClickEvents";
loadRoom(FloorPlan, scene);
loadItems(FloorPlan, scene);

renderer3D.domElement.addEventListener("mousemove", mouseMove, false);
renderer3D.domElement.addEventListener("click", onClick, false);
renderer2D.domElement.addEventListener("click", getPoint, false);

translateBtn.addEventListener("click", () =>
  setControlMode(translateBtn, rotateBtn, controls, "translate")
);
rotateBtn.addEventListener("click", () =>
  setControlMode(translateBtn, rotateBtn, controls, "rotate")
);
function hideClosestObject(camera) {
  let closestObject = null;

  const objects = scene.getObjectsByProperty("name", "Wall");
  raycaster.setFromCamera({ x: 0, y: 0, z: 0 }, camera);

  var intersects = raycaster.intersectObjects(objects);
  closestObject = intersects[0];

  objects.forEach((object) => {
    if (object === closestObject?.object) {
      object.visible = false;

      touchingWallItem(object, false);
    } else {
      object.visible = true;
      touchingWallItem(object, true);
    }
  });
}

const touchingWallItem = (object, isVisible) => {
  const myObject3D = object;
  const otherObjects = scene.getObjectsByProperty("name", "WallItems");

  const myBoundingBox = new THREE.Box3().setFromObject(myObject3D);
  otherObjects.forEach((object) => {
    const objectBoundingBox = new THREE.Box3().setFromObject(object);

    if (myBoundingBox.intersectsBox(objectBoundingBox)) {
      object.visible = isVisible;
    }
  });
};
orbit3D.addEventListener("change", () => {
  hideClosestObject(camera3D);
});

setTimeout(() => {
  const exporter = new USDZExporter();
  exporter
    .parse(scene)
    .then((arraybuffer) => {
      console.log({ arraybuffer });
      const blob = new Blob([arraybuffer], { type: "model/vnd.usdz+zip" });

      showARBtn.href = URL.createObjectURL(blob);
    })
    .catch((error) => console.log({ error }));
}, 2000);

export { camera, render, renderer, orbit, scene, controls };
