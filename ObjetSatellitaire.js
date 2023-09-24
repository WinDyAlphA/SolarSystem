import * as THREE from "three";
import { Matrix3 } from "three";
import * as env from './const.js';
import { TextureLoader, Sprite, SpriteMaterial } from "three";

export class ObjetSatellitaire{
  constructor(planete,camera,radius, segments, material, orbitRadius, eccentricity,nom='unknow',castShadow = true, calcul = null, sensRotation = 1) {
    this.planete = planete.mesh;
    this.camera = camera;
    this.nom = nom;
    this.radius = radius;
    this.segments = segments;
    this.material = material;
    this.orbitRadius = orbitRadius;
    this.eccentricity = eccentricity;
    this.castShadow = castShadow;
    this.sensRotation = sensRotation;
    this.calcul = calcul
    // Créer la planète et stocker le mesh dans la propriété "mesh"
    this.mesh = this.createPlanet();
    
    this.orbit = this.createOrbit();

    this.clickOrbit = this.createOrbit();

    this.sprite = this.createTextSprite(this.nom, 'white', 16);
    
    this.sprite.visible = false;
    // Ajouter la planète et l'orbite à la scène
  }

  addToScene(scene){
    scene.add(this.mesh);
    scene.add(this.orbit);
    scene.add(this.clickOrbit);
    scene.add(this.sprite);
  }

  updateTextVisibility(value) {
    this.sprite.visible = value;
  }

  createTextSprite(text, color, textSize) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = `${textSize}px Arial`;
    const textWidth = context.measureText(text).width;
  
    canvas.width = textWidth;
    canvas.height = textSize;
  
    context.font = `${textSize}px Arial`;
    context.fillStyle = color;
    context.fillText(text, 0, textSize);
  
    const texture = new THREE.TextureLoader().load(canvas.toDataURL());
  
    const material = new SpriteMaterial({ map: texture });
    const sprite = new Sprite(material);
    sprite.scale.set(1, 1, 1); // Ajustez l'échelle selon vos besoins
  
    return sprite;
  }
  updateTextSize(textSprite, camera) {
    const distance = textSprite.position.distanceTo(camera.position);
    const newSize = distance/20; // Vous pouvez ajuster ce facteur selon vos besoins
  
    textSprite.scale.set(newSize, newSize, 1);
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
    const orbitGeometry = new THREE.RingGeometry(this.orbitRadius-0.2, this.orbitRadius+0.2, 180);
    const orbitMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
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
    // Mettez à jour les positions des planètes par rapport au soleil (en supposant une orbite circulaire)
    this.mesh.position.x = this.planete.position.x + this.orbitRadius * Math.cos(this.mesh.rotation.y*this.sensRotation)+this.eccentricity;
    this.mesh.position.z = this.planete.position.z + this.orbitRadius * Math.sin(this.mesh.rotation.y*this.sensRotation)-this.eccentricity;

    this.orbit.position.x = this.planete.position.x;
    this.orbit.position.z = this.planete.position.z;
    this.sprite.position.set(
        this.mesh.position.x + 1.5 + this.radius,
        this.mesh.position.y + 1.5 + this.radius, // Ajustez la position verticale
        this.mesh.position.z)
        this.updateTextSize(this.sprite, this.camera);
  }

}