let ascending = true; // Variable para controlar el orden ascendente/descendente
let conf = [];

let materialsLibrary = []

const btnUpdate = async () => {
  document.querySelectorAll(".update-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const index = event.currentTarget.getAttribute("data-index");      
      const material = conf.find((m) => m.id == index);
      // Setear los valores actuales en el modal
      document.getElementById("key").value = index;
      document.getElementById("material").value = material.materialName;
      document.getElementById("material-real").value = material.material;
      document.getElementById("thickness").value = material.thickness;
      document.getElementById("color-code").value = material.colorCode;
      document.getElementById("eco-cost").value = material.ecoCost;
      document.getElementById("co2eq").value = material.cO2;
      toggleInputStatus("material", false);
      toggleInputStatus("material-real", false);
      toggleInputStatus("thickness", false);
      toggleInputStatus("color-code", false);
      toggleInputStatus("eco-cost", false);
      toggleInputStatus("co2eq", false);
      // Mostrar el modal
      const modal = document.getElementById("myModal");
      modal.style.display = "block";

      // Función para cerrar el modal al hacer clic en el botón de cerrar
      const closeModalButton = document.querySelector(".modal-content .close");
      closeModalButton.addEventListener("click", () => {
        modal.style.display = "none";
      });
    });
  });
};
const addMaterial = async () => {
  document.getElementById("add-btn").addEventListener("click", () => {
    document.getElementById("key").value = -1;
    const material = document.getElementById("material");
    material.value = "";
    toggleInputStatus("material", true);
    const matReal = document.getElementById("material-real");
    matReal.value = "";
    toggleInputStatus("material-real", true);
    const thickness = document.getElementById("thickness");
    thickness.value = "";
    toggleInputStatus("thickness", true);
    const colorCode = document.getElementById("color-code");
    colorCode.value = "";
    toggleInputStatus("color-code", true);
    const ecoCost = document.getElementById("eco-cost");
    ecoCost.value = "";
    toggleInputStatus("eco-cost", true);
    const co2eq = document.getElementById("co2eq");
    co2eq.value = "";
    toggleInputStatus("co2eq", true);
    const modal = document.getElementById("myModal");
    modal.style.display = "block";

    // Función para cerrar el modal al hacer clic en el botón de cerrar
    const closeModalButton = document.querySelector(".modal-content .close");
    closeModalButton.addEventListener("click", () => {
      modal.style.display = "none";
    });
  });
};
function updateMaterial() {
  const id = document.getElementById("key").value;
  const newMaterial = document.getElementById("material").value;
  const newMaterialName = document.getElementById("material-real").value;
  const newThickness = document.getElementById("thickness").value;
  const newColor = document.getElementById("color-code").value;
  const newEcoCost = document.getElementById("eco-cost").value;
  const newCO2eq = document.getElementById("co2eq").value;
  if (id == -1) {
    const lastId = obtenerMayorId(conf);
    console.log("add", lastId);
    conf.push({
      id: lastId + 1,
      materialName: newMaterial,
      material: newMaterialName,
      thickness: parseFloat(newThickness),
      colorCode: newColor,
      ecoCost: newEcoCost,
      cO2: newCO2eq,
    });
    sketchup.matAdded(conf[conf.length - 1]);
  } else {
    const index = conf.findIndex((m) => m.id == id);
    console.log("update", index);
    conf[index] = {
      id,
      materialName: newMaterial,
      material: newMaterialName,
      thickness: parseFloat(newThickness),
      colorCode: newColor,
      ecoCost: newEcoCost,
      cO2: newCO2eq,
    };
    sketchup.matUpdate(conf[index], id);
  }

  // Actualizar la tabla
  updateTable();

  // Llamar a la función de actualización en SketchUp (simulado)

  // Cerrar el modal
  const modal = document.getElementById("myModal");
  modal.style.display = "none";
}

const btnRemove = async () => {
  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const id = event.currentTarget.getAttribute("data-index");
      const index = conf.findIndex((m) => m.id == id);
      conf.splice(index, 1);
      updateTable();
      sketchup.matRemoved(id);
    });
  });
};

const updateTable = async (data = conf) => {
  const tableBody = document.querySelector("#materiales-table tbody");
  tableBody.innerHTML = "";
  data.forEach((material, index) => {
    const row = document.createElement("tr");
    console.log("Index", material.id);
    row.innerHTML = `
            <td>${material.materialName}</td>
            <td>${material.material}</td>
            <td>${material.ecoCost} / ${squareMeterToVolume(
      1,
      material.thickness,
      material.ecoCost
    )}</td>
            <td>${material.cO2} / ${squareMeterToVolume(
      1,
      material.thickness,
      material.cO2
    )}</td>
            <td ><span class="color-badge" >${material.colorCode}</span></td>
            <td>${material.thickness}</td>
            <td>
                <button class="update-btn" data-index="${
                  material.id
                }">${updateIcon}</button>
                <button class="delete-btn" data-index="${
                  material.id
                }">${deleteIcon}</button>
            </td>
        `;
    tableBody.appendChild(row);
  });
  btnUpdate();
  btnRemove();
};

