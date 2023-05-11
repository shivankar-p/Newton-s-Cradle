import * as THREE from "https://cdn.skypack.dev/three@0.136.0";

import { NewtonsCradle } from "./cradle";

import { OrbitControls } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls";
import { RoomEnvironment } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/environments/RoomEnvironment";

import * as dat from 'dat.gui'

console.clear();



let bgColor = new THREE.Color(0x222222);
let scene = new THREE.Scene();
scene.background = bgColor;

let camera1 = new THREE.PerspectiveCamera(30, innerWidth / innerHeight, 1, 1000);
camera1.position.set(-20, 7, 20).setLength(37);

let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", (event) => {
  camera1.aspect = innerWidth / innerHeight;
  camera1.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

// camera 2

// let renderer = new THREE.WebGLRenderer({ antialias: true });

window.addEventListener("resize", (event) => {
  camera2.aspect = innerWidth / innerHeight;
  camera2.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

// scene.add(camera1);
// scene.add(camera2);


const pmremGenerator = new THREE.PMREMGenerator(renderer);
scene.environment = pmremGenerator.fromScene(
  new RoomEnvironment(),
  0.04
).texture;

const gui = new dat.GUI();

let lightSettings = {
    "PointLight": true,
    "FixedSpotlight": true,
    "MovingSpotlight": true
  }

gui.add(lightSettings, "PointLight").name("Point Light")
gui.add(lightSettings, "FixedSpotlight").name("Fixed Spotlight")
gui.add(lightSettings, "MovingSpotlight").name("Moving Spotlight")

let currentCam = camera1

let controls = new OrbitControls(camera1, renderer.domElement);
// let controls2 = new OrbitControls(camera2, renderer.domElement);
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
// scene.add(light);


const light1 = new THREE.PointLight( 0xffffff, 1, 100 );
light1.position.set( 1, 15 , 0 );
light1.castShadow = true; 
light1.decay = 2;

const sphereSize = 1;
const pointLightHelper1 = new THREE.PointLightHelper( light1, sphereSize );
pointLightHelper1.color = new THREE.Color(0xffffff);
//scene.add(light1)

//Ambient light:
const ambientLight = new THREE.AmbientLight(0xffffff, 0.37);
scene.add(ambientLight)

const spotlight = new THREE.SpotLight(0xff0000, 1);
spotlight.intensity = 100;
spotlight.position.set(-7, 10, 0);
spotlight.distance = 10.4;
spotlight.castShadow = true;
spotlight.shadow.mapSize.width = 256;
spotlight.shadow.mapSize.height = 256;
spotlight.angle = Math.PI;


// spotlight.target = newtonsCradle.getTarget()
//scene.add(spotlight);

const spotlight_fixed = new THREE.SpotLight(0xe0b412, 0.1);
spotlight_fixed.position.set(10, 50, 0);
spotlight_fixed.castShadow = true;
spotlight_fixed.angle = 0.3;
//scene.add(spotlight_fixed);

gui.add(light1, 'intensity', 0, 5).name("Point Light Intensity");
gui.add(spotlight_fixed, 'intensity', 0, 10).name("SpotLight Intensity");
gui.add(spotlight, 'intensity', 10, 50).name("Moving Light Intensity");
gui.add(ambientLight, 'intensity', 0, 5).name("Ambient Light Intensity");

let newtonsCradle = new NewtonsCradle();
newtonsCradle.traverse((part) => {
  if (part.isMesh) {
    part.castShadow = true;
    part.receiveShadow = true;
  }
});
scene.add(newtonsCradle);
newtonsCradle.update(0.25);


let ground_texture = new THREE.TextureLoader().load('/textures/floor.jpg');
let ground_material = new THREE.MeshPhongMaterial({map: ground_texture});
let ground_geometry = new THREE.PlaneGeometry(250, 250).rotateX(Math.PI * -0.5)
let ground = new THREE.Mesh(ground_geometry, ground_material);
scene.add(ground);

let clock = new THREE.Clock();

var startAnimation = false

document.addEventListener("keydown", event => {
  if (event.key == "s") //Start the animation
  {
    if(!startAnimation){
      startAnimation = true
      console.log("active")
    }
    else startAnimation = false;
    
  }
  if(event.key == "c"){
    if(currentCam == camera1){
        currentCam = camera2
    }
    else currentCam = camera1
  }

  if(event.key == "ArrowLeft"){
    if(currentCam == camera2){
        camera2.rotation.y -= 0.1;
    }
  }

  if(event.key == "ArrowRight"){
    if(currentCam == camera2){
        camera2.rotation.y += 0.1;
    }
  }
});

// let camera_2_positions = newtonsCradle.getTarget().position;

let camera2 = new THREE.PerspectiveCamera(30, innerWidth / innerHeight, 0.1, 1000);
// camera2.position.set(camera_2_positions.x - 10, camera_2_positions.y - 10, camera_2_positions.z - 10);
camera2.position.set(-4.46, 20, 0).setLength(17);
camera2.angle = Math.PI/2;
camera2.lookAt(-4.46, 5, 0);


renderer.setAnimationLoop(() => {

    let t = clock.getElapsedTime();
    // controls.update();
    if(lightSettings.FixedSpotlight){
        scene.add(spotlight_fixed);
    }
    else {
        scene.remove(spotlight_fixed);
    }


    if(lightSettings.MovingSpotlight){
        scene.add(spotlight);
    }
    else {
        scene.remove(spotlight);
    }

    if(lightSettings.PointLight) {
        scene.add(light1);
    }
    else {
        scene.remove(light1);
    }
    

    controls.update();

    if(startAnimation) {  
        newtonsCradle.update(t);
        //spotlight_fixed.position.x = -50+(newtonsCradle.getPos().x);
        //spotlight_fixed.rotation.z = newtonsCradle.getPos();
        //console.log(spotlight_fixed.rotation.z)
        // spotlight_fixed.matrix.copy(newtonsCradle.getPos());
        // spotlight_fixed.updateMatrix();
        // console.log(spotlight_fixed.matrix)
        let rot = newtonsCradle.getPos();
        console.log('Hello', rot)
        let mat = new THREE.Matrix4();
        mat.makeRotationFromEuler(rot);

        let newPos = new THREE.Vector3(5, 10, 0);
        newPos = newPos.applyMatrix4(mat);

        // console.log(newPos.x);
        let camera_2_rot = newtonsCradle.getPos();
        // console.log('Posi', camera_2_positions)
        // camera2.position.set(camera_2_position.x-10, camera_2_position.y-10, camera_2_position.z-10).setLength(37);
        // camera2.rotation.copy(newtonsCradle.getPos());

        // cameraContainer.position.copy(objectToTrack.position);
        // cameraContainer.rotation.copy(objectToTrack.rotation);
        // camera2.lookAt(-4.46, 5, 0);
        // camera2.lookAt(0, 0, 5);
        camera2.rotation.y = -camera_2_rot.z;
        spotlight.position.x = -newPos.x;
        // spotlight.target.position.copy(newtonsCradle.getTarget().position);
        // spotlight.target.updateMatrixWorld()
        // scene.add(spotlight.target);
        
    }

    renderer.setRenderTarget(null);

    renderer.render(scene, currentCam);
});
