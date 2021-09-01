let dataSource = 'https://raw.githubusercontent.com/CarlosMunozDiazCSIC/viz_maternidad_fecundidad/main/data/data_nac_fec.csv';
let tooltip = d3.select('#tooltip');
//Variables para visualización
let innerData = [], currentData = [], ccaaFirstData = [], ccaaSecondData = [],
    chartBlock = d3.select('#chart'), chart, x_c, x_cAxis, y_c, y_cAxis;
let line, path_1, length_1, path_2, length_2;
let enr_color_1 = '#296565'; //Para círculo del año 2020 > Para resto de círculos (2013, 2015, 2017 y 2019, sólo contorno)
let enr_color_2 = '#e46b4f'; //Para círculo del año 2011

initChart();

function initChart() { //Carga de datos y muestra por defecto de España sin comparativa
    d3.text(dataSource, function (error, d) {
        if (error) throw error;

        let dsv = d3.dsvFormat(';');
        let data = dsv.parse(d);

        data = data.map(function(d){
            return {
                anio: d.anio,
                ccaa: d.ccaa_2,
                ccaa_searchable: d.ccaa_2.replace(/\s/g, '-').replace(/[\(\)\,]/g, '').toLowerCase(),
                nacionalidad: d.nacionalidad,
                edad_media: +d.edad_media,
                ind_fecundidad: +d.ind_fecundidad
            }           
        });

        innerData = [...data];

        console.log(innerData);

        //Filtramos los datos de España por defecto y la opción de 'ambas nacionalidades'
        let nacData = innerData.filter(function(item){if(item.ccaa_searchable == 'nacional' && item.nacionalidad == 'ambas'){ return item;}});
        currentData = [...nacData.reverse()];

        //Desarrollo del gráfico > Debemos hacer muchas variables genéricas para luego actualizar el gráfico
        let margin = {top: 5, right: 22.5, bottom: 25, left: 22.5};
        let width = parseInt(chartBlock.style('width')) - margin.left - margin.right,
            height = parseInt(chartBlock.style('height')) - margin.top - margin.bottom;

        chart = chartBlock
            .append('svg')
            .lower()
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        //Eje X
        x_c = d3.scaleLinear()
            .domain([0.5,7])
            .range([0, width])
            .nice();

        x_cAxis = function(g){
            g.call(d3.axisBottom(x_c).ticks(5).tickFormat(function(d) { return numberWithCommas2(d); }))
            g.call(function(g){
                g.selectAll('.tick line')
                    .attr('y1', '0%')
                    .attr('y2', `-${height}`)
            })
            g.call(function(g){g.select('.domain').remove()});
        }

        chart.append("g")
            .attr("transform", "translate(0," + height + ")")
            .attr('class','x_c-axis')
            .call(x_cAxis);

        //Eje Y
        y_c = d3.scaleLinear()
            .domain([26,34])
            .range([height,0])
            .nice();
    
        y_cAxis = function(svg){
            svg.call(d3.axisLeft(y_c).ticks(5).tickFormat(function(d) { return numberWithCommas2(d); }))
            svg.call(function(g){
                g.selectAll('.tick line')
                    .attr('class', function(d,i) {
                        if (d == 0) {
                            return 'line-special';
                        }
                    })
                    .attr("x1", `0`)
                    .attr("x2", `${width}`)
            })
            svg.call(function(g){g.select('.domain').remove()})
        }        
        
        chart.append("g")
            .attr('class','y_c-axis')
            .call(y_cAxis);

        //Línea
        line = d3.line()
            .x(function(d) { return x_c(d.ind_fecundidad); })
            .y(function(d) { return y_c(d.edad_media); })
            .curve(d3.curveMonotoneX);

        path_1 = chart.append("path")
            .data([currentData])
            .attr("class", `line-chart_1`)
            .attr("fill", "none")
            .attr("stroke", `${enr_color_1}`)
            .attr("stroke-width", '1.5px')
            .attr("d", line);

        length_1 = path_1.node().getTotalLength();

        path_1.attr("stroke-dasharray", length_1 + " " + length_1)
            .attr("stroke-dashoffset", length_1)
            .transition()
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0)
            .duration(3000);

        chart.selectAll('circles')
            .data(currentData)
            .enter()
            .append('circle')
            .attr('class', `circle-chart_2_1`)
            .attr("r", function(d,i){
                if(i == 0 || i == currentData.length -1) {
                    return '5'
                } else {
                    return '2.5';
                }
            })
            .attr("cx", function(d) { return x_c(d.ind_fecundidad); })
            .attr("cy", function(d) { return y_c(d.edad_media); })
            .style("fill", function(d,i) { 
                if(i == 0) {
                    return `${enr_color_2}`;
                } else if (i == currentData.length - 1) {
                    return `${enr_color_1}`;
                } else {
                    return '#fff';
                }
            })
            .style("stroke", function(d,i) {
                if(i == 0 || i == currentData.length -1) {
                    return 'none'
                } else {
                    return `${enr_color_1}`;
                }
            })
            .style("stroke-width", function(d,i) {
                if(i == 0 || i == currentData.length -1) {
                    return '0'
                } else {
                    return `0.5`;
                }
            })
            .style('opacity', '0')
            .on('mouseenter mousedown mousemove mouseover', function(d, i, e) {                
                //Texto
                let html = `<p class="chart__tooltip--title">${d.ccaa} (${d.anio})</p>
                <p class="chart__tooltip--text">Edad media a la maternidad: ${numberWithCommas(d.edad_media.toFixed(1))} años</p>
                <p class="chart__tooltip--text">Índice de fecundidad: ${numberWithCommas(d.ind_fecundidad.toFixed(1))}</p>`;

                tooltip.html(html);

                //Tooltip
                positionTooltip(window.event, tooltip);
                getInTooltip(tooltip);               
            })
            .on('mouseout', function(d, i, e) {
                //Quitamos el tooltip
                getOutTooltip(tooltip);                
            })
            .transition()
            .delay(function(d,i) { return i * (3000 / currentData.length - 1)})
            .style('opacity', '1');
    });
}

