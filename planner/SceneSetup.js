import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const setupScene = () => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xefefef);

  const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.set(0, 1, 5);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputEncoding = THREE.sRGBEncoding;
  document.body.appendChild(renderer.domElement);

  const environment = new RoomEnvironment();
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  scene.environment = pmremGenerator.fromScene(environment).texture;

  const orbit = new OrbitControls(camera, renderer.domElement);
  orbit.maxPolarAngle = Math.PI / 2;
  const size = 100;
  const divisions = 10;

  const gridHelper = new THREE.GridHelper(size, divisions, 0x0000);
  scene.add(gridHelper);

  return { scene, renderer, camera, orbit };
};

export default setupScene;
