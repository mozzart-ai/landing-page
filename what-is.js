import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Get the container element
const container = document.getElementById('what-is');
if (!container) {
    console.error('Container element with id "hero" not found');
    throw new Error('Container element not found');
}

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
const loader = new GLTFLoader();

// Set background color
scene.background = new THREE.Color(0x1a1a1a);

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 15);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Set renderer size to match container
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

let globets = null;
camera.position.z = 5;

// Load a glTF resource
loader.load('public/brass_goblets/brass_goblets.gltf', function (gltf) {
    globets = gltf.scene;
    scene.add(gltf.scene);

    // Center the model
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const center = box.getCenter(new THREE.Vector3());
    gltf.scene.position.x += -center.x;
    gltf.scene.position.y += -center.y;
    gltf.scene.position.z += -center.z;

    // Optional: Adjust the camera to frame the model
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    camera.position.z = maxDim * 2;


}, undefined, function (error) {
    console.error(error);
});

function animate() {
    if (globets !== null) {
        globets.rotation.y += 0.01;
    }

    renderer.render(scene, camera);
}

// Resize handler now uses container dimensions
function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

// Add event listener for window resize
window.addEventListener('resize', onWindowResize);

// Start animation loop
renderer.setAnimationLoop(animate);

// Initial resize
onWindowResize();