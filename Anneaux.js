import * as THREE from "three";

import * as env from './const.js';
import { TextureLoader } from "three";

export class Anneaux {
    constructor(planete, material, ecartAnneaux, tailleAnneaux, inclinaison = 0) {
      this.planete = planete;
      this.material = material;
      this.ecartAnneaux = ecartAnneaux;
      this.tailleAnneaux = tailleAnneaux;
      this.inclinaison = inclinaison;
      this.inclinationRadians = (this.inclinaison / 180) * Math.PI;
      this.mesh = this.CreateRing();
    }
  
    CreateRing() {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(
          this.planete.radius + this.ecartAnneaux,
          this.planete.radius + this.ecartAnneaux + this.tailleAnneaux,
          32
        ),
        this.material
      );
      ring.castShadow = true;
      ring.receiveShadow = true;
      ring.rotation.x = this.inclinationRadians;
      return ring;
    }
  
    addToScene(scene) {
      scene.add(this.mesh);
    }
  
    update() {
      this.mesh.position.x = this.planete.mesh.position.x;
      this.mesh.position.y = this.planete.mesh.position.y;
      this.mesh.position.z = this.planete.mesh.position.z;
    }
  }