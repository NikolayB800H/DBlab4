export class DiagramComponent {
    constructor(parent, isDisplay) {
        this.parent = parent;
        this.isDisplay = isDisplay;
    }

    getHTML() {
        return (
            `
            <form id="chart" class="box"></form>
            `
        )
    }
    
    render() {
        const html = this.getHTML()
        this.parent.body.insertAdjacentHTML('beforeend', html)
        const options = {
            series: [1, 2, 3, 1, 1],
            chart: {
            width: 380,
            type: 'pie',
          },
          labels: ['Клиент:1', 'Клиент:2', 'Клиент:3', 'Клиент:4', 'Клиент:5'],
          responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: 'bottom'
              }
            }
          }]
          };
        
          let chart = new ApexCharts(/*document.querySelector("#hello-page")*/this.parent.body, options);
          chart.render();
    }
}
