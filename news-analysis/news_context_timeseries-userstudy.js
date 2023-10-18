


//**************************************************************** */
//********************   파일 이름 여기에서 수정 ************************* */
//**************************************************************** */

// newsContextLoadTimeseriesData("json_output_ai.json").then(visualizeData);


function newsContextLoadTimeseriesData_UserStudy(filepath) {
    // 웹 서버에서 JSON 데이터를 가져옵니다.
    // let filepath = './data_timeseries/' + filename;
    console.log(filepath);

    return fetch(filepath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // data는 여기서 사용 가능합니다.
            //console.log(data);
            return data;
        })
        .catch(error => {
            console.log('There was a problem with the fetch operation:', error.message);
        });
}

// *********************************************************** */
// vertical drawContextTimeseriesOverlappingAreaGraph  chart
// *********************************************************** */

async function drawContextTimeseriesHorizonGraph_UserStudy(category, index, graphDiv, filepath, clusterName) {
    // Dimensions & Margins
    var margin = { top: 120, right: 100, bottom: 80, left: 100 },
        initialWidth = 1280,
        initialHeight = 500,
        scaleRatio = 1.3, // 130%
        width = (initialWidth * scaleRatio - margin.left - margin.right) / 3,
        height = (initialHeight * scaleRatio - margin.top - margin.bottom) / 3;

    // svg_bar 생성
    var svgBar = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgBar.id = `news-timeseries-${index + 1}-svg`;
    svgBar.setAttribute('width', width + margin.left + margin.right);
    svgBar.setAttribute('height', height + margin.top + margin.bottom);

    // 그래프 컨테이너를 multiNewsClusterDiv에 추가
    graphDiv.appendChild(svgBar);

    // display-area 생성
    var displayArea = document.createElement('div');
    displayArea.id = 'display-area';
    graphDiv.appendChild(displayArea);

    const data = await newsContextLoadTimeseriesData_UserStudy(filepath);
    visualizeTimelineData_UserStudy(svgBar, data, filepath, clusterName);
}


// *********************************************************** */
// vertical drawContextTimeseriesOverlappingAreaGraph  chart
// *********************************************************** */

async function drawContextTimeseriesOverlappingAreaGraph_UserStudy(category, index, graphDiv, filepath, clusterName) {
    // Dimensions & Margins
    var margin = { top: 120, right: 100, bottom: 80, left: 100 },
        initialWidth = 1280,
        initialHeight = 500,
        scaleRatio = 1.3, // 130%
        width = (initialWidth * scaleRatio - margin.left - margin.right) / 3,
        height = (initialHeight * scaleRatio - margin.top - margin.bottom) / 3;

    // // graph-container 생성
    // var graphContainer = document.createElement('div');
    // graphContainer.className = 'graph-container';
    // graphContainer.style.display = 'flex';
    // graphContainer.style.flexDirection = 'column';
    // // graphContainer.style.overflowX = 'scroll';
    // graphContainer.style.width = width + margin.left + margin.right + 'px';

    // svg_bar 생성
    var svgBar = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgBar.id = `news-timeseries-${index + 1}-svg`;
    svgBar.setAttribute('width', width + margin.left + margin.right);
    svgBar.setAttribute('height', height + margin.top + margin.bottom);
    // graphContainer.appendChild(svgBar);

    // 그래프 컨테이너를 multiNewsClusterDiv에 추가
    graphDiv.appendChild(svgBar);

    // display-area 생성
    var displayArea = document.createElement('div');
    displayArea.id = 'display-area';
    graphDiv.appendChild(displayArea);


    //newsContextLoadTimeseriesData(filepath)\.then(visualizeBarAndLineData)
    const data = await newsContextLoadTimeseriesData_UserStudy(filepath);

    visualizeOverlappingAreaData_UserStudy(svgBar, data, filepath, clusterName);
}







function getClusterNames_UserStudy(clusterCount, path) {

    console.log(`getClusterNames > path ${path}`)

    const path_pattern = /_(\w+)_\d+_\d+/;
    let theme = null
    const match = path.match(path_pattern); // edu, huku
    if (match && match[1]) {
        console.log(match[1]); // edu를 출력
        theme = match[1];
    }

    let defaultNames = Array.from({ length: clusterCount }, (_, i) => {
        return `Cluster ${i}`;
    });


    if (!path) {
        console.error("path 값이 제공되지 않았습니다.");
        return [];
    }

    return defaultNames;
}



