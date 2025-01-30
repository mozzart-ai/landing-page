import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Get the container element
const container = document.getElementById('hero');
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
const controls = new OrbitControls(camera, renderer.domElement);

// Set background color
scene.background = new THREE.Color(0x1a1a1a);

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 15);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Create a TextureLoader to load our brand
const textureLoader = new THREE.TextureLoader();

// Set renderer size to match container
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

let isRotatingForward = false;
let targetRotation = Math.PI / 6;
let currentRotation = 0;

camera.position.z = 5;

// Create particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 100;
const posArray = new Float32Array(particlesCount * 3);
const velocityArray = new Float32Array(particlesCount * 3);

// Initialize particles with random positions and velocities
for (let i = 0; i < particlesCount * 3; i++) {
    // Position
    posArray[i] = (Math.random() - 0.5) * 10;
    // Velocity
    velocityArray[i] = (Math.random() - 0.5) * 0.02;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Create material for particles
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    color: 0xb233ff,
    transparent: true,
    opacity: 0.8
});

// Create the particle system
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Create lines between nearby particles
const linesMaterial = new THREE.LineBasicMaterial({
    color: 0xb233ff,
    transparent: true,
    opacity: 0.3
});

let linesGeometry = new THREE.BufferGeometry();
let linesPoints = [];
let plane = null;
const maxDistance = 2; // Maximum distance for connecting particles

const linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
scene.add(linesMesh);

// Load the brand image
textureLoader.load(
    'public/mozzart.png',
    function (texture) {
        // Create a plane geometry to display the image
        const geometry = new THREE.PlaneGeometry(5, 4); // Adjust size as needed
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide // Makes the plane visible from both sides
        });
        plane = new THREE.Mesh(geometry, material);
        scene.add(plane);
    },
    undefined,
    function (error) {
        console.error('Error loading texture:', error);
    }
);

function animate() {
    if (plane) {
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

        plane.rotation.y = currentRotation;
    }

    // Update particle positions
    const positions = particlesGeometry.attributes.position.array;
    for (let i = 0; i < particlesCount * 3; i++) {
        positions[i] += velocityArray[i];

        // Bounce off boundaries
        if (Math.abs(positions[i]) > 5) {
            velocityArray[i] *= -1;
        }
    }
    particlesGeometry.attributes.position.needsUpdate = true;

    // Update connecting lines
    updateLines();

    renderer.render(scene, camera);
}


function updateLines() {
    linesPoints = [];
    const positions = particlesGeometry.attributes.position.array;

    // Check distances between particles and create lines for close ones
    for (let i = 0; i < particlesCount; i++) {
        for (let j = i + 1; j < particlesCount; j++) {
            const x1 = positions[i * 3];
            const y1 = positions[i * 3 + 1];
            const z1 = positions[i * 3 + 2];

            const x2 = positions[j * 3];
            const y2 = positions[j * 3 + 1];
            const z2 = positions[j * 3 + 2];

            const distance = Math.sqrt(
                Math.pow(x2 - x1, 2) +
                Math.pow(y2 - y1, 2) +
                Math.pow(z2 - z1, 2)
            );

            if (distance < maxDistance) {
                linesPoints.push(x1, y1, z1);
                linesPoints.push(x2, y2, z2);
            }
        }
    }

    // Update lines geometry
    linesGeometry.dispose();
    linesGeometry = new THREE.BufferGeometry();
    linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linesPoints, 3));
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