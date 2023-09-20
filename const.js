export const sunLightIntensity = 2000;
export const sunLightColor = 0xffffff;


export const yearDuration = 10000;
// Créez et ajoutez les planètes
export const planetData = {
  moon: {
    radius: 0.2,
    orbitRadius: 1,
    texture: "textures/moon/moonmap1k.jpg",
  },
  mercury: {
    radius: 0.25,
    orbitRadius: 2.5 + 5,
    texture: "textures/mercury/mercury.jpg",
  },
  venus: {
    radius: 0.5,
    orbitRadius: 5 + 5,
    texture: "textures/venus/venus.jpeg",
  },
  earth: {
    radius: 1,
    orbitRadius: 7 + 5,
    texture: "textures/earth/earth8k.jpeg",
  },
  mars: {
    radius: 0.3,
    orbitRadius: 11 + 5,
    texture: "textures/mars/mars.jpg",
  },
  jupiter: {
    radius: 11,
    orbitRadius: 37.5 + 5,
    texture: "textures/jupiter/jupiter.jpeg",
  },
  saturn: {
    radius: 9.5,
    orbitRadius: 70 + 5,
    texture: "textures/saturn/saturn.jpeg",
  },
  uranus: {
    radius: 4,
    orbitRadius: 143 + 5,
    texture: "textures/uranus/uranus.jpeg",
  },
  neptune: {
    radius: 3.964,
    orbitRadius: 225 + 5,
    texture: "textures/neptune/neptune.jpg",
  },
  pluto: {
    radius: 2,
    orbitRadius: 300 + 5,
    texture: "textures/pluto/pluto.jpeg",
  },
};
