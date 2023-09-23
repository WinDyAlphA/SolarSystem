import * as THREE from "three";

import * as env from './const.js';
import { TextureLoader } from "three";

export class Anneaux{
  constructor(planete, material, ecartAnneaux, tailleAnneaux, inclinaison = 0 ) {
    this.planete = planete;
    this.material = material;
    this.ecartAnneaux = ecartAnneaux;
    this.tailleAnneaux = tailleAnneaux;
    this.inclinaison = inclinaison;
    this.inclinationRadians = (this.inclinaison / 180) * Math.PI;
    this.mesh = this.CreateRing();

  } 

  CreateRing(){
    const ring = new THREE.Mesh(
        new THREE.RingGeometry(
          this.planete.radius + this.ecartAnneaux,
          this.planete.radius + this.ecartAnneaux + this.tailleAnneaux,
          32
        ),
        this.material
      );
      ring.castShadow = true;  // Activer ou désactiver l'ombre en fonction du paramètre
      ring.receiveShadow = true;
      ring.rotation.x = this.inclinationRadians;
      return ring;
  }

  addToScene(scene){
    scene.add(this.mesh);
  }


  update() {
    // Convertissez l'inclinaison en radians
    this.mesh.position.x = this.planete.mesh.position.x;
    this.mesh.position.y = this.planete.mesh.position.y;
    this.mesh.position.z = this.planete.mesh.position.z;


// Appliquez la rotation aux anneaux de Saturne (assurez-vous que l'objet des anneaux est un enfant de l'objet Saturne)


  }
}