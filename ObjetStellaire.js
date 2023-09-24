import * as THREE from "three";
import { Matrix3 } from "three";
import * as env from './const.js';

export class ObjetStellaire{
  constructor(radius, segments, material, orbitRadius, eccentricity, obliquity = 0, castShadow = true, calcul = null, sensRotation = 1) {

    this.radius = radius;
    this.segments = segments;
    this.material = material;
    this.orbitRadius = orbitRadius;
    this.eccentricity = eccentricity;
    this.castShadow = castShadow;
    this.sensRotation = sensRotation;
    this.calcul = calcul

    this.obliquity = obliquity;
    // Créer la planète et stocker le mesh dans la propriété "mesh"
    this.mesh = this.createPlanet();
    
    this.orbit = this.createOrbit();

    this.clickOrbit = this.createClickableOrbit();
    
    // Ajouter la planète et l'orbite à la scène
  }

  addToScene(scene){
    scene.add(this.mesh);
    scene.add(this.orbit);
    scene.add(this.clickOrbit);
  }

  

  createPlanet() {
    const geometry = new THREE.SphereGeometry(this.radius, this.segments, this.segments);
    if (typeof this.material == 'string'){
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load(this.material);
      const materialOptions = new THREE.MeshStandardMaterial({
        map: texture,
      });
      const mesh = new THREE.Mesh(geometry, materialOptions);
      mesh.castShadow = this.castShadow; // Activer ou désactiver l'ombre en fonction du paramètre
      mesh.receiveShadow = this.castShadow;
      
      return mesh;
    }
    else {
      const materialOptions = this.material
      const mesh = new THREE.Mesh(geometry, materialOptions);
      mesh.castShadow = this.castShadow; // Activer ou désactiver l'ombre en fonction du paramètre
      mesh.receiveShadow = this.castShadow;
      return mesh;
    }
    
  }

  createOrbit() {
    const orbitGeometry = new THREE.RingGeometry(this.orbitRadius, this.orbitRadius, 180);
    const orbitMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
    });

    const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);

    orbitLine.rotation.x = Math.PI / 2;
    orbitLine.isOrbit = true; // Marquer l'objet comme une orbite
    return orbitLine;
  }

  createClickableOrbit() {
    const orbitGeometry = new THREE.RingGeometry(this.orbitRadius-0.4, this.orbitRadius+0.4, 180);
    const orbitMaterial = new THREE.LineBasicMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0,
    });
  
    const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
    
    orbitLine.rotation.x = Math.PI / 2;
    orbitLine.isOrbit = true; // Marquer l'objet comme une orbite
    orbitLine.isClickable = true;
    return orbitLine;
  }


  update() {
    const currentTime = Date.now();
    const yearDuration = this.calcul ? env.yearDuration * this.calcul : env.yearDuration;

    this.mesh.rotation.y = ((currentTime % yearDuration) / yearDuration) * 2 * Math.PI;
    this.mesh.rotation.x = (this.orbitRadius / 10) * Math.sin(this.mesh.rotation.y * this.sensRotation) * (Math.PI / 180) * this.obliquity;

    // Mettez à jour les positions des planètes par rapport au soleil (en supposant une orbite circulaire)
    this.mesh.position.x = this.orbitRadius * Math.cos(this.mesh.rotation.y*this.sensRotation)+this.eccentricity;
    this.mesh.position.z = this.orbitRadius * Math.sin(this.mesh.rotation.y*this.sensRotation)-this.eccentricity;
  }
}