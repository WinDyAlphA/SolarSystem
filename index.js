import * as THREE from "three";
import { ColorManagement } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { PCDLoader } from 'three/addons/loaders/PCDLoader.js';

import * as env from './const.js';
// Fonction pour créer une sphère avec un matériau de base
function createSphere(radius, segments, material) {
  const geometry = new THREE.SphereGeometry(radius, segments, segments);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.receiveShadow = true
  mesh.castShadow = true
  return mesh;
}
function createSun(radius, segments, material) {
  const geometry = new THREE.SphereGeometry(radius, segments, segments);
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}
const objectToFollow = {};
let isFollowing = false;
function onClick(event) {
  // Obtenez la position du clic de la souris en coordonnées normalisées
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Créez un rayon depuis la caméra à la position du clic
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  const proximityThreshold = 0.1; // Ajustez selon vos besoins
  // Obtenez la liste des objets intersectés par le rayon
  const intersects = raycaster.intersectObjects(scene.children, true);

  // Parcourez les objets intersectés pour vérifier s'ils sont des orbites
  for (const intersect of intersects) {
    if (intersect.object.isOrbit) {
      // C'est une orbite, affichez un message dans la console
      console.log("Clic sur une orbite !");
      console.log(intersect.object);
      isFollowing = true;
      objectToFollow.object = intersect.object;
      break; // Sortez de la boucle car vous avez trouvé une orbite
    }
  }
}

function createOrbit(radius) {
  const orbitGeometry = new THREE.RingGeometry(radius, radius + 0.01, 180);
  const orbitMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0,
  });

  const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);

  orbitLine.rotation.x = Math.PI / 2;

  // Marquez l'objet comme une orbite
  orbitLine.isOrbit = true;
  return orbitLine;
}

//la scène, la caméra et le rendu
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);
camera.position.z = 10;

// instantiate a loader
const loader = new PCDLoader();
loader.load(
	// resource URL
	'PCD.pcd',
    // called when the resource is loaded
    function ( object ) {
        scene.add( object );
    },
    // called when loading is in progresses
    function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    // called when loading has errors
    function ( error ) {
        console.log( 'An error happened' );
    }
);

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// textureLoader
const textureLoader = new THREE.TextureLoader();
const video = document.createElement('video');
video.src = 'textures/sun/sunvid.mov';
video.loop = true; // La vidéo boucle en continu
video.muted = true; // Activez le mode muet pour éviter la lecture du son
video.play(); // Commencez la lecture de la vidéo
const videoTexture = new THREE.VideoTexture(video);
videoTexture.minFilter = THREE.LinearFilter; // Réglez le filtrage pour une meilleure qualité
videoTexture.magFilter = THREE.LinearFilter;
const sunTexture = textureLoader.load("textures/sun/sunmap.jpg");
const backgroundTexture = textureLoader.load("textures/starmap_8k.jpeg");

// Create materials with textures
const backgroundMaterial = new THREE.MeshBasicMaterial({
  map: backgroundTexture,
  side: THREE.BackSide,
});
const sunMaterial = new THREE.MeshBasicMaterial({
  map: videoTexture,
});

var solarSystem = new THREE.Object3D();
scene.add(solarSystem);

// Add sun
const sun = createSun(7, 32, sunMaterial);
sun.scale.set(0.4, 0.4, 0.4);
solarSystem.add(sun);



// Add background
const backgroundMesh = createSphere(400, 32, backgroundMaterial);
scene.add(backgroundMesh);

const sunLight = new THREE.PointLight(env.sunLightColor, 0);
sunLight.position.set(0, 0, 0);
sunLight.castShadow = true;
sunLight.intensity = env.sunLightIntensity;
scene.add(sunLight);


//ajouter la lune
const moonMaterial = new THREE.MeshPhongMaterial({
  map: textureLoader.load(env.planetData.moon.texture),
});
const moon = createSphere(env.planetData.moon.radius, 32, moonMaterial);
moon.position.set(2, 0, 0);
moon.scale.set(0.2, 0.2, 0.2);

solarSystem.add(moon);

