export const sunLightIntensity = 2000;
export const sunLightColor = 0xffffff;
export const ambientLightIntensity = 0.1;
export const ambientLightColor = 0xffffff;


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
    orbitRadius: 2,
    texture: "textures/moon/moonmap1k.jpg",
    rotation:1,
    eccentricity: 0
  },
  mercury: {
    name:"mercury",
    radius: 0.25,
    orbitRadius: 2 + 5,
    texture: "textures/mercury/mercury.jpg",
    rotation:-1,
    eccentricity: 0.20563069,
    obliquity: 0.1
  },
  venus: {
    name:"venus",
    radius: 0.5,
    orbitRadius: 5 + 5,
    texture: "textures/venus/venus.jpeg",
    rotation:-1,
    eccentricity: 0.00677323,
    obliquity: 177.4
  },
  earth: {
    name:"earth",
    radius: 1,
    orbitRadius: 7 + 5 + 5,
    texture: "textures/earth/earth8k.jpeg",
    rotation:1,
    eccentricity: 0.01671022,
    obliquity: 23.45
  },
  mars: {
    name:"mars",
    radius: 0.3,
    orbitRadius: 11 + 5 + 6,
    texture: "textures/mars/mars.jpg",
    rotation:1,
    eccentricity: 0.09341233,
    obliquity: 25.19
  },
  jupiter: {
    name:"jupiter",
    radius: 11,
    orbitRadius: 37 + 5 +15,
    texture: "textures/jupiter/jupiter.jpeg",
    rotation:1,
    eccentricity: 0.04839266,
    obliquity: 3.12
  },
  saturn: {
    name:"saturn",
    radius: 9.5,
    orbitRadius: 70 + 5+25,
    texture: "textures/saturn/saturn.jpeg",
    rotation:1,
    eccentricity: 0.05415060,
    obliquity: 26.73
  },
  uranus: {
    name:"uranus",
    radius: 4,
    orbitRadius: 143 + 5,
    texture: "textures/uranus/uranus.jpeg",
    rotation:1,
    eccentricity: 0.04716771,
    obliquity: 97.86
  },
  neptune: {
    name:"neptune",
    radius: 3.964,
    orbitRadius: 225 + 5,
    texture: "textures/neptune/neptune.jpg",
    rotation:1,
    eccentricity: 0.00858587,
    obliquity: 29.56
  },
  pluto: {
    name:"pluto",
    radius: 2,
    orbitRadius: 300 + 5,
    texture: "textures/pluto/pluto.jpeg",
    rotation:1,
    eccentricity: 0.250,
    obliquity: 119.6
  },
};
