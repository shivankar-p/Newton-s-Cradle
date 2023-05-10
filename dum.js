import * as THREE from "https://cdn.skypack.dev/three@0.136.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls";

// Set up the scene
var scene = new THREE.Scene();

// Set up the camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Set up the renderer
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Create a platform
var geometry = new THREE.BoxGeometry(5, 0.2, 5);
var material = new THREE.MeshPhongMaterial({ color: 0x808080 });
var platform = new THREE.Mesh(geometry, material);
platform.receiveShadow = true;
scene.add(platform);

// Create a red spotlight
var spotlight = new THREE.SpotLight(0xff0000);
spotlight.position.set(0, 10, 0);
spotlight.castShadow = true;
spotlight.shadow.mapSize.width = 256;
spotlight.shadow.mapSize.height = 256;
scene.add(spotlight);

// Set up spotlight target
var target = new THREE.Object3D();
target.position.set(0, 0, 0);
scene.add(target);
spotlight.target = target;

// Add ambient light
var ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Add OrbitControls
var controls = new OrbitControls(camera, renderer.domElement);

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Render the scene
  renderer.render(scene, camera);
}

// Start the animation loop
animate();




