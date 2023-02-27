import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { allRooms, currentRoom } from ".";
const loading = document.querySelector(".loading");
const loader = new GLTFLoader();

const removeShadowPlane = (scene) => {
  const shadowPlaneIndex = scene.children[0].children.findIndex((i) =>
    i.name.includes("shadow")
  );

  scene.children[0].children.splice(shadowPlaneIndex, 1);
};

const createBoundingBox = (scene, needsOffset = true) => {
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
  if (needsOffset) {
    cube.position.setY(cube.scale.y / 2);
  }
  return cube;
};

const ItemLoader = (ItemURL, scene) => {
  const onLoad = (gltf) => {
    removeShadowPlane(gltf.scene);
    const boundingBox = createBoundingBox(gltf.scene);

    const group = new THREE.Group();
    group.add(boundingBox);
    group.add(gltf.scene);
    group.name = "Group";

    scene.add(group);
    console.log({ allRooms, currentRoom });
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

    if (ItemURL.includes("win")) {
      const planeGeometry = new THREE.PlaneGeometry(scale.x, scale.y);
      const material = new THREE.MeshBasicMaterial({ color: 0xadd8e6 });
      const plane = new THREE.Mesh(planeGeometry, material);
      const boundingBox = createBoundingBox(plane, false);
      const glassGroup = new THREE.Group();
      glassGroup.add(boundingBox);

      glassGroup.add(plane);

      glassGroup.position.set(position.x, position.y, position.z);
      glassGroup.rotation.y = rotation.y;
      glassGroup.scale.x += scale.x;
      glassGroup.scale.y += scale.y / 10;
      glassGroup.scale.z += scale.z / 10;
      scene.add(glassGroup);
    }
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

export const floorPlaneLoader = (scene, transformControls) => {
  const texture = new THREE.TextureLoader().load("img/floor.png");
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    map: texture,
  });
  const floorPlane = new THREE.Mesh(geometry, material);

  const boundingBox = createBoundingBox(floorPlane, false);

  const group = new THREE.Group();
  group.add(boundingBox);
  group.add(floorPlane);
  group.rotateX(Math.PI / 2);
  group.rotateZ(Math.PI / 2);
  group.name = "Group";

  scene.add(group);
};
export default ItemLoader;
