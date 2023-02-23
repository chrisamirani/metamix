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
  const material = new THREE.MeshStandardMaterial({
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
    console.log("Could not load GLTF");
  };

  loader.load(ItemURL, onLoad, onProgress, onError);
};

export const WallItemsLoader = (ItemURL, scene, position, rotation, scale) => {
  const onLoad = (gltf) => {
    removeShadowPlane(gltf.scene);

    const group = new THREE.Group();
    group.add(gltf.scene);
    group.name = "WallItems";
    group.position.x = position.x;
    group.position.y = position.y;
    group.position.z = position.z;

    group.rotation.y = rotation.y;

    if (scale) {
      group.scale.x += scale.x / 10;
      group.scale.y += scale.y / 10;
      group.scale.z += scale.z / 10;
    }

    // if (ItemURL.includes("win")) {
    //   const planeGeometry = new THREE.PlaneGeometry(scale.x, scale.y);

    //   // Create a blue material
    //   const material = new THREE.MeshBasicMaterial({ color: 0xadd8e6 });

    //   // Create a mesh with the plane geometry and material
    //   const plane = new THREE.Mesh(planeGeometry, material);

    //   plane.position.set(position.x + 0.02, position.y, position.z);
    //   plane.rotation.y = rotation.y;
    //   plane.scale.x += scale.x / 10;
    //   plane.scale.y += scale.y / 10;
    //   plane.scale.z += scale.z / 10;
    //   scene.add(plane);
    // }
    scene.add(group);

    //scene.add(gltf.scene);
  };

  const onProgress = (xhr) => {
    const percent = (xhr.loaded / xhr.total) * 100;
    // if (percent == 100) {
    //   loading.style.display = "none";
    // } else {
    //   loading.style.display = "flex";
    // }
  };

  const onError = (error) => {
    console.log("Could not load GLTF");
  };

  loader.load(ItemURL, onLoad, onProgress, onError);
};
export default ItemLoader;
