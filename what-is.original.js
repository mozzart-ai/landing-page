import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Get the container element
const container = document.getElementById('what-is');
if (!container) {
    console.error('Container element with id "hero" not found');
    throw new Error('Container element not found');
}

let line;
let mesh;
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 1, 1000);
camera.position.z = 120;
const textureLoader = new THREE.TextureLoader();

const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 50;
controls.maxDistance = 200;

// Set background color
scene.background = new THREE.Color(0x1a1a1a);

scene.add(new THREE.AmbientLight(0x666666));

const dirLight1 = new THREE.DirectionalLight(0xffddcc, 3);
dirLight1.position.set(1, 0.75, 5);
scene.add(dirLight1);

const dirLight2 = new THREE.DirectionalLight(0xccccff, 3);
dirLight2.position.set(2, 0.75, - 5);
scene.add(dirLight2);

const geometry = new THREE.BufferGeometry();
geometry.setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);

line = new THREE.Line(geometry, new THREE.LineBasicMaterial());
scene.add(line);

let isRotatingForward = true;
let targetRotation = Math.PI / 4;
let currentRotation = 0;

function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

loadModel();

// Set renderer size to match container
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

function animate() {

    if (mesh) {
        // Define rotation speed
        const rotationSpeed = 0.002;

        if (isRotatingForward) {
            currentRotation += rotationSpeed;
            if (currentRotation >= targetRotation) {
                currentRotation = targetRotation;
                isRotatingForward = false;
            }
        } else {
            currentRotation -= rotationSpeed;
            if (currentRotation <= 0) {
                currentRotation = 0;
                isRotatingForward = true;
            }
        }

        mesh.rotation.y = currentRotation;
    }
    renderer.render(scene, camera);
}

function loadModel() {
    const map = textureLoader.load('public/head/Map-COL.jpg');
    map.colorSpace = THREE.SRGBColorSpace;
    const specularMap = textureLoader.load('public/head/Map-SPEC.jpg');
    const normalMap = textureLoader.load('pulbic/head/Infinite-Level_02_Tangent_SmoothUV.jpg');

    const loader = new GLTFLoader();

    loader.load('public/head/head.glb', function (gltf) {

        mesh = gltf.scene.children[0];
        mesh.material = new THREE.MeshPhongMaterial({
            specular: 0x111111,
            map: map,
            specularMap: specularMap,
            normalMap: normalMap,
            shininess: 25
        });

        scene.add(mesh);
        mesh.scale.multiplyScalar(10);

        // Center the model
        const box = new THREE.Box3().setFromObject(mesh);
        const center = box.getCenter(new THREE.Vector3());
        gltf.scene.position.x += -center.x;
        gltf.scene.position.y += -center.y;
        gltf.scene.position.z += -center.z;

        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        camera.position.z = maxDim;

    });
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