//ajouter mecure
const mercuryMaterial = new THREE.MeshPhongMaterial({
  map: textureLoader.load(env.planetData.mercury.texture),
});
const mercury = createSphere(0.25, 32, mercuryMaterial);
mercury.position.set(1, 0, 0);
mercury.scale.set(0.2, 0.2, 0.2);
solarSystem.add(mercury);

// Création de la planète Terre avec MeshPhongMaterial
const earthMaterial = new THREE.MeshPhongMaterial({
  // Utilisation de MeshPhongMaterial pour permettre les ombres
  map: textureLoader.load(env.planetData.earth.texture),
});
const earth = createSphere(env.planetData.earth.radius, 32, earthMaterial);
earth.position.set(20, 0, 0);

earth.scale.set(0.5, 0.5, 0.5);
solarSystem.add(earth);

// creation de la planete venus
const venusMaterial = new THREE.MeshPhongMaterial({
  map: textureLoader.load(env.planetData.venus.texture),
});
const venus = createSphere(env.planetData.venus.radius, 32, venusMaterial);
venus.position.set(10, 0, 0);
venus.scale.set(0.5, 0.5, 0.5);
solarSystem.add(venus);

// creation de la planete mars
const marsMaterial = new THREE.MeshPhongMaterial({
  map: textureLoader.load(env.planetData.mars.texture),
});
const mars = createSphere(env.planetData.mars.radius, 32, marsMaterial);
mars.position.set(30, 0, 0);
mars.scale.set(0.5, 0.5, 0.5);
solarSystem.add(mars);

// creation de la planete jupiter
const jupiterMaterial = new THREE.MeshPhongMaterial({
  map: textureLoader.load(env.planetData.jupiter.texture),
});
const jupiter = createSphere(env.planetData.jupiter.radius, 32, jupiterMaterial);
jupiter.position.set(40, 0, 0);
jupiter.scale.set(0.5, 0.5, 0.5);
solarSystem.add(jupiter);

// creation de la planete saturne
const saturnMaterial = new THREE.MeshPhongMaterial({
  map: textureLoader.load(env.planetData.saturn.texture),
});
const saturn = createSphere(env.planetData.saturn.radius, 32, saturnMaterial);
saturn.position.set(50, 0, 0);
saturn.scale.set(0.5, 0.5, 0.5);
solarSystem.add(saturn);

//creation de l'anneau de saturne
const saturnRingMaterial = new THREE.MeshPhongMaterial({
  map: textureLoader.load("textures/saturn/saturn_ring.png"),
  side: THREE.DoubleSide,
});
const saturnRing = new THREE.Mesh(
  new THREE.RingGeometry(
    env.planetData.saturn.radius + 1,
    env.planetData.saturn.radius + 8,
    32
  ),
  saturnRingMaterial
);
saturnRing.rotation.x = Math.PI / 2;
saturn.add(saturnRing);

// creation de la planete uranus
const uranusMaterial = new THREE.MeshPhongMaterial({
  map: textureLoader.load(env.planetData.uranus.texture),
});
const uranus = createSphere(env.planetData.uranus.radius, 32, uranusMaterial);
uranus.position.set(60, 0, 0);
uranus.scale.set(0.5, 0.5, 0.5);
solarSystem.add(uranus);

//creation de la planete neptune
const neptuneMaterial = new THREE.MeshPhongMaterial({
  map: textureLoader.load("textures/neptune/neptune.jpg"),
});
const neptune = createSphere(env.planetData.neptune.radius, 32, neptuneMaterial);
neptune.position.set(70, 0, 0);
neptune.scale.set(0.5, 0.5, 0.5);
solarSystem.add(neptune);

// creation de la planete pluto
const plutoMaterial = new THREE.MeshPhongMaterial({
  map: textureLoader.load(env.planetData.pluto.texture),
});
const pluto = createSphere(env.planetData.pluto.radius, 32, plutoMaterial);
pluto.position.set(80, 0, 0);
pluto.scale.set(0.5, 0.5, 0.5);
solarSystem.add(pluto);

// Créez des géométries de cercle pour les orbites (par exemple, pour la Terre)

