// import { Scrubber } from '@mbostock/scrubber'

const width = 800
const height = 700

var curStatus = 'animate'
var animateFlag = 1
var countId = 0
var inputFlag = 1

var jsonData = $.getJSON("./afterProcruList.json",
        function(data, textStatus, jqXHR) {
            console.log('data', data)
            console.log('success')

            dataArray = data['dataArray']
            indexArray = data['indexArray']

            drawChart(dataArray)

            intervalFunction = function() {
                countId += 1
                updatePoint(dataArray[countId], countId)
                if (countId == dataArray.length - 1) {
                    clearInterval(dps)
                }
            }

            var dps = setInterval(intervalFunction, 3500)
            console.log('tinter', dps)


            $('#slider').on('mousedown', function() {
                inputFlag = 0
            })

            $('#slider').on('mousemove', function() {
                if (inputFlag == 0) {
                    curValue = document.getElementById('slider').value
                    console.log('value', document.getElementById('slider').value)
                    $('#changeStatus').text('Play')
                    animateFlag = 0
                    clearInterval(dps)
                    $('#curframetext').text(curValue)
                    countId = curValue - 1
                    updatePoint(dataArray[countId], countId)
                        // getInputValue()
                }
            })

            $('#slider').on('mouseup', function() {
                inputFlag = 1
            })

            $('#changeStatus').on('click', function() {
                console.log('change change')
                animateFlag = Math.abs(animateFlag - 1)
                console.log('animateFlag', animateFlag)
                if (animateFlag == 1) {
                    console.log('click countid', countId)
                    $('#changeStatus').text('Pause')
                    dps = setInterval(intervalFunction, 3500)
                } else if (animateFlag == 0) {
                    console.log('clear')
                    console.log('curinterval', dps)
                    $('#changeStatus').text('Play')
                    clearInterval(dps)
                }
            })

        })
    .done(function() {
        console.log("second success");
    })
    .fail(function() {
        console.log("error");
    })
    .always(function() {
        console.log("complete");
    })

// console.log('jsonData', jsonData)

var stringTrans = function(number) {
    console.log('stringtran number', number)
    var stri = ''
    if (number < 10) {
        stri = '00' + String(number)
    }
    if (number >= 10 & number <= 100) {
        stri = '0' + String(number)
    }
    if (number >= 100) {
        stri = String(number)
    }
    console.log('stri', stri)
    return stri
}

drawChart = function(dataArray) {
    // const svg = d3.create("svg")
    // .attr('viewBox', [0, 0, width, height])

    const svg = d3.selectAll('svg')

    svg.append('g')
        .call(xAxis)

    svg.append('g')
        .call(yAxis)

    svg.append('g')
        .call(grid)


    $('#curOriPic').attr('src', './cutbyfps pic/000_onlybyfps.jpg')

    const circle = svg.append('g')
        .attr('stroke', 'black')
        .selectAll('circle')
        // .enter()
        .data(dataArray[countId])
        .join("circle")
        .attr('id', 'circle')
        .attr('cx', d => x(d[0]))
        .attr('cy', d => y(d[1]))
        .attr('r', '5')
        .attr('fill', (d, i) => color(i))
        .attr('stroke', 'black')
        .on('mouseover', function(d, i) {
            d3.select(this)
                // .transition()
                // .duration('50')
                .attr('opacity', '.85')
                .attr("stroke", "red")
                // .attr('fill', 'red');
                .attr('r', '8')

            // console.log('i', i)

            d3.select('body')
                .select('#curDotPic')
                // .transition()
                // .duration('50')
                .attr('src', function() {
                    console.log('i', i)
                    console.log('stringtrans', stringTrans(i))
                    var firstNumber = stringTrans(parseInt(countId + 1))
                    var secondNumber = stringTrans(parseInt(Math.ceil((i + 1) / 16)))
                    if ((i + 1) % 16 == 0) {
                        var thirdNumber = stringTrans(parseInt(i + 1) % 16 + 1)
                    } else {
                        var thirdNumber = stringTrans(parseInt((i + 1) % 16))
                    }

                    // console.log('firseNumber', firstNumber)
                    // console.log('second', secondNumber)
                    // console.log('third', thirdNumber)
                    var filenumber = firstNumber + '_' + secondNumber + '_' + thirdNumber
                    console.log('filenumber', filenumber)
                    $('#curDotPicName').text('./candymotion1_mov pic/' + filenumber + '.jpg')
                    return './candymotion1_mov pic/' + filenumber + '.jpg'
                })
                .style('display', 'block')

            // let div = d3.select('body')
            //     .append('g')
            //     .append('div')
            //     .attr('class', 'tooltip')
            //     .style('opacity', 0)

            // div.transition()
            //     .duration('50')

            // div.html(`Test name countID:`)
            //     .style('opacity', .9)
            //     .style('left', (d3.select(this).attr('cx') + 10) + 'px')
            //     .style('top', (d3.select(this).attr('cy') - 10) + 'px')
        })
        .on('mouseout', function(d, i) {
            d3.select(this)
                .attr('r', 5)
                .attr('stroke', 'black')

            d3.select("#curDotPic")
                .attr('src', '')
                .style('display', 'none')

            $('#curDotPicName').text('')
        })

    const rectText = svg.append('g')
        .attr('class', 'framenumber')
        .append('text')
        .attr('x', 800)
        .attr('y', 30)
        .text('frame 1')
        .attr('fill', 'black')

}
var t = d3.transition()
    .duration(3000)
    .ease(d3.easeLinear)

