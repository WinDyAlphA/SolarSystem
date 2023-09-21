export const sunLightIntensity = 2000;
export const sunLightColor = 0xffffff;


export const yearDuration = 100000;
// Créez et ajoutez les planètes
export const planetData = {
  sun: {
    name:"sun",
    radius: 3,
    orbitRadius:0,
    texture: '.',
    rotation:1,
  },
  moon: {
    name:"moon",
    radius: 0.2,
    orbitRadius: 1,
    texture: "textures/moon/moonmap1k.jpg",
    rotation:1,
  },
  mercury: {
    name:"mercury",
    radius: 0.25,
    orbitRadius: 2.5 + 5,
    texture: "textures/mercury/mercury.jpg",
    rotation:-1,
    eccentricity: 0.20563069
  },
  venus: {
    name:"venus",
    radius: 0.5,
    orbitRadius: 5 + 5,
    texture: "textures/venus/venus.jpeg",
    rotation:-1,
    eccentricity: 0.00677323
  },
  earth: {
    name:"earth",
    radius: 1,
    orbitRadius: 7 + 5,
    texture: "textures/earth/earth8k.jpeg",
    rotation:1,
    eccentricity: 0.01671022
  },
  mars: {
    name:"mars",
    radius: 0.3,
    orbitRadius: 11 + 5,
    texture: "textures/mars/mars.jpg",
    rotation:1,
    eccentricity: 0.09341233
  },
  jupiter: {
    name:"jupiter",
    radius: 11,
    orbitRadius: 37.5 + 5,
    texture: "textures/jupiter/jupiter.jpeg",
    rotation:1,
    eccentricity: 0.04839266
  },
  saturn: {
    name:"saturn",
    radius: 9.5,
    orbitRadius: 70 + 5,
    texture: "textures/saturn/saturn.jpeg",
    rotation:1,
    eccentricity: 0.05415060
  },
  uranus: {
    name:"uranus",
    radius: 4,
    orbitRadius: 143 + 5,
    texture: "textures/uranus/uranus.jpeg",
    rotation:1,
    eccentricity: 0.04716771
  },
  neptune: {
    name:"neptune",
    radius: 3.964,
    orbitRadius: 225 + 5,
    texture: "textures/neptune/neptune.jpg",
    rotation:1,
    eccentricity: 0.00858587
  },
  pluto: {
    name:"pluto",
    radius: 2,
    orbitRadius: 300 + 5,
    texture: "textures/pluto/pluto.jpeg",
    rotation:1,
    eccentricity: 0.250
  },
};