const moonOrbitGeometry = new THREE.RingGeometry(
  env.planetData.moon.orbitRadius,
  env.planetData.moon.orbitRadius,
  180
);
const orbitMaterial = new THREE.LineBasicMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0,
});
const moonOrbitLine = new THREE.Line(moonOrbitGeometry, orbitMaterial);
moonOrbitLine.rotation.x = Math.PI / 2;
// Ajoutez les lignes d'orbite à la scène

scene.add(moonOrbitLine);
const earthOrbitLine = createOrbit(env.planetData.earth.orbitRadius);
scene.add(earthOrbitLine);
const mercuryOrbitLine = createOrbit(env.planetData.mercury.orbitRadius);
scene.add(mercuryOrbitLine);
const venusOrbitLine = createOrbit(env.planetData.venus.orbitRadius);
scene.add(venusOrbitLine);
const marsOrbitLine = createOrbit(env.planetData.mars.orbitRadius);
scene.add(marsOrbitLine);
const jupiterOrbitLine = createOrbit(env.planetData.jupiter.orbitRadius);
scene.add(jupiterOrbitLine);
const saturnOrbitLine = createOrbit(env.planetData.saturn.orbitRadius);
scene.add(saturnOrbitLine);
const uranusOrbitLine = createOrbit(env.planetData.uranus.orbitRadius);
scene.add(uranusOrbitLine);
const neptuneOrbitLine = createOrbit(env.planetData.neptune.orbitRadius);
scene.add(neptuneOrbitLine);
const plutoOrbitLine = createOrbit(env.planetData.pluto.orbitRadius);
scene.add(plutoOrbitLine);

const saturnRingInclination = 69; //27deg Inclinaison en degrés

// Convertissez l'inclinaison en radians
const inclinationRadians = (saturnRingInclination / 180) * Math.PI;

// Appliquez la rotation aux anneaux de Saturne (assurez-vous que l'objet des anneaux est un enfant de l'objet Saturne)
saturnRing.rotation.x = inclinationRadians;

// Durée d'une année en millisecondes (10 secondes dans la simulation)
const yearDuration = env.yearDuration;

// Durée relative pour Mercure (en millisecondes) par exemple, 1/5 de la durée de l'année
const mercuryYearDuration = yearDuration / 5;

// Durée relative pour Vénus (en millisecondes) par exemple, 1/3 de la durée de l'année
const venusYearDuration = yearDuration / 3;

// Durée relative pour la Lune (en millisecondes) par exemple, 1/10 de la durée de l'année
const moonYearDuration = yearDuration / 10;

// Durée relative pour Mars (en millisecondes) par exemple, 2/5 de la durée de l'année
const marsYearDuration = (2 * yearDuration) / 5;

// Durée relative pour Jupiter (en millisecondes) par exemple, 1/2 de la durée de l'année
const jupiterYearDuration = yearDuration / 2;

// Durée relative pour Saturne (en millisecondes) par exemple, 3/5 de la durée de l'année
const saturnYearDuration = (3 * yearDuration) / 5;

// Durée relative pour Uranus (en millisecondes) par exemple, 7/10 de la durée de l'année
const uranusYearDuration = (7 * yearDuration) / 10;

// Durée relative pour Neptune (en millisecondes) par exemple, 4/5 de la durée de l'année
const neptuneYearDuration = (4 * yearDuration) / 5;

// Durée relative pour Pluton (en millisecondes) par exemple, 9/10 de la durée de l'année
const plutoYearDuration = (9 * yearDuration) / 10;
var keypressed = false;
document.addEventListener("keydown", function (event) {
  if (event.key === "o") {
    keypressed = true;
  }
});

document.addEventListener("keyup", function (event) {
  if (event.key === "o") {
    keypressed = false;
    isFollowing = false;
  }
});

renderer.domElement.addEventListener("click", onClick);

