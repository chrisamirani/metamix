export const showItemBoundingBox = (mouse, camera, raycaster, scene) => {
  raycaster.setFromCamera(mouse, camera);

  var intersects = raycaster.intersectObjects(scene.children);

  const BoundingBox = intersects.find((i) => i.object.name == "BoundingBox");

  if (BoundingBox) {
    BoundingBox.object.material.opacity = 0.2;
  } else {
    const boxes = scene.getObjectsByProperty("name", "BoundingBox");

    if (boxes.length > 0) {
      boxes.forEach((box) => {
        box.material.opacity = 0;
      });
    }
  }
};
