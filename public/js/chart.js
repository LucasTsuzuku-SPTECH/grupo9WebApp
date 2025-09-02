  const ctx = document.getElementById('metrica-barra-1').getContext('2d');

    const graficoBarras = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['xxx', 'xxx', 'xxx', 'xxx', 'xxx'],
        datasets: [{
          label: 'Gasto das máquinas',
          data: [1, 2, 1, 5, 3],
          backgroundColor: '#123065',
          borderColor: '#123065',
          borderWidth: 1,
          borderRadius: 5,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          title: {
            display: true,
            font: {
              size: 18
            }
          }
        },
        scales: {
            x: {
                grid: {
                display: false  // esconde as linhas verticais
            }},
          y: {
            grid: {
                display: false  // esconde as linhas horizontais
            },
        }
        }
      }
    });