var getInputValue = function() {
    $('#slider').attr('value', countId + 1)
    $('#curframetext').text($('#slider').attr('value'))
}

var changePause = function() {
    clearInterval()
}

var temporalChange = function(frameArrayAll) {
    var interval = setInterval(function() {
        updatePoint(frameArrayAll[countId], countId)
        countId += 1
        if (countId == frameArrayAll.length) {
            clearInterval(interval)
        }
    }, 3500)
}

var updatePoint = function(curdata, id) {
    console.log('curdata', curdata)
    console.log('len curdata', curdata.length)


    if (id < 10) {
        var stri = '00' + String(id)
    }
    if (id < 100 & id >= 10) {
        var stri = '0' + String(id)
    }
    if (id >= 100) {
        var stri = String(id)
    }

    // curimg = document.getElementById('curOriPic')
    // curimg.src = './cutbyfps pic/' + stri + '_onlybyfps.jpg'
    $('#curOriPic').attr('src', './cutbyfps pic/' + stri + '_onlybyfps.jpg')
    getInputValue()

    d3.selectAll('.framenumber')
        .select('text')
        // .append('text')
        // .attr('x', 800)
        // .attr('y', 30)
        .text('frame ' + String(id + 1))
        .attr('fill', 'black')

    d3.selectAll('circle')
        // .attr('count', function() {
        //     return d3.select(this).attr('count') + 1
        // })
        // .data(dataArray[d3.select(this).attr('count') + 1])
        .data(curdata)
        .transition()
        .duration(3000)
        .ease(d3.easeLinear)
        .attr('cx', d => x(d[0]))
        .attr('cy', d => y(d[1]))
        .attr('r', '5')
        .attr('fill', (d, i) => color(i))

}


interpolateV = function(start, end, count) {
    var emptyarray = []
    var interval_value = (end - start) / count
    emptyarray.push(start)
    for (let i = 1; i < count + 1; i++) {
        emptyarray.push(start + i * interval_value)
    }
    // emptyarray.push(end)
    return emptyarray
}

colordomain = interpolateV(0, 264, 11)
console.log('colordomain', colordomain)

// 简易方法生成颜色数组
getRandomColors = function(num) {
    //生成颜色数组中第一个指定颜色
    var firstColor = "#009688";
    //生成颜色数组
    var colors = [];
    //需过滤的颜色数组
    var filterColors = ["#ffffff", "#000000", "#dddddd", "#999999", "#666666", "#efeacb", firstColor];
    var getRandomColor = function() {
        return '#' + (function(color) {
            return (color += '0123456789abcdef' [Math.floor(Math.random() * 16)]) &&
                (color.length === 6) ? color : arguments.callee(color);
        })('');
    };

    function filterColor(num) {
        while (colors.length < num) {
            colors.push(getRandomColor());
        }
        //如果生成的颜色数组内有被过滤的颜色，则清空颜色数组重新生成新的颜色
        var filterArr = colors.filter(function(v) { return filterColors.indexOf(v) > -1 });
        if (filterArr.length > 0) {
            colors = [];
            arguments.callee(num);
        }
    }
    filterColor(num);

    colors[colors.length - 1] = firstColor;
    return colors
}
colorArray = getRandomColors(256)
console.log(colorArray)

//颜色比例尺
let color = d3.scaleLinear()
    // .range(d3.schemePaired)
    // .domain(colordomain)
    .domain(d3.range(256))
    .range(colorArray)

// let color = d3.scaleLinear(d3.schemeCategory10)

console.log('colorscheme', d3.schemeCategory10)
console.log('colorscheme 20', d3.schemeSet3)
    // schemePaired schemePastel1
console.log('range', d3.range(256))

const margin = { left: 30, top: 50, right: 40, bottom: 30 }

const x = d3.scaleLinear()
    .range([margin.left, width - margin.right])
    .domain([-3000, 3000])

const y = d3.scaleLinear()
    .range([height - margin.bottom, margin.top])
    .domain([-3000, 3000])

const xAxis = g => g
    .attr('transform', `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80), ',')
    .call(g => g.select('.domain').remove())


const yAxis = g => g
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select('.domain').remove())
    // .call(g => g.append('text')
    //     .attr('x', -margin.left)
    //     .attr('y', 10)
    //     .attr('fill', 'black')
    //     .attr('text-anchor', 'start')
    //     .text("↑ Life expectancy (years)")
    // )

grid = g => g
    .attr('stroke', 'currentColor')
    .attr('stroke-opacity', 0.1)
    .call(g => g.append('g')
        .selectAll('line')
        .data(x.ticks())
        .join('line')
        .attr('x1', d => 0.5 + x(d))
        .attr('x2', d => 0.5 + x(d))
        .attr('y1', margin.top)
        .attr('y2', height - margin.bottom)
    )
    .call(g => g.append('g')
        .selectAll('line')
        .data(y.ticks)
        .join('line')
        .attr('y1', d => 0.5 + y(d))
        .attr('y2', d => 0.5 + y(d))
        .attr("x1", margin.left)
        .attr("x2", width - margin.right)
    );


// frameArrayAll = [frame1array, frame2array, frame3array, frame4array, frame5array]
// for (let i = 0; i < frameArrayAll.length; i++) {
// drawChart(frameArrayAll)
// for (let i = 1; frameArrayAll.length - 1; i++) {
//     // updatePoint(frame2array)
//     updatePoint(frameArrayAll[i])
// }



// }