import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
const loading = document.querySelector(".loading");
const loader = new GLTFLoader();

const removeShadowPlane = (scene) => {
  const shadowPlaneIndex = scene.children[0].children.findIndex((i) =>
    i.name.includes("shadow")
  );

  scene.children[0].children.splice(shadowPlaneIndex, 1);
};

const createBoundingBox = (scene) => {
  const boundingBox = new THREE.Box3();
  boundingBox.setFromObject(scene, true);
  const { x, y, z } = boundingBox.getSize(new THREE.Vector3());
  const geometry = new THREE.BoxGeometry(x, y, z);
  const material = new THREE.MeshBasicMaterial({
    color: 0x28fa16,
    transparent: true,
    opacity: 0.0,
  });
  const cube = new THREE.Mesh(geometry, material);
  cube.name = "BoundingBox";
  cube.position.setY(cube.scale.y / 2);
  return cube;
};

const ItemLoader = (ItemURL, scene, controls, details) => {
  const onLoad = (gltf) => {
    removeShadowPlane(gltf.scene);
    const boundingBox = createBoundingBox(gltf.scene);

    const group = new THREE.Group();
    group.add(boundingBox);
    group.add(gltf.scene);
    group.name = "Group";

    scene.add(group);
  };

  const onProgress = (xhr) => {
    const percent = (xhr.loaded / xhr.total) * 100;
    if (percent == 100) {
      loading.style.display = "none";
    } else {
      loading.style.display = "flex";
    }
  };

  const onError = (error) => {
    console.log("An error happened");
  };

  loader.load(ItemURL, onLoad, onProgress, onError);
};

export default ItemLoader;