//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
////
//// TIMESERIES - visualize timeline table
//// 
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////




async function visualizeTimelineData_UserStudy(svgElement, data, filepath, sampleClusterNames = null) {

    const margin = { top: 20, right: 150, bottom: 80, left: 50 };
    const width = 1200 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // 데이터의 개수에 따른 적절한 높이 계산
    const eventHeight = 25;  // 각 이벤트의 높이
    const totalEventHeight = data.length * eventHeight;
    const newHeight = totalEventHeight + margin.top + margin.bottom;  // 총 높이 계산

    // SVG 요소와 그래프 영역의 높이 재설정
    d3.select(svgElement)
        .attr("width", width + margin.left + margin.right)
        .attr("height", newHeight);

    const adjustedHeight = newHeight - margin.top - margin.bottom;

    d3.select(svgElement).selectAll("*").remove();

    const svg = d3.select(svgElement)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // const parseDate = d3.timeParse("%Y-%m-%d");


    const parseDate = d3.timeParse("%Y-%m-%d");

    data.forEach(d => {
        if (typeof d.date === "string") {
            d.date = parseDate(d.date);
        }
        console.log(d.date); // 변환 후 출력하여 확인
    });


    const clusterCount = Object.keys(data[0]).length - 1; // -1 for the date key


    let clusterNames = sampleClusterNames;
    if (sampleClusterNames == null)
        clusterNames = await getClusterNames_UserStudy(clusterCount, filepath);  //비동기작업

    const x = d3.scaleTime().range([0, width]);

    const lastDate = d3.max(data, d => d.date);
    const adjustedLastDate = new Date(lastDate);
    adjustedLastDate.setDate(lastDate.getDate() + 5);  // 마지막 날짜로부터 5일 후로 범위를 확장

    x.domain([d3.min(data, d => d.date), adjustedLastDate]);


    // 데이터가 있는 날짜만을 배열로 추출
    const datesWithData = data.map(d => d.date);

    // const xAxis = d3.axisBottom(x)
    //     .tickValues(datesWithData)
    //     .tickFormat(d3.timeFormat("%Y-%m-%d"));
    const xAxis = d3.axisBottom(x)
        .tickValues(datesWithData)
        .tickFormat(d3.timeFormat("%m/%d")); // 변경된 부분: 날짜 형식을 mm/dd로 설정


    svg.append("g")
        .attr("transform", `translate(0,${height / 2})`)
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "middle")
        .attr("dx", "0em")
        .attr("dy", "-1.5em");

    // Extract cluster with the highest value for each date
    const getDominantCluster = (d) => {
        let maxVal = -Infinity;
        let maxKey = "";
        Object.keys(d).forEach(key => {
            if (key !== "date" && d[key] > maxVal) {
                maxVal = d[key];
                maxKey = key;
            }
        });
        return maxKey;
    };

    // Add vertical lines for each event
    svg.selectAll(".event-line")
        .data(data)
        .enter()
        .append("line")
        .attr("class", "event-line")
        .attr("x1", d => x(d.date))
        .attr("y1", height / 2)  // 시작 지점을 가로선의 위치로 설정
        .attr("x2", d => x(d.date))
        .attr("y2", height)
        .style("stroke", "#aaa")
        .style("stroke-dasharray", "2,2");


    // Add circles for each event
    svg.selectAll(".event-dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "event-dot")
        .attr("cx", d => x(d.date))
        .attr("cy", height / 2)
        .attr("r", 5)
        .style("fill", "blue");



    // SVG의 왼쪽 상단에 '2023'이라고 표시
    svg.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("dy", "-0.5em")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("2023");

 //   let lastY = adjustedHeight / 2 + 15; // 초기 y 위치

    let lastY = height / 2 + 15; // 초기 y 위치
    const gapBetweenBoxes = 25; // 박스 간 거리

    // Text first
    const texts = svg.selectAll(".event-text")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "event-text")
        .attr("x", d => x(d.date) + 10)
        .attr("y", () => {
            lastY += gapBetweenBoxes;
            return lastY;
        })
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .style("font-size", "12px")
        .style("fill", "#2c3e50")
        .text(d => {
            const clusterKey = getDominantCluster(d);
            const clusterIndex = Number(clusterKey.replace("cluster", ""));
            const fullText = clusterNames[clusterIndex];
            return fullText.replace(/^\d{4}\.\d{2}\.\d{2}: /, '');
        })
        .on("mouseover", function (d) {
            // 현재 선택된 text에 대한 날짜 데이터
            const currentDate = d.date;

            // Text 하이라이트
            d3.select(this).style("font-weight", "bold");

            // 연관된 dot 하이라이트
            svg.selectAll(".event-dot")
                .filter(dot => dot.date === currentDate)
                .style("fill", "red");

            // 연관된 line 하이라이트
            svg.selectAll(".event-line")
                .filter(line => line.date === currentDate)
                .style("stroke", "red")
                .style("stroke-width", 2);
        })
        .on("mouseout", function (d) {
            // 현재 선택된 text에 대한 날짜 데이터
            const currentDate = d.date;

            // Text 원래대로
            d3.select(this).style("font-weight", "normal");

            // 연관된 dot 원래대로
            svg.selectAll(".event-dot")
                .filter(dot => dot.date === currentDate)
                .style("fill", "blue");

            // 연관된 line 원래대로
            svg.selectAll(".event-line")
                .filter(line => line.date === currentDate)
                .style("stroke", "#aaa")
                .style("stroke-width", 1)
                .style("stroke-dasharray", "2,2");
        });
}





