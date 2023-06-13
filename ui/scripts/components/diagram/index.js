export class DiagramComponent {
    constructor(parent, isDisplay) {
        this.parent = parent;
        this.isDisplay = isDisplay;
    }

    update() {
        this.chart.render();
    }
    
    render(updater) {
        const options = {
            series: updater[1],
            chart: {
                width: 500,
                type: 'pie',
            },
            labels: updater[0],
            responsive: [{
                breakpoint: 600,
                options: {
                    chart: {
                        width: 320
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        };
        let a = document.getElementById("helper");
        a.replaceChildren();
        let chart = new ApexCharts(a, options);
        chart.render();
    }
}