/*const addMaterial = async () => {
  document.getElementById('add-btn').addEventListener('click', () => {
    const newRMaterial = prompt("Enter Real Material:");
    const newMaterialName = prompt("Enter Material Name:");
    const newGrosor = prompt("Enter thickness (mm):");
    const newColor = prompt("Enter Color Code:");
    const newEcoCost = prompt("Enter EcoCost:");
    const newCO2eq = prompt("Enter CO2eq:");

    if (newMaterial !== null && newGrosor !== null && newColor !== null && newEcoCost !== null && newCO2eq !== null) {
      conf.push({
          id: conf.length,
          materialName: newMaterial,
          material:newMaterialName,
          thickness: parseFloat(newGrosor),
          colorCode: newColor,
          ecoCost: newEcoCost,
          cO2: newCO2eq
      });
      sketchup.matAdded(conf[conf.length - 1]);
      updateTable();
    }
  });
}
*/
// search material
const searchMaterial = async () => {
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", () => {
    console.log(searchInput.value);
    const searchTerm = searchInput.value?.toLowerCase();
    const filteredMaterials = conf.filter((material) =>
      material.materialName?.toLowerCase().includes(searchTerm)
    );
    updateTable(filteredMaterials);
  });
};

const init = async () => {
  conf = await getConf();
  orderConf()
  addMaterial();
  searchMaterial();
  updateTable();
};

init();

var modal = document.getElementById("myModal");
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];

function toggleInput(id) {
  var input = document.getElementById(id);
  var button = input.nextElementSibling;
  input.disabled = !input.disabled;
  if (!input.disabled) {
    button.style.backgroundColor = "red";
    button.textContent = "Desactivar";
  } else {
    button.style.backgroundColor = "";
    button.textContent = "Activar";
  }
}
function toggleInputStatus(id, status) {
  var input = document.getElementById(id);
  var button = input.nextElementSibling;
  input.disabled = !status;
  if (status == true) {
    button.style.backgroundColor = "red";
    button.textContent = "Desactivar";
  } else {
    button.style.backgroundColor = "";
    button.textContent = "Activar";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const materialHeader = document.getElementById("material-header");
  const materialSort = document.getElementById("material-sort");
  materialSort.textContent = ascending ? " ▲" : " ▼";
  materialHeader.addEventListener("click", function () {
    // Cambiar el ícono o texto para indicar el estado de ordenamiento
    materialSort.textContent = ascending ? " ▲" : " ▼";

    // Lógica para ordenar la tabla (puedes adaptar la función sortTable del ejemplo anterior)
    orderConf();
    updateTable();

    // Invertir el estado de ordenamiento    
  });
});

const orderConf = () => {
  conf.sort(function (a, b) {
    // Convertir ambos nombres a minúsculas para asegurar una comparación sin distinción de mayúsculas
    const nombreA = a.materialName.toLowerCase();
    const nombreB = b.materialName.toLowerCase();
    if (ascending) {
      // Comparar los nombres
      if (nombreA < nombreB) {
        return -1; // a debe venir antes que b
      } else if (nombreA > nombreB) {
        return 1; // b debe venir antes que a
      } else {
        return 0; // a y b son iguales en cuanto a orden
      }
    } else {
      // Comparar los nombres
      if (nombreA > nombreB) {
        return -1; // a debe venir antes que b
      } else if (nombreA < nombreB) {
        return 1; // b debe venir antes que a
      } else {
        return 0; // a y b son iguales en cuanto a orden
      }
    }
  });
    ascending = !ascending;
};

// Función en JavaScript para manejar los materiales recibidos
function setMats(matsJson) {
   materialsLibrary = matsJson
   llenarSelect();
    // Aquí podrías manipular el DOM de tu diálogo para mostrar los materiales, etc.
}

const llenarSelect = () => {
  const select = document.getElementById("material-real");

  // Limpiar opciones existentes (por si acaso)
  select.innerHTML = "";

  // Crear y añadir las opciones al select
  materialsLibrary.forEach(material => {
      const option = document.createElement("option");
      option.text = material;
      option.value = material; // Opcional: asignar un valor diferente si es necesario
      select.appendChild(option);
  });
}


function obtenerMayorId(lista) {
  // Inicializar una variable para almacenar el máximo id encontrado
  let maxId = 0;

  // Iterar sobre la lista para encontrar el máximo id
  lista.forEach(objeto => {
      if (objeto.id > maxId) {
          maxId = objeto.id;
      }
  });

  return maxId;
}