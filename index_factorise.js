import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Fonction pour créer une sphère avec un matériau de base
function createSphere(radius, segments, material) {
    const geometry = new THREE.SphereGeometry(radius, segments, segments);
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
}

// Fonction pour créer une orbite
function createOrbit(radius) {
    const orbitGeometry = new THREE.RingGeometry(radius, 180);
    const orbitMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0
    });
    const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
    orbitLine.rotation.x = Math.PI / 2;
    return orbitLine;
}

// Créez la scène, la caméra et le rendu
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);
camera.position.z = 10;

// Ajoutez OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Chargez les textures
const textureLoader = new THREE.TextureLoader();
const sunTexture = textureLoader.load('textures/sun/sunmap.jpg');
const backgroundTexture = textureLoader.load('textures/starmap_8k.jpeg');

// Créez les matériaux avec textures
const backgroundMaterial = new THREE.MeshBasicMaterial({
    map: backgroundTexture,
    side: THREE.BackSide,
});
const sunMaterial = new THREE.MeshBasicMaterial({
    map: sunTexture,
});

// Créez le système solaire
const solarSystem = new THREE.Object3D();
scene.add(solarSystem);

// Ajoutez le soleil
const sun = createSphere(3, 32, sunMaterial);
sun.scale.set(0.4, 0.4, 0.4);
solarSystem.add(sun);
sun.castShadow = true;

// Ajoutez l'arrière-plan
const backgroundMesh = createSphere(100, 32, backgroundMaterial);
scene.add(backgroundMesh);

// Ajoutez la lumière du soleil
const sunLight = new THREE.PointLight(0xffffff, 1);
sunLight.position.set(0, 0, 0);
sunLight.castShadow = true;
sunLight.intensity = 88;
scene.add(sunLight);

// Créez et ajoutez les planètes
const planetData = [
    { name: 'earth', radius: 1, segments: 32, position: 20, scale: 0.5, texture: 'textures/earth/earthmap1k.jpg' },
    { name: 'venus', radius: 1, segments: 32, position: 10, scale: 0.5, texture: 'textures/venus/venus.jpeg' },
    { name: 'mars', radius: 1, segments: 32, position: 30, scale: 0.5, texture: 'textures/mars/mars.jpg' },
    { name: 'jupiter', radius: 1, segments: 32, position: 40, scale: 0.5, texture: 'textures/jupiter/jupiter.jpeg' },
    { name: 'saturn', radius: 1, segments: 32, position: 50, scale: 0.5, texture: 'textures/saturn/saturn.jpeg' },
    { name: 'uranus', radius: 1, segments: 32, position: 60, scale: 0.5, texture: 'textures/uranus/uranus.jpeg' },
    { name: 'neptune', radius: 1, segments: 32, position: 70, scale: 0.5, texture: 'textures/neptune/neptune.jpg' },
    { name: 'pluto', radius: 0.5, segments: 32, position: 80, scale: 0.5, texture: 'textures/pluto/pluto.jpeg' },
];

planetData.forEach(planetInfo => {
    const planetMaterial = new THREE.MeshPhongMaterial({ map: textureLoader.load(planetInfo.texture) });
    const planet = createSphere(planetInfo.radius, planetInfo.segments, planetMaterial);
    planet.position.set(planetInfo.position, 0, 0);
    planet.scale.set(planetInfo.scale, planetInfo.scale, planetInfo.scale);
    solarSystem.add(planet);
});

// Créez les orbites des planètes
const planetOrbitRadii = [7, 1, 2, 4, 10, 15, 20, 25, 30];
const planetOrbits = planetOrbitRadii.map(radius => createOrbit(radius));
planetOrbits.forEach(orbit => scene.add(orbit));

// Appliquez l'inclinaison aux anneaux de Saturne
const saturnRingInclination = 69; //27deg Inclinaison en degrés

const saturnRing = planetData.find(planet => planet.name === 'saturn');

if (saturnRing) {
    const inclinationRadians = (saturnRingInclination / 180) * Math.PI;
    saturnRing.rotation.x = inclinationRadians;
}

// Définition des durées de l'année pour les planètes
const yearDuration = 10000;
const planetYearDurations = [
    yearDuration / 5, yearDuration / 3, yearDuration / 10,
    (2 * yearDuration) / 5, yearDuration / 2, (3 * yearDuration) / 5,
    (7 * yearDuration) / 10, (4 * yearDuration) / 5, (9 * yearDuration) / 10
];

// Gestion de la pression de la touche espace
let keypressed = false;
document.addEventListener('keydown', function (event) {
    if (event.key === ' ') {
        keypressed = true;
    }
});

document.addEventListener('keyup', function (event) {
    if (event.key === ' ') {
        keypressed = false;
    }
});

// Fonction de rendu
function render() {
    const currentTime = Date.now();

    // Rotation des planètes
    planetData.forEach((planet, index) => {
        const rotationFactor = (currentTime % planetYearDurations[index]) / planetYearDurations[index];
        planet.rotation.y = rotationFactor * 2 * Math.PI;

        // Position des planètes par rapport au soleil (orbite circulaire)
        const orbitRadius = planetOrbitRadii[index];
        planet.position.x = orbitRadius * Math.cos(planet.rotation.y);
        planet.position.z = orbitRadius * Math.sin(planet.rotation.y);
    });

    // Rendre l'orbite visible ou invisible
    planetOrbits.forEach(orbit => {
        if (keypressed) {
            orbit.material.opacity = 1;
        } else {
            orbit.material.opacity = 0;
        }
    });

    // Mettre à jour OrbitControls
    controls.update();

    // Appeler le rendu de la scène
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

// Démarrer l'animation
render();
