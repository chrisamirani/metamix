import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const setupScene = () => {
  const Scene3D = new THREE.Scene();
  Scene3D.background = new THREE.Color(0xefefef);
  const SceneFloor = new THREE.Scene();
  SceneFloor.name = "FloorPlanner";
  SceneFloor.background = new THREE.Color(0xefefef);

  const camera3D = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera3D.position.set(15, 2, 15);

  const camera2D = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  camera2D.position.z = 10;
  camera2D.enableRotate = false;

  const renderer3D = new THREE.WebGLRenderer({ antialias: true });
  renderer3D.setSize(window.innerWidth, window.innerHeight);
  renderer3D.toneMapping = THREE.ACESFilmicToneMapping;
  renderer3D.toneMappingExposure = 1;
  renderer3D.outputEncoding = THREE.sRGBEncoding;

  const renderer2D = new THREE.WebGLRenderer({ antialias: true });
  renderer2D.setSize(window.innerWidth, window.innerHeight);
  renderer2D.toneMapping = THREE.ACESFilmicToneMapping;
  renderer2D.toneMappingExposure = 1;
  renderer2D.outputEncoding = THREE.sRGBEncoding;

  const environment = new RoomEnvironment();
  const pmremGenerator = new THREE.PMREMGenerator(renderer3D);
  Scene3D.environment = pmremGenerator.fromScene(environment).texture;

  const orbit3D = new OrbitControls(camera3D, renderer3D.domElement);
  orbit3D.maxPolarAngle = Math.PI / 2;
  orbit3D.enableDamping = true;

  const orbit2D = new OrbitControls(camera2D, renderer2D.domElement);
  orbit2D.enableRotate = false;

  const size = 100;
  const divisions = 10;

  const gridHelper = new THREE.GridHelper(size, divisions, 0x0000);
  gridHelper.rotation.set(Math.PI / 2, 0, 0);
  SceneFloor.add(gridHelper);

  const gridHelper3D = new THREE.GridHelper(size, divisions, 0xeaeaea);
  Scene3D.add(gridHelper3D);

  window.addEventListener("resize", onWindowResize, false);

  function onWindowResize() {
    camera3D.aspect = window.innerWidth / window.innerHeight;
    camera3D.updateProjectionMatrix();
    camera2D.aspect = window.innerWidth / window.innerHeight;
    camera2D.updateProjectionMatrix();

    renderer3D.setSize(window.innerWidth, window.innerHeight);
    renderer2D.setSize(window.innerWidth, window.innerHeight);
  }
  return {
    scenes: { Scene3D, SceneFloor },
    renderer: { renderer3D, renderer2D },
    camera: { camera3D, camera2D },
    orbit: { orbit3D, orbit2D },
    gridHelper3D,
  };
};

export default setupScene;