//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
////
//// TIMESERIES - visualize Overlapping Area
//// 
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////


async function visualizeOverlappingAreaData_UserStudy(svgElement, data, filepath, sampleClusterNames = null) {


    // margin 설정은 그대로 유지
    const margin = { top: 50, right: 150, bottom: 80, left: 50 };

    // 가로 크기 증가. 원래 값에서 1.5배로 늘림.
    const width = (1200 * 1 - margin.left - margin.right);

    // height 설정은 그대로 유지
    const height = (500 - margin.top - margin.bottom) * 2 / 3;

    const width_x = (960 - margin.left - margin.right) * 4 / 4;  // 원래 값에 2/3을 곱합니다.
    const diff_x = width - width_x

    const additionalWidth = 100; // 300;

    // SVG 생성
    const additional_space_for_legend = 500;
    const svg = d3.select(svgElement)
        .attr("width", width + margin.left + margin.right + additionalWidth)
        .attr("height", height + margin.top + margin.bottom + additional_space_for_legend)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // 날짜 파서
    const parseDate = d3.timeParse("%Y-%m-%d");
    data.forEach(d => {
        d.date = parseDate(d.date);
    });


    // X, Y 스케일 설정
    const x = d3.scaleTime().range([0, width]);  // x 스케일의 범위도 width 값에 맞춰서 조정

    // const x = d3.scaleTime().range([0, width_x]);
    const y = d3.scaleLinear().range([height, 0]);

    const clusterKeys = Object.keys(data[0]).filter(key => key !== 'date');
    x.domain(d3.extent(data, d => d.date));
    y.domain([0, d3.max(data, d => Math.max(...clusterKeys.map(key => d[key])))]);

    //    cluster 수 확인 및 area generators 생성
    const xdata_date_count = data.length;
    const clusterCount = Object.keys(data[0]).filter(key => key.includes('cluster')).length;

    console.log(`clusterCount ${clusterCount}`)

    // 클러스터 이름!!!!!!!!!!!!!!!!!!!!!!!!
    let clusterNames = sampleClusterNames;
    if (sampleClusterNames == null)
        clusterNames = await getClusterNames_UserStudy(clusterCount, filepath);  //비동기작업
    console.log(`clusterNames ${clusterNames}`)



    const generateCustomColors = (count) => {
        var colors_tableau10 = ["#4e79a7", "#f28e2c", "#e15759", "#76b7b2", "#59a14f", "#edc949", "#af7aa1", "#ff9da7", "#9c755f", "#bab0ab"]; //Tableau10
        // const custom_colors = d3.schemeCategory10;  // 10개의 예쁜 색상을 포함한 배열
    
        let result = [];
        while (result.length < count) {
            result = result.concat(colors_tableau10);
        }
        return result.slice(0, count);
    };
    
    const custom_colors = generateCustomColors(clusterCount);


    const areaGenerators = Array.from({ length: clusterCount }).map((_, i) => {
        return d3.area()
            .x(d => x(d.date))
            .y0(y(0))
            .y1(d => y(d[`cluster${i}`]))
            .curve(d3.curveMonotoneX);
    });


    // Areas 추가
    areaGenerators.forEach((areaGen, index) => {
        svg.append("path")
            .data([data])
            .attr("class", `area cluster cluster${index + 1}`) // 각 area에 고유한 클래스 추가
            .attr("d", areaGen)
            .attr("fill", custom_colors[index])
            .attr("opacity", 0.5);
    });


    // legend 추가 
    const legendSize = 10;
    const legendSpacing = 15; // 간격
    const legendWidth = 550 + additionalWidth; // 전체 범례의 너비
    const legendOffset = 20 - diff_x; // 범례를 더 오른쪽으로 옮기기 위한 offset 값

    // 범례의 총 높이 계산
    const legendHeight = clusterCount * (legendSize + legendSpacing + 5); // 5는 각 항목 간의 추가적인 간격을 위한 값



    // 수정 -  범례의 위치를 그래프 바닥 아래로 변경
    const bottomPadding = 90;  // 이 값은 그래프 바닥과 범례 사이의 간격을 조절합니다.

    // 수정된 부분: 범례의 x 위치를 차트의 시작 x 좌표와 동일하게 설정
    const legendX = 0;
    const legendY = height + bottomPadding; // x축에서 약간의 간격을 두고 범례를 시작

    const legendTopPadding = 20;

    const legendBox = svg.append("g")
        .attr("class", "legendBox")
        .attr("transform", `translate(${legendX},${legendY})`)
        .append("rect")
        .attr("width", legendWidth)
        .attr("height", legendHeight+10)
        .attr("fill", "#f8f8f8")  // 백그라운드 색상을 약간 변경
        .attr("stroke", "#d1d1d1")  // 테두리 색상 변경
        .attr("rx", 5)  // 코너 라운딩 추가
        .attr("ry", 5);
    // .attr("filter", "drop-shadow(0px 0px 5px #aaa)");  // 그림자 추가


    const legend = svg.selectAll(".legend")
        .data(custom_colors.slice(0, clusterCount))
        .enter().append("g")
        .attr("class", "legend")
        .style("cursor", "pointer")
        .attr("transform", (d, i) => `translate(${legendX + legendSpacing},${legendY + legendTopPadding + i * (legendSize + legendSpacing + 5)})`);

    legend.append("circle")
        .attr("cx", legendSize / 2)
        .attr("cy", legendSize / 2)
        .attr("r", legendSize / 2)
        .attr("fill", d => d);


    legend.append("text")
        .attr("x", 2 * legendSize)
        .attr("y", legendSize / 2)
        .attr("dy", "0.35em")
        .style("font-size", "14px")
        .style("font-family", "Arial, sans-serif")
        .style("fill", "#333")  // 글씨 색상 변경
        .text((d, i) => clusterNames[i]);

    // 변경된 구분선 스타일
    legend.append("line")
        .attr("x1", legendSize)
        .attr("y1", legendSize + legendSpacing - 5)  // 위치 약간 위로 변경
        .attr("x2", legendWidth - 2 * legendSpacing - 20)  // 길이 조절
        .attr("y2", legendSize + legendSpacing - 5)
        .attr("stroke", "#e5e5e5")  // 색상 변경
        .attr("stroke-width", 0.5);


    // 마우스 이벤트는 그대로 유지
    legend.on("mouseover", function (event, d) {
        console.log(`clicked => ${d}`)  // d는 색상 값이 될 것입니다.

        // 데이터 배열에서 해당 데이터의 인덱스 찾기
        const idx = custom_colors.indexOf(d);
        console.log(`clicked index => ${idx}`)

        // 모든 area를 흐리게 만듭니다.
        svg.selectAll(".area")
            .transition()
            .duration(150)
            .attr("opacity", 0.1);

        // 해당 area만 강조합니다.
        svg.select(`.cluster${idx + 1}`)
            .transition()
            .duration(150)
            .attr("opacity", 1);
    })
        .on("mouseout", function () {
            // 모든 area의 스타일을 원래대로 복원합니다.

            svg.selectAll(".area")
                .transition()
                .duration(150)
                .attr("opacity", 0.5);
        });


    const xAxis = d3.axisBottom(x)
        .ticks(d3.timeDay, 1)  // 월 단위로 틱을 표시하도록 설정
        .tickFormat(d3.timeFormat("%Y-%m-%d"));

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

    svg.append("g")
        .call(d3.axisLeft(y));
}
