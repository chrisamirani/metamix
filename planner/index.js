import setupScene from "./SceneSetup";
import * as THREE from "three";
import ItemControls from "./ItemControls";
import populateCategoriesList from "./LoadCategories";
const { scene, camera, orbit, renderer } = setupScene();

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
