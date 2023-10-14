// 데이터 로드
// d3.json("sample_data.json").then(drawChart);



// Fetch sample data and then visualize
fetch('sample_data.json')
    .then(response => response.json())
    .then(data => {
        visualizeAreaData(document.getElementById('areaChart'), data);
    });




function visualizeAreaData(svgElement, data) {


    // 보여줄 이름이 있다고 가정
    // const clusterNames = ['Cluster 0', 'Series 1', 'Series 2', 'Series 3', 'Series 4', 'Series 5'];

    const margin = { top: 20, right: 150, bottom: 30, left: 50 };  // right margin을 150으로 조정
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // SVG 생성
    const svg = d3.select(svgElement)
        .attr("width", 960) // SVG 전체 너비는 그대로 유지   width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // 날짜 파서
    const parseDate = d3.timeParse("%Y-%m-%d");
    data.forEach(d => {
        d.date = parseDate(d.date);
    });
    // X, Y 스케일 설정
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    x.domain(d3.extent(data, d => d.date));
    y.domain([0, d3.max(data, getMaxValue)]);



    // cluster 수 확인 및 area generators 생성
    const clusterCount = data.length;

    // 보여줄 이름 임시생성!!!!
    const clusterNames = Array.from({ length: clusterCount }, (_, i) => {
        return `Cluster ${i}`;
    });


    const x_value_count = Object.keys(data[0]).filter(key => key.includes('cluster')).length;


    console.log(x_value_count)
    console.log(clusterCount)

    const custom_colors = d3.schemeCategory10;  // 10개의 예쁜 색상을 포함한 배열
    // const custom_colors = d3.scaleOrdinal(d3.schemePaired);
    // https://d3js.org/d3-scale-chromatic/categorical



    // const colors = ["steelblue", "red", "green", "purple", "yellow"];  // 각 cluster에 대한 색상 (추가적으로 확장 가능)

    const areaGenerators = Array.from({ length: x_value_count }).map((_, i) => {
        return d3.area()
            .x(d => x(d.date))
            .y0(y(0))
            .y1(d => y(d[`cluster${i + 1}`]))
            .curve(d3.curveMonotoneX);
    });



    // Areas 추가
    areaGenerators.forEach((areaGen, index) => {
        svg.append("path")
            .data([data])
            .attr("class", `area cluster${index + 1}`) // 각 area에 고유한 클래스 추가
            .attr("d", areaGen)
            .attr("fill", custom_colors[index])
            .attr("opacity", 0.5);
    });

    // // Add Legend
    // const legendSize = 20;
    // const legendSpacing = 5;

    // const legend = svg.selectAll(".legend")
    //     .data(colors.slice(0, x_value_count))
    //     .enter().append("g")
    //     .attr("class", "legend")
    //     .attr("transform", (d, i) => `translate(0,${i * (legendSize + legendSpacing)})`);

    // // Move entire legend to the top-right corner of the graph
    // legend.attr("transform", `translate(${width - legendSize * 2},0)`);

    const legendSize = 10;
    const legendSpacing = 5; // 간격을 좀 줄여볼게요
    const legendWidth = 150; // 전체 범례의 너비
    const legendOffset = 20; // 범례를 더 오른쪽으로 옮기기 위한 offset 값
    
    // 범례의 총 높이 계산
    const legendHeight = clusterCount * (legendSize + legendSpacing + 5); // 5는 각 항목 간의 추가적인 간격을 위한 값
    
    const legendBox = svg.append("g")
        .attr("class", "legendBox")
        .attr("transform", `translate(${width + legendOffset},${height - legendHeight})`)
        .append("rect")
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .attr("fill", "white")
        .attr("stroke", "black");
    
    const legend = svg.selectAll(".legend")
        .data(custom_colors.slice(0, clusterCount))
        .enter().append("g")
        .attr("class", "legend")
        .style("cursor", "pointer")
        .attr("transform", (d, i) => `translate(${width + legendOffset + legendSpacing},${height - legendHeight + i * (legendSize + legendSpacing + 5)})`); // 5를 추가하여 각 항목 간의 간격을 조절
    
    legend.append("circle")
        .attr("cx", legendSize / 2)
        .attr("cy", legendSize / 2)
        .attr("r", legendSize / 2)
        .attr("fill", d => d);
    
    legend.append("text")
        .attr("x", 2 * legendSize) // 이 부분을 조절하여 텍스트 위치를 동그라미로부터 더 멀게 할 수 있음
        .attr("y", legendSize / 2)
        .attr("dy", "0.35em")
        .text((d, i) => clusterNames[i]);
    
    legend.append("line")
        .attr("x1", 0)
        .attr("y1", legendSize + legendSpacing)
        .attr("x2", legendWidth - 2 * legendSpacing)
        .attr("y2", legendSize + legendSpacing)
        .attr("stroke", "black")
        .attr("stroke-width", 0.5);
    
    // 마우스 이벤트는 그대로 유지
    legend.on("mouseover", function(d, i) {
        svg.selectAll(".area")
            .transition()
            .duration(150)
            .attr("opacity", 0.1);
        svg.select(`.cluster${i + 1}`)
            .transition()
            .duration(150)
            .attr("opacity", 1);
    })
    .on("mouseout", function() {
        svg.selectAll(".area")
            .transition()
            .duration(150)
            .attr("opacity", 0.5);
    });





    // // Add Legend
    // const legendSize = 10;
    // const legendSpacing = 10;

    // const legend = svg.selectAll(".legend")
    //     .data(custom_colors.slice(0, clusterCount))
    //     .enter().append("g")
    //     .attr("class", "legend")
    //     .attr("transform", (d, i) => `translate(0,${i * (legendSize + legendSpacing)})`);

    // // 범례의 위치 조정
    // const legendHeight = x_value_count * (legendSize + legendSpacing);
    // legend.attr("transform", (d, i) => `translate(${width},${height - legendHeight + i * (legendSize + legendSpacing)})`);



    // legend.append("circle")
    //     .attr("r", legendSize / 2)
    //     .attr("fill", d => d);

    // legend.append("text")
    //     .attr("x", legendSize + legendSpacing)
    //     .attr("y", legendSize / 2)
    //     .attr("dy", "0.35em")
    //     .text((d, i) => clusterNames[i]);




    //     legend.on("mouseover", function(d, i) {
    //         // 모든 area를 흐리게 만듭니다.
    //         svg.selectAll(".area")
    //             .transition()
    //             .duration(150)
    //             .attr("opacity", 0.1);
    //         // 해당 area만 강조합니다.
    //         svg.select(`.cluster${i + 1}`)
    //             .transition()
    //             .duration(150)
    //             .attr("opacity", 1);
    //     })
    //     .on("mouseout", function() {
    //         // 모든 area의 스타일을 원래대로 복원합니다.
    //         svg.selectAll(".area")
    //             .transition()
    //             .duration(150)
    //             .attr("opacity", 0.5);
    //     });




    // X, Y 축 추가
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-%m-%d")));  // 여기에서 X축의 틱 형식을 설정

    svg.append("g")
        .call(d3.axisLeft(y));
}
