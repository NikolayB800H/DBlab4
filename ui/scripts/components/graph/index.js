export class GraphComponent {
    constructor(parent, isDisplay) {
        this.parent = parent;
        this.isDisplay = isDisplay;
    }

    update() {
        this.chart.render();
    }
    
    render(updater) {
        const options = {
                series: [{
                data: updater[1]
            }],
                chart: {
                height: 350,
                type: 'bar',
            },
            plotOptions: {
                bar: {
                borderRadius: 10,
                dataLabels: {
                    position: 'top', // top, center, bottom
                },
                }
            },
            dataLabels: {
                enabled: true,
                style: {
                fontSize: '36px',
                colors: ["#304758"]
                }
            },
            
            xaxis: {
                categories: updater[0],
                position: 'top',
                axisBorder: {
                show: false
                },
                axisTicks: {
                show: false
                },
                crosshairs: {
                fill: {
                    type: 'gradient',
                    gradient: {
                    colorFrom: '#D8E3F0',
                    colorTo: '#BED1E6',
                    stops: [0, 100],
                    opacityFrom: 0.4,
                    opacityTo: 0.5,
                    }
                }
                },
                tooltip: {
                enabled: true,
                }
            },
            yaxis: {
                axisBorder: {
                show: false
                },
                axisTicks: {
                show: false,
                },
                labels: {
                show: false,
                }
            
            },
        };
        let a = document.getElementById("helper");
        a.replaceChildren();
        a.appendChild(document.createElement("br"))
        let chart = new ApexCharts(a, options);
        chart.render();
    }
}