function updateChart(ccaa, ccaa2, nac) {
    //Filtrar los datos para quedarse únicamente con los que nos interesan > CCAA Y NACIONALIDAD
    let ccaaData = innerData.filter(function(item) {
        if ((item.ccaa_searchable == ccaa || item.ccaa_searchable == ccaa2) && (item.nacionalidad == nac) && (item.edad_media != 0)) {
            return item;
        }
    });

    currentData = ccaaData.reverse();

    console.log(currentData, ccaa, ccaa2);

    ccaaFirstData = currentData.filter(function(item) {
        if (item.ccaa_searchable == ccaa) {
            return item;
        }
    });

    if(ccaa2 != 'null') {
        ccaaSecondData = currentData.filter(function(item) {
            if (item.ccaa_searchable == ccaa2) {
                return item;
            }
        });
    } else {
        ccaaSecondData = [];
    }

    //Modificar línea y círculos > Puede que haya dos líneas
    animateChart();
}

function animateChart() {
    //Opción de tener dos líneas
    path_1 = chart.select(".line-chart_1")
        .data([ccaaFirstData])
        .attr("class", `line-chart_1`)
        .attr("fill", "none")
        .attr("stroke", `${enr_color_1}`)
        .attr("stroke-width", '1.5px')
        .attr("d", line);

    length_1 = path_1.node().getTotalLength();

    path_1.attr("stroke-dasharray", length_1 + " " + length_1)
        .attr("stroke-dashoffset", length_1)
        .transition()
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0)
        .duration(3000);

    chart
        .selectAll('.circle-chart_2_1')
        .remove();

    chart.selectAll('circles')
        .data(ccaaFirstData)
        .enter()
        .append('circle')
        .attr('class', `circle-chart_2_1`)  
        .attr("r", function(d,i){
            if(i == 0 || i == ccaaFirstData.length -1) {
                return '5'
            } else {
                return '2.5';
            }
        })
        .attr("cx", function(d) { return x_c(d.ind_fecundidad); })
        .attr("cy", function(d) { return y_c(d.edad_media); })
        .style("fill", function(d,i) {
            if(i == 0) {
                return `${enr_color_2}`;
            } else if (i == ccaaFirstData.length - 1) {
                return `${enr_color_1}`;
            } else {
                return '#fff';
            }
        })
        .style("stroke", function(d,i) {
            if(i == 0 || i == ccaaFirstData.length -1) {
                return 'none'
            } else {
                return `${enr_color_1}`;
            }
        })
        .style("stroke-width", function(d,i) {
            if(i == 0 || i == ccaaFirstData.length -1) {
                return '0'
            } else {
                return `0.5`;
            }
        })
        .style('opacity', '0')
        .on('mouseenter mousedown mousemove mouseover', function(d, i, e) {                
            //Texto
            let html = `<p class="chart__tooltip--title">${d.ccaa} (${d.anio})</p>
            <p class="chart__tooltip--text">Edad media a la maternidad: ${numberWithCommas(d.edad_media.toFixed(1))} años</p>
            <p class="chart__tooltip--text">Índice de fecundidad: ${numberWithCommas(d.ind_fecundidad.toFixed(1))}</p>`;

            tooltip.html(html);

            //Tooltip
            positionTooltip(window.event, tooltip);
            getInTooltip(tooltip);               
        })
        .on('mouseout', function(d, i, e) {
            //Quitamos el tooltip
            getOutTooltip(tooltip);                
        })
        .transition()
        .delay(function(d,i) { return i * (3000 / ccaaFirstData.length )})
        .style('opacity', '1');
    
    if(!path_2) {
        initSecondPath(ccaaSecondData);
    } else {
        path_2 = chart.select(".line-chart_2")
            .data([ccaaSecondData])
            .attr("class", `line-chart_2`)
            .attr("fill", "none")
            .attr("stroke", `${enr_color_2}`)
            .attr("stroke-width", '1.5px')
            .attr("d", line);

        length_2 = path_2.node().getTotalLength();

        path_2.attr("stroke-dasharray", length_2 + " " + length_2)
            .attr("stroke-dashoffset", length_2)
            .transition()
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0)
            .duration(3000);

        chart
            .selectAll('.circle-chart_2_2')
            .remove();
        
        chart.selectAll('circles')
            .data(ccaaSecondData)
            .enter()
            .append('circle')
            .attr('class', `circle-chart_2_2`)        
            .attr("r", function(d,i){
                if(i == 0 || i == ccaaSecondData.length -1) {
                    return '5'
                } else {
                    return '2.5';
                }
            })
            .attr("cx", function(d) { return x_c(d.ind_fecundidad); })
            .attr("cy", function(d) { return y_c(d.edad_media); })
            .style("fill", function(d,i) { 
                if(i == 0) {
                    return `${enr_color_2}`;
                } else if (i == ccaaSecondData.length - 1) {
                    return `${enr_color_1}`;
                } else {
                    return '#fff';
                }
            })
            .style("stroke", function(d,i) {
                if(i == 0 || i == ccaaSecondData.length - 1) {
                    return 'none'
                } else {
                    return `${enr_color_2}`;
                }
            })
            .style("stroke-width", function(d,i) {
                if(i == 0 || i == ccaaSecondData.length - 1) {
                    return '0'
                } else {
                    return `0.5`;
                }
            })
            .style('opacity', '0')
            .on('mouseenter mousedown mousemove mouseover', function(d, i, e) {                
                //Texto
                let html = `<p class="chart__tooltip--title">${d.ccaa} (${d.anio})</p>
                <p class="chart__tooltip--text">Edad media a la maternidad: ${numberWithCommas(d.edad_media.toFixed(1))} años</p>
                <p class="chart__tooltip--text">Índice de fecundidad: ${numberWithCommas(d.ind_fecundidad.toFixed(1))}</p>`;

                tooltip.html(html);

                //Tooltip
                positionTooltip(window.event, tooltip);
                getInTooltip(tooltip);               
            })
            .on('mouseout', function(d, i, e) {
                //Quitamos el tooltip
                getOutTooltip(tooltip);                
            })
            .transition()
            .delay(function(d,i) { return i * (3000 / ccaaSecondData.length )})
            .style('opacity', '1');
    }   
}

