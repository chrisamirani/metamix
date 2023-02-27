import * as THREE from "three";
import { WallItemsLoader } from "./ItemLoader";
export const loadWall = (vector1, vector2, scene) => {
  const v1 = { ...vector1, z: 0 };
  const v2 = { ...vector2, z: 0 };
  const direction = new THREE.Vector3().subVectors(v2, v1);
  const length = direction.length(); // Length of the plane
  const angle = Math.atan2(direction.y, direction.x); // Angle of the plane

  const midpoint = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5); // Midpoint between the two vectors

  const planeGeometry = new THREE.BoxGeometry(length, 0.01, 3);
  planeGeometry.rotateZ(angle);
  planeGeometry.translate(midpoint.x, midpoint.y, midpoint.z);

  const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0xfffee9,
  }); // Change the color and side as desired
  const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
  planeMesh.name = "Wall";

  scene.add(planeMesh);
  return planeMesh;
};

export const loadDoors = (scene, doors) => {
  const roomLength = scene.getObjectByName("WallGroup").roomLength;
  doors.forEach((door) => {
    const position = {
      x: door.xpos / 100 - (roomLength ?? 0),
      y: 0,
      z: door.zpos / 100,
    };
    const rotation = { x: 0, y: door.rotation, z: 0 };
    WallItemsLoader("door.glb", scene, position, rotation, undefined);
  });
};

export const loadWindows = (scene, windows) => {
  const roomLength = scene.getObjectByName("WallGroup").roomLength;

  windows.forEach((window) => {
    const position = {
      x: window.xpos / 100 - (roomLength ?? 0),
      y: window.ypos / 100,
      z: window.zpos / 100,
    };
    const rotation = { x: 0, y: window.rotation, z: 0 };
    const scale = { x: window.scale_x, y: window.scale_y, z: window.scale_z };

    WallItemsLoader("window.glb", scene, position, rotation, scale);
  });
};
