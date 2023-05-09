import * as THREE from "https://cdn.skypack.dev/three@0.136.0";

import { NewtonsCradle } from "./cradle";

import { OrbitControls } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls";
import { RoomEnvironment } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/environments/RoomEnvironment";

console.clear();



let bgColor = new THREE.Color(0x222222);
let scene = new THREE.Scene();
scene.background = bgColor;
let camera = new THREE.PerspectiveCamera(30, innerWidth / innerHeight, 1, 1000);
camera.position.set(-20, 7, 20).setLength(37);
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);
window.addEventListener("resize", (event) => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

const pmremGenerator = new THREE.PMREMGenerator(renderer);
scene.environment = pmremGenerator.fromScene(
  new RoomEnvironment(),
  0.04
).texture;

let controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 7, 0);
controls.enablePan = false;
controls.enableDamping = true;
//controls.autoRotate = true;
controls.maxPolarAngle = Math.PI * 0.5;
controls.update();

// let lightTarget = new THREE.Object3D();
// lightTarget.position.setScalar(-1);
// let light = new THREE.DirectionalLight(0xffffff, 0.5);
// light.position.set(0, 7, 0);
// light.add(lightTarget);
// light.target = lightTarget;
// light.castShadow = true;
// let shadowCamHalfSize = 25;
// let multiplier = 0.4;
// light.shadow.camera.top = shadowCamHalfSize * multiplier;
// light.shadow.camera.bottom = -shadowCamHalfSize * multiplier;
// light.shadow.camera.left = -shadowCamHalfSize * multiplier;
// light.shadow.camera.right = shadowCamHalfSize * multiplier;
// light.shadow.camera.near = -shadowCamHalfSize * 0.5;
// light.shadow.camera.far = shadowCamHalfSize * 1.5;
// light.shadow.mapSize.width = light.shadow.mapSize.height = 1024;
// scene.add(light, new THREE.AmbientLight(0xffffff, 0.5));
//scene.add(light);


// const light1 = new THREE.PointLight( 0xffffff, 5, 100 );
// light1.position.set( 1, 15 , 0 );
// light1.castShadow = true; 
// light1.decay = 2;

// const sphereSize = 1;
// const pointLightHelper1 = new THREE.PointLightHelper( light1, sphereSize );
// pointLightHelper1.color = new THREE.Color(0xffffff);
// scene.add(light1)

//Ambient light:
const ambientLight = new THREE.AmbientLight(0xffffff, 0.37);
scene.add(ambientLight)

const spotlight_fixed = new THREE.SpotLight(0xff0000);
spotlight_fixed.intensity = 100;
spotlight_fixed.position.set(-50, 10, 0);
spotlight_fixed.distance = 50;
//spotlight_fixed.angle = Math.PI;
spotlight_fixed.castShadow = true;
spotlight_fixed.angle = Math.PI;
scene.add(spotlight_fixed);



let newtonsCradle = new NewtonsCradle();
newtonsCradle.traverse((part) => {
  if (part.isMesh) {
    part.castShadow = true;
    part.receiveShadow = true;
  }
});
scene.add(newtonsCradle);
newtonsCradle.update(0.25);



let ground = new THREE.Mesh(
  new THREE.PlaneGeometry(250, 250).rotateX(Math.PI * -0.5),
  new THREE.MeshLambertMaterial({
    color: 0xaaaaaa
  })
);
ground.material.defines = { USE_UV: "" };
ground.receiveShadow = true;
scene.add(ground);

let clock = new THREE.Clock();

var startAnimation = false

document.addEventListener("keydown", event => {
  if (event.key == "s") //Start the animation
  {
    startAnimation = true
    console.log("active")
  }
});

renderer.setAnimationLoop(() => {

    let t = clock.getElapsedTime();
    

    controls.update();

    if(startAnimation) {  
        newtonsCradle.update(t);
        //spotlight_fixed.position.x = -50+(newtonsCradle.getPos().x);
        spotlight_fixed.rotation.z = newtonsCradle.getPos();
        
    }

    renderer.setRenderTarget(null);
    renderer.render(scene, camera);
});
