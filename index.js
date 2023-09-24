import * as THREE from "three";
import { ColorManagement } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { PCDLoader } from 'three/addons/loaders/PCDLoader.js';
import { ObjetStellaire } from "./ObjetStellaire.js";
import { ObjetSatellitaire } from "./ObjetSatellitaire.js";
import { Anneaux } from "./Anneaux.js";
import * as material from './materials.js';

import * as env from './const.js';
// Fonction pour créer une sphère avec un matériau de base
function createSphere(radius, segments, material) {
  const geometry = new THREE.SphereGeometry(radius, segments, segments);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.receiveShadow = true
  mesh.castShadow = true
  return mesh;
}
const textureLoader = new THREE.TextureLoader();


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





// Create all the planets and add them to the scene

var solarSystemSC = new THREE.Object3D();
scene.add(solarSystemSC);

const earth = new ObjetStellaire(env.planetData.earth.radius,32,material.earth,env.planetData.earth.orbitRadius,env.planetData.earth.eccentricity,env.planetData.earth.obliquity,true,null,1);

let solarsystem = {
  sun: new ObjetStellaire(env.planetData.sun.radius,32,material.sun,0,0,0,false),
  earth: earth,
  moon: new ObjetSatellitaire(earth,0.2,32,env.planetData.moon.texture,env.planetData.moon.orbitRadius,env.planetData.moon.eccentricity,true,null,10,1),
  mercury: new ObjetStellaire(env.planetData.mercury.radius,32,env.planetData.mercury.texture,env.planetData.mercury.orbitRadius,env.planetData.mercury.eccentricity,env.planetData.mercury.obliquity,true, 1/5, -1),
  venus: new ObjetStellaire(env.planetData.venus.radius,32,env.planetData.venus.texture,env.planetData.venus.orbitRadius,env.planetData.venus.eccentricity,env.planetData.venus.obliquity, true, 1/3 , -1),
  mars: new ObjetStellaire(env.planetData.mars.radius,32,env.planetData.mars.texture,env.planetData.mars.orbitRadius,env.planetData.mars.eccentricity,env.planetData.mars.obliquity, true, 2/5),
  jupiter: new ObjetStellaire(env.planetData.jupiter.radius,32,env.planetData.jupiter.texture,env.planetData.jupiter.orbitRadius,env.planetData.jupiter.eccentricity,env.planetData.jupiter.obliquity, true,3/10),
  saturn: new ObjetStellaire(env.planetData.saturn.radius,32,env.planetData.saturn.texture,env.planetData.saturn.orbitRadius,env.planetData.saturn.eccentricity,env.planetData.saturn.obliquity, true,3/9),
  uranus: new ObjetStellaire(env.planetData.uranus.radius,32,env.planetData.uranus.texture,env.planetData.uranus.orbitRadius,env.planetData.uranus.eccentricity,env.planetData.uranus.obliquity, true,4/2),
  neptune: new ObjetStellaire(env.planetData.neptune.radius,32,env.planetData.neptune.texture,env.planetData.neptune.orbitRadius,env.planetData.neptune.eccentricity,env.planetData.neptune.obliquity, true,4/5),
  pluto: new ObjetStellaire(env.planetData.pluto.radius,32,env.planetData.pluto.texture,env.planetData.pluto.orbitRadius,env.planetData.pluto.eccentricity,env.planetData.pluto.obliquity, true,14/8),
}

for (const planet in solarsystem) {
  solarsystem[planet].addToScene(solarSystemSC);
}



// Add background
const backgroundMesh = createSphere(400, 32, material.background);
scene.add(backgroundMesh);

// Add sun light
const sunLight = new THREE.PointLight(env.sunLightColor, 0);
sunLight.position.set(0, 0, 0);
sunLight.intensity = env.sunLightIntensity;
sunLight.castShadow = true;
scene.add(sunLight);

// Add ambient light
const ambientLight = new THREE.AmbientLight(env.ambientLightColor, env.ambientLightIntensity);
scene.add(ambientLight);



const saturnRingMaterial = new THREE.MeshPhongMaterial({
  map: textureLoader.load("textures/saturn/saturnring_full.jpeg"),
  side: THREE.DoubleSide,
});

const saturnRing = new Anneaux(solarsystem.saturn,saturnRingMaterial,1,7,69,)
saturnRing.addToScene(solarSystemSC);


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

const planetOrbitMapping = {
  [env.planetData.earth.orbitRadius]: solarsystem.earth.mesh,
  [env.planetData.mercury.orbitRadius]: solarsystem.mercury.mesh,
  [env.planetData.venus.orbitRadius]: solarsystem.venus.mesh,
  [env.planetData.mars.orbitRadius]: solarsystem.mars.mesh,
  [env.planetData.jupiter.orbitRadius]: solarsystem.jupiter.mesh,
  [env.planetData.saturn.orbitRadius]: solarsystem.saturn.mesh,
  [env.planetData.uranus.orbitRadius]: solarsystem.uranus.mesh,
  [env.planetData.neptune.orbitRadius]: solarsystem.neptune.mesh,
  [env.planetData.pluto.orbitRadius]: solarsystem.pluto.mesh,
};

function getTargetObject(orbitRadius) {
  orbitRadius = Math.round(orbitRadius);
  const targetObject = planetOrbitMapping[orbitRadius];
  return targetObject || null;
}

renderer.domElement.addEventListener("click", onClick);

function render() {
  const currentTime = Date.now();

  if (keypressed && isFollowing && objectToFollow) {
    const cameraRotationSpeed = ((currentTime % env.yearDuration) / 2 / env.yearDuration / 2) * 2 * Math.PI;

    const targetObject = getTargetObject(objectToFollow.object.geometry.parameters.innerRadius);

    if (targetObject) {
      const offset = targetObject === solarsystem.earth.mesh || targetObject === solarsystem.mercury.mesh || targetObject === solarsystem.venus.mesh || targetObject === solarsystem.mars.mesh || targetObject === solarsystem.pluto.mesh ? 1 : 31;

      const targetPosition = new THREE.Vector3(
        targetObject.position.x + offset * Math.cos(cameraRotationSpeed) + 1,
        targetObject.position.y + Math.cos(cameraRotationSpeed) * 2,
        targetObject.position.z + offset * Math.sin(cameraRotationSpeed) + 1
      );

      camera.position.copy(targetPosition);
      camera.lookAt(targetObject.position);
      controls.target.copy(targetObject.position);
      controls.update();
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
    for (const planet in solarsystem) {
      solarsystem[planet].orbit.material.opacity = 1;
    }
  } else {
    for (const planet in solarsystem) {
      solarsystem[planet].orbit.material.opacity = 0;
    }
  }


  solarsystem.earth.update()
  solarsystem.mercury.update()
  solarsystem.venus.update()
  solarsystem.mars.update()
  solarsystem.jupiter.update()
  solarsystem.saturn.update()
  saturnRing.update()
  solarsystem.uranus.update()
  solarsystem.neptune.update()
  solarsystem.pluto.update()
  solarsystem.moon.update()
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
