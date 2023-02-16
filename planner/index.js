import setupScene from "./SceneSetup";
import * as THREE from "three";
import ItemControls from "./ItemControls";
import populateCategoriesList from "./LoadCategories";
const controlPanel = document.querySelector(".control-panel");
const controlPanelBtn = document.querySelector(".panel-open-btn");
const scene3DBtn = document.querySelector("#main-view");
const sceneFloorBtn = document.querySelector("#planner-view");
const itemsPanel = document.querySelector(".items-panel");

controlPanelBtn.addEventListener("click", (event) => {
  const isOpen = event.target.innerText.includes("Hide");

  if (isOpen) {
    controlPanel.style.display = "none";
    event.target.innerText = "Open Controls";
  } else {
    controlPanel.style.display = "block";
    event.target.innerText = "Hide Controls";
  }
});

const {
  scenes: { Scene3D, SceneFloor },
  camera: { camera2D, camera3D },
  orbit: { orbit2D, orbit3D },
  renderer,
} = setupScene();

let scene = Scene3D;
let camera = camera3D;
let orbit = orbit3D;
scene3DBtn.addEventListener("click", (event) => {
  scene = Scene3D;
  camera = camera3D;
  orbit = orbit3D;
  scene3DBtn.classList.add("control-btn-active");
  sceneFloorBtn.classList.remove("control-btn-active");
  itemsPanel.style.display = "block";
});
sceneFloorBtn.addEventListener("click", (event) => {
  scene = SceneFloor;
  camera = camera2D;
  orbit = orbit2D;
  scene3DBtn.classList.remove("control-btn-active");
  sceneFloorBtn.classList.add("control-btn-active");

  itemsPanel.style.display = "none";
});
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
populateCategoriesList();
const controls = ItemControls();

function onHover(event) {
  event.preventDefault();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  var intersects = raycaster.intersectObjects(scene.children);
  const BoundingBox = intersects.find((i) => i.object.name == "BoundingBox");

  if (BoundingBox) {
    BoundingBox.object.material.opacity = 0.2;
  } else {
    scene.children.forEach((child) => {
      if (child.name == "Group") {
        child.children.forEach((groupChild) => {
          if (groupChild.name == "BoundingBox") {
            groupChild.material.opacity = 0;
          }
        });
      }
    });
  }
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

renderer.domElement.addEventListener("mousemove", onHover, false);
renderer.domElement.addEventListener("click", onClick, false);

export { camera, render, renderer, orbit, scene, controls };
