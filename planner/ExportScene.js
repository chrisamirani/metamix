import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

export const ExportScene = (scene) => {
  const exporter = new GLTFExporter();
  const link = document.createElement("a");
  link.style.display = "none";
  document.body.appendChild(link); // Firefox workaround, see #6594
  exporter.parse(
    scene,
    function (gltf) {
      if (gltf instanceof ArrayBuffer) {
        const blob = new Blob([gltf], { type: "application/octet-stream" });
        link.href = URL.createObjectURL(blob);
        link.download = "scene.glb";
        link.click();
      } else {
        const output = JSON.stringify(gltf, null, 2);
        const blob = new Blob([output], { type: "text/plain" });
        link.href = URL.createObjectURL(blob);
        link.download = "scene.gltf";
        link.click();
      }
    },
    function (error) {
      console.log("An error happened");
    },
    { trs: false, onlyVisible: true, binary: false, maxTextureSize: 4096 }
  );
};
