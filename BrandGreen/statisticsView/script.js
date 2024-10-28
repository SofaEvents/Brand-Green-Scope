document.addEventListener('DOMContentLoaded', function() {
    
    sketchup.xd("ready");  
});

const configChart = async (labels,dataChart) => {
    const data = {
        labels,
        datasets: [{
            label: 'Color Code',
            data: dataChart,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
        }]
    };
    const config = {
        type: 'polarArea',
        data: data,
        options: {
            responsive: true,
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: dataChart.length
                }
            }
        }
    };

    const ctx = document.getElementById('polarAreaChart').getContext('2d');
    const polarAreaChart = new Chart(ctx, config);
}

const configTable = async (matsMap,countRecycled,countObj,perCentRecycled) => {
    const dataTable = document.getElementById('dataTable');
    const conf = await getConf()
    let summaryEcoCost = 0;
    let summaryCo2 = 0;
    matsMap.forEach(item => {
        const row = document.createElement('tr');
        const element = conf.find(material => material.materialName === item.materialName);
        console.log(item)
        if (item.volume != 0 && item.ecoCost != 0 && item.co2eq != 0) {
            console.log(item)
            summaryEcoCost += item.ecoCost;
            summaryCo2 += item.co2eq;
            row.innerHTML = `
                <td style="text-align: center;">${item.materialName}</td>            
                <td style="text-align: center;">${item.volume}</td>
                <td style="text-align: center;">${item.ecoCost}</td>
                <td style="text-align: center;">${item.co2eq}</td>
            `;
            dataTable.appendChild(row);
        }      
    });
    
    const recycledTable = document.getElementById('recycledTable');
    const recycledTableRow = document.createElement('tr');
    recycledTableRow.innerHTML = `
    <td style="text-align: center;">${countObj}</td>
    <td style="text-align: center;">${countRecycled}</td>
    <td style="text-align: center;">${perCentRecycled.toFixed(2)}%</td>
    `;
    recycledTable.appendChild(recycledTableRow);
    const summaryTable = document.getElementById('summaryTable');
    const row = document.createElement('tr');
    row.innerHTML = `
    <td style="text-align: center;">${summaryEcoCost.toFixed(2)}</td>
    <td style="text-align: center;">${summaryCo2.toFixed(2)}</td>
    `;
    summaryTable.appendChild(row);
}

const loadData = async (chartData, tableData,countRecycled,countObj) => {
  //remplace all => to :
  chartData = chartData.replace(/=>/g, ":");
  tableData = tableData.replace(/=>/g, ":");

  // Convertir la cadena JSON a un objeto JavaScript
  const cC_Obj = JSON.parse(chartData);
  const mats_Obj = JSON.parse(tableData);  
  // Convertir el objeto JavaScript a un Map
  const cCMap = new Map(Object.entries(cC_Obj));
  const matsMap = new Map(Object.entries(mats_Obj));  
  const perCentRecycled = (countRecycled * 100) / countObj;
  // Obtener las claves y los valores del Map
  let labels = [];
  let dataChart = [];
  cCMap.forEach((value, key) => {
    labels.push(key);
    dataChart.push(value);
  });  
  configChart(labels, dataChart);
  configTable(matsMap,countRecycled,countObj,perCentRecycled)
};

async function exportToPDF() {
  const btn = document.getElementById("btnExp");
  btn.hidden = true;
  let opt = {
    filename: "report.pdf",
    enableLinks: true,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 8,
      useCORS: true,
      width: 800,
      letterRendering: true,
    },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };
  html2pdf().set(opt).from(document.getElementById("container")).save();
  setInterval(() => {
    btn.hidden = false;
  }, 1000);
}