document.getElementById('replay').addEventListener('click', function() {
    updateChart(currentSelected, currentSelected_2, currentSelectedNac);
});

function initSecondPath(data) {
    path_2 = chart.append("path")
        .data([data])
        .attr("class", `line-chart_2`)
        .attr("fill", "none")
        .attr("stroke", `${enr_color_2}`)
        .attr("stroke-width", '1.5px')
        .attr("d", line);

    length_2 = path_2.node().getTotalLength();

    path_2.attr("stroke-dasharray", length_2 + " " + length_2)
        .attr("stroke-dashoffset", length_2)
        .transition()
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0)
        .duration(3000);

    chart.selectAll('circles')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', `circle-chart_2_2`)
        .attr("r", function(d,i){
            if(i == 0 || i == data.length -1) {
                return '5'
            } else {
                return '2.5';
            }
        })
        .attr("cx", function(d) { return x_c(d.ind_fecundidad); })
        .attr("cy", function(d) { return y_c(d.edad_media); })
        .style("fill", function(d,i) { 
            if(i == 0) {
                return `${enr_color_2}`;
            } else if (i == data.length - 1) {
                return `${enr_color_1}`;
            } else {
                return '#fff';
            }
        })
        .style("stroke", function(d,i) {
            if(i == 0 || i == data.length -1) {
                return 'none'
            } else {
                return `${enr_color_2}`;
            }
        })
        .style("stroke-width", function(d,i) {
            if(i == 0 || i == data.length -1) {
                return '0'
            } else {
                return `0.5`;
            }
        })
        .style('opacity', '0')
        .on('mouseenter mousedown mousemove mouseover', function(d, i, e) {                
            //Texto
            let html = `<p class="chart__tooltip--title">${d.ccaa} (${d.anio})</p>
            <p class="chart__tooltip--text">Edad media a la maternidad: ${numberWithCommas(d.edad_media.toFixed(1))} años</p>
            <p class="chart__tooltip--text">Índice de fecundidad: ${numberWithCommas(d.ind_fecundidad.toFixed(1))}</p>`;

            tooltip.html(html);

            //Tooltip
            positionTooltip(window.event, tooltip);
            getInTooltip(tooltip);               
        })
        .on('mouseout', function(d, i, e) {
            //Quitamos el tooltip
            getOutTooltip(tooltip);                
        })
        .transition()
        .delay(function(d,i) { return i * (3000 / data.length )})
        .style('opacity', '1');
}

//Helpers
function numberWithCommas(x) {
    return x.toString().replace(/\./g, ',');
}

function numberWithCommas2(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}