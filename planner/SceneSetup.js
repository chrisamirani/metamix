import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const loadFloor = (plan, scene) => {
  const path = new THREE.Path();

  path.setFromPoints([
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 1, y: 0 },
  ]);

  const points = path.getPoints();

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0xffffff });

  const line = new THREE.Line(geometry, material);
  scene.add(line);
};
const setupScene = () => {
  const Scene3D = new THREE.Scene();
  Scene3D.background = new THREE.Color(0xefefef);
  const SceneFloor = new THREE.Scene();
  SceneFloor.background = new THREE.Color(0xefefef);

  const camera3D = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera3D.position.set(0, 1, 5);

  const camera2D = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera2D.position.set(0, 10, 0);
  camera2D.lookAt({ x: 0, y: 0, z: 0 });

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputEncoding = THREE.sRGBEncoding;
  document.body.appendChild(renderer.domElement);

  const environment = new RoomEnvironment();
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  Scene3D.environment = pmremGenerator.fromScene(environment).texture;

  const orbit3D = new OrbitControls(camera3D, renderer.domElement);
  orbit3D.maxPolarAngle = Math.PI / 2;

  const orbit2D = new OrbitControls(camera2D, renderer.domElement);
  orbit2D.enableRotate = false;

  const size = 100;
  const divisions = 10;

  const gridHelper = new THREE.GridHelper(size, divisions, 0x0000);
  SceneFloor.add(gridHelper);

  window.addEventListener("resize", onWindowResize, false);

  function onWindowResize() {
    camera3D.aspect = window.innerWidth / window.innerHeight;
    camera3D.updateProjectionMatrix();
    camera2D.aspect = window.innerWidth / window.innerHeight;
    camera2D.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  return {
    scenes: { Scene3D, SceneFloor },
    renderer,
    camera: { camera3D, camera2D },
    orbit: { orbit3D, orbit2D },
  };
};

export default setupScene;