function render() {
  const currentTime = Date.now();

  if (keypressed && isFollowing && objectToFollow) {
    const cameraRotationSpeed = ((currentTime % yearDuration) / 2 / yearDuration / 2) * 2 * Math.PI;

    let targetObject = null;

    switch (objectToFollow.object.geometry.parameters.innerRadius) {
        case env.planetData.earth.orbitRadius:
            targetObject = earth;
            break;
        case env.planetData.mercury.orbitRadius:
            targetObject = mercury;
            break;
        case env.planetData.venus.orbitRadius:
            targetObject = venus;
            break;
        case env.planetData.mars.orbitRadius:
            targetObject = mars;
            break;
        case env.planetData.jupiter.orbitRadius:
            targetObject = jupiter;
            break;
        case env.planetData.saturn.orbitRadius:
            targetObject = saturn;
            break;
        case env.planetData.uranus.orbitRadius:
            targetObject = uranus;
            break;
        case env.planetData.neptune.orbitRadius:
            targetObject = neptune;
            break;
        case env.planetData.pluto.orbitRadius:
            targetObject = pluto;
            break;
        default:
            // Définissez ici le comportement par défaut si le rayon interne n'est pas trouvé.
            break;
    }

    if (targetObject) {
        if (targetObject === earth || targetObject === mercury || targetObject === venus || targetObject === mars || targetObject === pluto ) {
            const targetPosition = new THREE.Vector3(
                targetObject.position.x + 1 * Math.cos(cameraRotationSpeed) + 1 ,
                targetObject.position.y + Math.cos(cameraRotationSpeed) * 2,
                targetObject.position.z + 1 * Math.sin(cameraRotationSpeed) + 1
            );
            camera.position.copy(targetPosition);
            camera.lookAt(targetObject.position);
            controls.target.copy(targetObject.position);
            controls.update();
            }
        else {
            const targetPosition = new THREE.Vector3(
                targetObject.position.x + 1 * Math.cos(cameraRotationSpeed) + 1+ 30,
                targetObject.position.y + Math.cos(cameraRotationSpeed) * 2,
                targetObject.position.z + 1 * Math.sin(cameraRotationSpeed) + 1+ 30
            );
            camera.position.copy(targetPosition);
            camera.lookAt(targetObject.position);
            controls.target.copy(targetObject.position);
            controls.update();
        }

        
    }
}

  // if (keypressed && isFollowing && objectToFollow) {
  //     // Calculez la position de la caméra en fonction de la position de l'objet à suivre
  //     const objectToFollowPosition = objectToFollow.object.position;
  //     console.log(objectToFollowPosition)
  //     camera.position.x = objectToFollowPosition.x;
  //     camera.position.y = objectToFollowPosition.y;
  //     camera.position.z = objectToFollowPosition.z + 10;
  // }

  // Faites tourner la Terre autour du soleil avec une année simulée de 10 secondes
  earth.rotation.y =
    ((currentTime % yearDuration) / yearDuration) * 2 * Math.PI;

  // Faites tourner la Lune autour de la Terre avec la même échelle de temps
  moon.rotation.y =
    ((currentTime % moonYearDuration) / moonYearDuration) * 2 * Math.PI;

  // Faites tourner Mercure autour du soleil avec la même échelle de temps
  mercury.rotation.y =
    ((currentTime % mercuryYearDuration) / mercuryYearDuration) * 2 * Math.PI;

  // Faites tourner Venus autour du soleil avec la même échelle de temps
  venus.rotation.y =
    ((currentTime % venusYearDuration) / venusYearDuration) * 2 * Math.PI;

  // Faites tourner Mars autour du soleil avec la même échelle de temps
  mars.rotation.y =
    ((currentTime % marsYearDuration) / marsYearDuration) * 2 * Math.PI;

  // Faites tourner Jupiter autour du soleil avec la même échelle de temps
  jupiter.rotation.y =
    ((currentTime % jupiterYearDuration) / jupiterYearDuration) * 2 * Math.PI;

  // Faites tourner Saturne autour du soleil avec la même échelle de temps
  saturn.rotation.y =
    ((currentTime % saturnYearDuration) / saturnYearDuration) * 2 * Math.PI;

  // Faites tourner Uranus autour du soleil avec la même échelle de temps
  uranus.rotation.y =
    ((currentTime % uranusYearDuration) / uranusYearDuration) * 2 * Math.PI;

  // Faites tourner Neptune autour du soleil avec la même échelle de temps
  neptune.rotation.y =
    ((currentTime % neptuneYearDuration) / neptuneYearDuration) * 2 * Math.PI;

  // Faites tourner Pluton autour du soleil avec la même échelle de temps
  pluto.rotation.y =
    ((currentTime % plutoYearDuration) / plutoYearDuration) * 2 * Math.PI;

  // Mettez à jour les positions des planètes par rapport au soleil (en supposant une orbite circulaire)
  earth.position.x = env.planetData.earth.orbitRadius * Math.cos(earth.rotation.y);
  earth.position.z = env.planetData.earth.orbitRadius * Math.sin(earth.rotation.y);

  moon.position.x =
    earth.position.x + env.planetData.moon.orbitRadius * Math.cos(moon.rotation.y);
  moon.position.z =
    earth.position.z + env.planetData.moon.orbitRadius * Math.sin(moon.rotation.y);

  mercury.position.x = env.planetData.mercury.orbitRadius * Math.cos(-mercury.rotation.y);
  mercury.position.z = env.planetData.mercury.orbitRadius * Math.sin(-mercury.rotation.y);

  venus.position.x = env.planetData.venus.orbitRadius * Math.cos(-venus.rotation.y);
  venus.position.z = env.planetData.venus.orbitRadius * Math.sin(-venus.rotation.y);

  mars.position.x = env.planetData.mars.orbitRadius * Math.cos(mars.rotation.y);
  mars.position.z = env.planetData.mars.orbitRadius * Math.sin(mars.rotation.y);

  jupiter.position.x = env.planetData.jupiter.orbitRadius * Math.cos(jupiter.rotation.y);
  jupiter.position.z = env.planetData.jupiter.orbitRadius * Math.sin(jupiter.rotation.y);

  saturn.position.x = env.planetData.saturn.orbitRadius * Math.cos(saturn.rotation.y);
  saturn.position.z = env.planetData.saturn.orbitRadius * Math.sin(saturn.rotation.y);

  uranus.position.x = env.planetData.uranus.orbitRadius * Math.cos(uranus.rotation.y);
  uranus.position.z = env.planetData.uranus.orbitRadius * Math.sin(uranus.rotation.y);

  neptune.position.x = env.planetData.neptune.orbitRadius * Math.cos(neptune.rotation.y);
  neptune.position.z = env.planetData.neptune.orbitRadius * Math.sin(neptune.rotation.y);

  pluto.position.x = env.planetData.pluto.orbitRadius * Math.cos(pluto.rotation.y);
  pluto.position.z = env.planetData.pluto.orbitRadius * Math.sin(pluto.rotation.y);

  moonOrbitLine.position.x = earth.position.x;
  moonOrbitLine.position.z = earth.position.z;

  if (keypressed == true) {
    earthOrbitLine.material.opacity = 1;
    moonOrbitLine.material.opacity = 1; // Orbite visible
    marsOrbitLine.material.opacity = 1;
    mercuryOrbitLine.material.opacity = 1;
    venusOrbitLine.material.opacity = 1;
    jupiterOrbitLine.material.opacity = 1;
    saturnOrbitLine.material.opacity = 1;
    uranusOrbitLine.material.opacity = 1;
    neptuneOrbitLine.material.opacity = 1;
    plutoOrbitLine.material.opacity = 1;
  } else {
    earthOrbitLine.material.opacity = 0;
    moonOrbitLine.material.opacity = 0; // Orbite invisible
    marsOrbitLine.material.opacity = 0;
    mercuryOrbitLine.material.opacity = 0;
    venusOrbitLine.material.opacity = 0;
    jupiterOrbitLine.material.opacity = 0;
    saturnOrbitLine.material.opacity = 0;
    uranusOrbitLine.material.opacity = 0;
    neptuneOrbitLine.material.opacity = 0;
    plutoOrbitLine.material.opacity = 0;
  }

  sun.rotation.y += 0.01;

  // Mettez à jour OrbitControls
  controls.update();

  //ajouter des ombres
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

// Appelez la fonction render pour commencer l'animation
render();
