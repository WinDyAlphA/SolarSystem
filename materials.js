import * as THREE from 'three';
import * as env from './const.js';


const textureLoader = new THREE.TextureLoader();

// textureLoader
const video = document.createElement('video');
video.src = 'textures/sun/sunvid.mov';
video.loop = true; // La vidéo boucle en continu
video.muted = true; // Activez le mode muet pour éviter la lecture du son
video.play(); // Commencez la lecture de la vidéo
const videoTexture = new THREE.VideoTexture(video);
videoTexture.minFilter = THREE.LinearFilter; // Réglez le filtrage pour une meilleure qualité
videoTexture.magFilter = THREE.LinearFilter;


export const background = new THREE.MeshBasicMaterial({
    map: textureLoader.load("textures/starmap_8k.jpeg"),
    side: THREE.BackSide,
  });
export const sun = new THREE.MeshBasicMaterial({
    map: textureLoader.load("textures/sun/sunmap.jpg"),
  });
export const earth = new THREE.MeshPhongMaterial({
    // Utilisation de MeshPhongMaterial pour permettre les ombres
    map: textureLoader.load(env.planetData.earth.texture),
    normalMap: textureLoader.load('textures/earth/8knm.jpg'),
    specularMap: textureLoader.load('textures/earth/8kspm.jpg'),
  });