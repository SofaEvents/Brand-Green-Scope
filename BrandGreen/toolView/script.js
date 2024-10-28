let conf = [];
// Obtener el modal
var modal = document.getElementById("error-modal");


// Obtener el elemento span que cierra el modal
var span = document.getElementsByClassName("close")[0];
const loadModal = async () => {
  // Cuando el usuario hace clic en <span> (x), se oculta el modal
  span.onclick = function () {
    modal.style.display = "none";
  };

  // Cuando el usuario hace clic fuera del modal, también se oculta
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    
      
    }
  };
};


const showModal = async (msg) => {
  modal.style.display = "block";
  console.log(msg)
  var err_msg = document.getElementById("error-message");
  err_msg.innerText = msg;
}

const getConf = async () => {
  try {
    conf = await (await fetch("../archivo.json")).json();
    console.log(conf);
  } catch (error) {
    sketchup.error("Error al obtener el archivo.json");
  }
};
const btnApply = async () => {
  document.querySelectorAll(".apply-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const index = event.currentTarget.getAttribute("data-index");
      const tagname = conf[index].materialName;
      const material = conf[index].material;
      sketchup.applyTag(tagname, index,material);
    });
  });
};
const btnfind = async () => {
  document.querySelectorAll(".find-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const index = event.currentTarget.getAttribute("data-index");
      const tagname = conf[index].materialName;
      const material = conf[index].material;
      sketchup.findTag(tagname);
    });
  });
};
const updateTable = async (data = conf) => {
  const tableBody = document.querySelector("#materiales-table tbody");
  tableBody.innerHTML = "";
  if (data[0].materialName == undefined) {
    return;
  }
  data.forEach((material, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>
            <button class="apply-btn" data-index="${material.id}" title="Apply ${material.materialName} material"><span>${applyIcon}</span></button>                            
        </td>
        <td>${material.materialName}</td>         
        <td>           
          <button class="find-btn" data-index="${material.id}" title="Find ${material.materialName} material"><span>${searchIcon}</span></button>               
        </td> 
        `;
    tableBody.appendChild(row);
  });
  btnApply();
  btnfind();
};

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

const recycleTable = async ()=>{
  const tableBody = document.querySelector("#recycle-table tbody");
  tableBody.innerHTML = "";
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>
          <button class="recycle-btn" style="margin-left: -11px;" title="Assign Recycled Object"><span >${recycleIcon}</span></button>               
        </td>
        <td>Assign Recycled Object</td>          
        `;
    tableBody.appendChild(row);
    btnAssignRecycled();
}

const btnAssignRecycled = async ()=>{
  document.querySelectorAll(".recycle-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      sketchup.assignRecycled();
    });
  });
}

const init = async () => {
  await getConf();
  loadModal();
  recycleTable();
  searchMaterial();
  updateTable();
};

init();

