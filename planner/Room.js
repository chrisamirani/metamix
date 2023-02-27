import { loadDoors, loadWall, loadWindows } from "./Wall";
import * as THREE from "three";
const normalizeDimension = (x) => {
  return x / 100;
};
export const loadRoom = (plan, scene) => {
  const wallGroup = new THREE.Group();
  wallGroup.name = "WallGroup";
  const corners = plan.floorplan.corners;
  const walls = plan.floorplan.walls;

  Object.keys(corners).forEach((key) => {
    corners[key].x = normalizeDimension(corners[key].x);
    corners[key].y = normalizeDimension(corners[key].y);
  });
  walls.forEach((wall) => {
    const vector1 = {
      x: corners[wall.corner1].x,
      y: corners[wall.corner1].y,
    };
    const vector2 = {
      x: corners[wall.corner2].x,
      y: corners[wall.corner2].y,
    };
    wallGroup.add(loadWall(vector1, vector2, scene));
  });

  wallGroup.rotation.set(Math.PI / 2, 0, 0);

  const box = new THREE.Box3().setFromObject(wallGroup);
  const length = box.getSize(new THREE.Vector3()).x;
  const height = box.getSize(new THREE.Vector3()).y;
  wallGroup.position.setY(height / 2);
  wallGroup.position.setX(-length);
  wallGroup.roomLength = length;
  wallGroup.roomHeight = height;

  scene.add(wallGroup);
};

export const loadItems = (FloorPlan, scene) => {
  const roomLength = scene.getObjectByName("WallGroup").roomLength;
  const items = FloorPlan.items;
  const doors = items.filter((item) => item.item_name.includes("Door"));
  const windows = items.filter((item) => item.item_name.includes("Window"));

  loadWindows(scene, windows);
  loadDoors(scene, doors);
};
