const squareMeterToVolume = (area,tickness,value) =>{    
    const volume = (area * (tickness / 1000)) 
    const eVol = value / volume;    
    return eVol.toFixed(2);
}

const getConf = async () => {
  try {
    const conf = await (await fetch("../archivo.json")).json();
    return conf;
  } catch (error) {
    sketchup.error("Error al obtener el archivo.json");
  }
};
