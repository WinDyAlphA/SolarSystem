import * as THREE from "three";
import { ColorManagement } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { PCDLoader } from 'three/addons/loaders/PCDLoader.js';
import { ObjetStellaire } from "./ObjetStellaire.js";
import { Satelite } from "./Satelite.js";
import { Anneaux } from "./Anneaux.js";

import * as env from './const.js';
// Fonction pour créer une sphère avec un matériau de base
function createSphere(radius, segments, material) {
  const geometry = new THREE.SphereGeometry(radius, segments, segments);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.receiveShadow = true
  mesh.castShadow = true
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
  const orbitGeometry = new THREE.RingGeometry(radius, radius + 0.1, 180);
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

const sun = new ObjetStellaire(env.planetData.sun.radius,
  32,
  sunMaterial,
  0,
  0,
  )
sun.addToScene(scene);






const earthMaterial = new THREE.MeshPhongMaterial({
  // Utilisation de MeshPhongMaterial pour permettre les ombres
  map: textureLoader.load(env.planetData.earth.texture),
  normalMap: textureLoader.load('textures/earth/8knm.jpg'),
  specularMap: textureLoader.load('textures/earth/8kspm.jpg'),
});
const earth = new ObjetStellaire(env.planetData.earth.radius,
  32,
  earthMaterial,
  env.planetData.earth.orbitRadius,
  env.planetData.earth.eccentricity,
  true,
  null,
  1
  )
earth.addToScene(scene);

const moonMaterial = new THREE.MeshPhongMaterial({
  map: textureLoader.load(env.planetData.moon.texture),
});

const moon = new Satelite(earth,
  0.2,
  32,
  moonMaterial,
  env.planetData.moon.orbitRadius,
  0,
  true,
  null,
  10,
  1)

moon.addToScene(scene);



const mercuryMaterial = new THREE.MeshPhongMaterial({
  // Utilisation de MeshPhongMaterial pour permettre les ombres
  map: textureLoader.load(env.planetData.mercury.texture),
});
const mercury = new ObjetStellaire(env.planetData.mercury.radius,
  32,
  mercuryMaterial,
  env.planetData.mercury.orbitRadius,
  env.planetData.mercury.eccentricity,
  true, 1/5, -1
  )
mercury.addToScene(scene);
const venusMaterial = new THREE.MeshPhongMaterial({
  // Utilisation de MeshPhongMaterial pour permettre les ombres
  map: textureLoader.load(env.planetData.venus.texture),
});
const venus = new ObjetStellaire(env.planetData.venus.radius,
  32,
  venusMaterial,
  env.planetData.venus.orbitRadius,
  env.planetData.venus.eccentricity,
  true, 1/3 , -1
  )
venus.addToScene(scene);

const marsMaterial = new THREE.MeshPhongMaterial({
  // Utilisation de MeshPhongMaterial pour permettre les ombres
  map: textureLoader.load(env.planetData.mars.texture),
});
const mars = new ObjetStellaire(env.planetData.mars.radius,
  32,
  marsMaterial,
  env.planetData.mars.orbitRadius,
  env.planetData.mars.eccentricity,
  true, 2/5
  )
mars.addToScene(scene);

const jupiterMaterial = new THREE.MeshPhongMaterial({
  // Utilisation de MeshPhongMaterial pour permettre les ombres
  map: textureLoader.load(env.planetData.jupiter.texture)
});
const jupiter = new ObjetStellaire(env.planetData.jupiter.radius,
  32,
  jupiterMaterial,
  env.planetData.jupiter.orbitRadius,
  env.planetData.jupiter.eccentricity,true,
  3/10
  )
jupiter.addToScene(scene);

const saturnMaterial = new THREE.MeshPhongMaterial({
  // Utilisation de MeshPhongMaterial pour permettre les ombres
  map: textureLoader.load(env.planetData.saturn.texture)
});
const saturn = new ObjetStellaire(env.planetData.saturn.radius,
  32,
  saturnMaterial,
  env.planetData.saturn.orbitRadius,
  env.planetData.saturn.eccentricity,true,
  true,
  3/9
  )
saturn.addToScene(scene);

const uranusMaterial = new THREE.MeshPhongMaterial({
  // Utilisation de MeshPhongMaterial pour permettre les ombres
  map: textureLoader.load(env.planetData.uranus.texture)
});
const uranus = new ObjetStellaire(env.planetData.uranus.radius,
  32,
  uranusMaterial,
  env.planetData.uranus.orbitRadius,
  env.planetData.uranus.eccentricity,true,
  4/2
  )
uranus.addToScene(scene);

const neptuneMaterial = new THREE.MeshPhongMaterial({
  // Utilisation de MeshPhongMaterial pour permettre les ombres
  map: textureLoader.load(env.planetData.neptune.texture)
});
const neptune = new ObjetStellaire(env.planetData.neptune.radius,
  32,
  neptuneMaterial,
  env.planetData.neptune.orbitRadius,
  env.planetData.neptune.eccentricity,true,
  4/5
  )
neptune.addToScene(scene);


const plutoMaterial = new THREE.MeshPhongMaterial({
  // Utilisation de MeshPhongMaterial pour permettre les ombres
  map: textureLoader.load(env.planetData.pluto.texture)
});
const pluto = new ObjetStellaire(env.planetData.pluto.radius,
  32,
  plutoMaterial,
  env.planetData.pluto.orbitRadius,
  env.planetData.pluto.eccentricity,true,
  14/8
  )
pluto.addToScene(scene);






// Add background
const backgroundMesh = createSphere(400, 32, backgroundMaterial);
scene.add(backgroundMesh);

const sunLight = new THREE.PointLight(env.sunLightColor, 0);
sunLight.position.set(0, 0, 0);
sunLight.intensity = env.sunLightIntensity;
scene.add(sunLight);


const saturnRingTexture = textureLoader.load("textures/saturn/saturnring_full.jpeg"); // Remplacez le chemin avec le chemin vers votre texture circulaire

const saturnRingMaterial = new THREE.MeshPhongMaterial({
  map: saturnRingTexture, // Utilisez la texture circulaire que vous avez chargée
  side: THREE.DoubleSide,
});

const saturnRing = new Anneaux(saturn,
  saturnRingMaterial,
  1,
  7,
  69,

  )

saturnRing.addToScene(scene);


 //27deg Inclinaison en degrés



// Durée d'une année en millisecondes (10 secondes dans la simulation)
const yearDuration = env.yearDuration;

// Durée relative pour Mercure (en millisecondes) par exemple, 1/5 de la durée de l'année
const mercuryYearDuration = yearDuration / 5;

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
            targetObject = earth.mesh;
            break;
        case env.planetData.mercury.orbitRadius:
            targetObject = mercury.mesh;
            break;
        case env.planetData.venus.orbitRadius:
            targetObject = venus.mesh;
            break;
        case env.planetData.mars.orbitRadius:
            targetObject = mars.mesh;
            break;
        case env.planetData.jupiter.orbitRadius:
            targetObject = jupiter.mesh;
            break;
        case env.planetData.saturn.orbitRadius:
            targetObject = saturn.mesh;
            break;
        case env.planetData.uranus.orbitRadius:
            targetObject = uranus.mesh;
            break;
        case env.planetData.neptune.orbitRadius:
            targetObject = neptune.mesh;
            break;
        case env.planetData.pluto.orbitRadius:
            targetObject = pluto.mesh;
            break;
        default:
            // Définissez ici le comportement par défaut si le rayon interne n'est pas trouvé.
            break;
    }

    if (targetObject) {
        if (targetObject === earth.mesh || targetObject === mercury.mesh || targetObject === venus.mesh || targetObject === mars.mesh || targetObject === pluto.mesh ) {
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
          console.log(targetObject)
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


  // Faites tourner la Lune autour de la Terre avec la même échelle de temps


  if (keypressed == true) {
    earth.orbit.material.opacity = 1;
    moon.orbit.material.opacity = 1; // Orbite visible
    mars.orbit.material.opacity = 1;
    mercury.orbit.material.opacity = 1;
    venus.orbit.material.opacity = 1;
    jupiter.orbit.material.opacity = 1;
    saturn.orbit.material.opacity = 1;
    uranus.orbit.material.opacity = 1;
    neptune.orbit.material.opacity = 1;
    pluto.orbit.material.opacity = 1;
  } else {
    earth.orbit.material.opacity = 0;
    moon.orbit.material.opacity = 0; // Orbite invisible
    mars.orbit.material.opacity = 0;
    mercury.orbit.material.opacity = 0;
    venus.orbit.material.opacity = 0;
    jupiter.orbit.material.opacity = 0;
    saturn.orbit.material.opacity = 0;
    uranus.orbit.material.opacity = 0;
    neptune.orbit.material.opacity = 0;
    pluto.orbit.material.opacity = 0;
  }

  sun.mesh.rotation.y += 0.01;

  earth.update()
  mercury.update()
  venus.update()
  mars.update()
  jupiter.update()
  saturn.update()
  saturnRing.update()
  uranus.update()
  neptune.update()
  pluto.update()
  moon.update()
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
