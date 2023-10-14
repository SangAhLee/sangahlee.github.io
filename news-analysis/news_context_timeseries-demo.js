
function newsContextLoadTimeseriesData(filepath) {
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

async function drawContextTimeseriesHorizonGraph(category, index, graphDiv, filepath) {
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

    const data = await newsContextLoadTimeseriesData(filepath);
    visualizeTimelineData(svgBar, data, filepath);
}


// *********************************************************** */
// vertical drawContextTimeseriesOverlappingAreaGraph  chart
// *********************************************************** */

async function drawContextTimeseriesOverlappingAreaGraph(category, index, graphDiv, filepath) {
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
    const data = await newsContextLoadTimeseriesData(filepath);

    visualizeOverlappingAreaData(svgBar, data, filepath);
}





function getClusterNames(clusterCount, path) {

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

    let clusterNames = null;

    console.log('path')
    console.log(path)

    // 경로가 ./data_sample/${filename}_timeseries.json 형식인지 확인하는 정규 표현식
    const specificPathPattern = /\.\/data_sample\/.+_timeseries\.json/;
    if (specificPathPattern.test(path)) {


        console.log('path')
        console.log(path)

        // 파일명만 추출
        const filenamePattern = /data_sample\/(.+)_timeseries\.json/;
        const filenameMatch = path.match(filenamePattern);

        console.log('filenameMatch')
        console.log(filenameMatch)


        if (filenameMatch && filenameMatch[1]) {
            const filename = filenameMatch[1];
            console.log(filename)
            switch (filename) {
                case 'sample1':
                    clusterNames = [
                        '2023.08.18: 박구연 국무조정실, 일본 오염수 관련 보도 자제 요청',
                        '2023.08.19: 기시다 후미오 총리, 후쿠시마 오염수 방류 시점 최종 판단 임박',
                        '2023.08.22: 일본 정부, 오염수 해양 방류 시작 결정; IAEA 안전기준 확인 예정',
                        '2023.08.24: 도쿄전력, 내년 3월까지 총 3만 1,200톤 오염수 방류 예정',
                        '2023.08.24: 도쿄전력, ALPS 가동 및 오염수 바다 방류 계획 확정',
                        '2023.08.24: 후쿠시마 제1원자력발전소, \'오염수\' 해양 방류 시작',
                        '2023.08.24: 스가 요시히데 총리 결정 이후 2년 4개월만에 오염수 방류',
                        '2023.08.24: 도쿄전력, 해저터널을 통한 오염수 방류 실시',
                        '2023.08.24: 도쿄전력, 방류 관련 실시간 데이터 공개 및 삼중수소 농도 기준미달 확인'
                    ];
                    break;
                case 'sample2':
                    clusterNames = [
                        "Sample 2 - 아동학대 신고에 대한 교사 직위해제 전문가 도입 검토",
                        "Sample 2 - 개정 및 교사 죽음 진상 규명 촉구 집회",
                        "Sample 2 - 발표",
                        "Sample 2 - 원응대 강화"
                    ];
                    break;
                case 'sample3':
                    clusterNames = [
                        "2023.08.18: 서울시교육청, 아동학대 신고에 대한 교사 직위해제 전문가 도입 검토",
                        "2023.08.19: 아동학대관련법 개정 및 교사 죽음 진상 규명 촉구 집회",
                        "2023.08.23: 학생인권조례 자율적 개정 지원 및 예시안 발표",
                        "2023.08.23: 교육지원청 '통합민원팀' 설치 및 교사 민원응대 강화",
                        "2023.08.23: 교육활동 침해 학생에 대한 처분 강화 계획",
                        "2023.08.24: 교육부, 9월4일 재량휴업일 지정에 부정적 입장",
                        "2023.08.25: 조희연 서울시교육감, 9월4일 '공교육 멈춤의 날' 지원 약속"
                    ];
                    break;
                default:
                    clusterNames = defaultNames;
                    break;
            }
        }
    } else {



        // 파일 경로에서 날짜 추출
        const datePattern = /context_(\d{4}-\d{2}-\d{2})_/;
        const matches = path.match(datePattern);
        if (!matches) {
            console.error("날짜 패턴이 일치하지 않습니다.");
            return;
        }

        const date = matches[1];  // 날짜 문자열 형태


        switch (date) {
            case '2023-08-19':
                clusterNames = defaultNames;
                break;
            case '2023-08-20':
                clusterNames = defaultNames;
                break;
            case '2023-08-21':
                clusterNames = defaultNames;
                break;
            case '2023-08-22':
                clusterNames = [
                    '기시다 총리, 전국어협 회장 사카모토 마사노부와 직접 만남 의사 표명',
                    'IAEA, 한국 대상 별도 성명 게재',
                    '미국 방문 중인 기시다 후미오 총리: 후쿠시마 방류 판단 20일 원전 방문 후 결정',
                    '"오염수 안전 기준 지속 평가" - IAEA 사무총장 라파엘 그로시 성명 발표',
                    '후쿠시마 오염수 24일 배출 예정: IAEA 현장 감시 및 평가 활동 계획',
                    '박구연 국무조정실, 일본 오염수 관련 보도 자제 요청'
                ];
                break;
            case '2023-08-23':
                clusterNames = defaultNames;
                break;
            case '2023-08-24':
                clusterNames = defaultNames;
                break;
            case '2023-08-25': {

                if (theme == 'huku') {
                    clusterNames = [
                        '2023.08.18: 박구연 국무조정실, 일본 오염수 관련 보도 자제 요청',
                        '2023.08.19: 기시다 후미오 총리, 후쿠시마 오염수 방류 시점 최종 판단 임박',
                        '2023.08.22: 일본 정부, 오염수 해양 방류 시작 결정; IAEA 안전기준 확인 예정',
                        '2023.08.24: 도쿄전력, 내년 3월까지 총 3만 1,200톤 오염수 방류 예정',
                        '2023.08.24: 도쿄전력, ALPS 가동 및 오염수 바다 방류 계획 확정',
                        '2023.08.24: 후쿠시마 제1원자력발전소, \'오염수\' 해양 방류 시작',
                        '2023.08.24: 스가 요시히데 총리 결정 이후 2년 4개월만에 오염수 방류',
                        '2023.08.24: 도쿄전력, 해저터널을 통한 오염수 방류 실시',
                        '2023.08.24: 도쿄전력, 방류 관련 실시간 데이터 공개 및 삼중수소 농도 기준미달 확인'
                    ];

                } else if (theme == 'edu') {
                    clusterNames = [
                        "2023.08.18: 서울시교육청, 아동학대 신고에 대한 교사 직위해제 전문가 도입 검토",
                        "2023.08.19: 아동학대관련법 개정 및 교사 죽음 진상 규명 촉구 집회",
                        "2023.08.23: 학생인권조례 자율적 개정 지원 및 예시안 발표",
                        "2023.08.23: 교육지원청 '통합민원팀' 설치 및 교사 민원응대 강화",
                        "2023.08.23: 교육활동 침해 학생에 대한 처분 강화 계획",
                        "2023.08.24: 교육부, 9월4일 재량휴업일 지정에 부정적 입장",
                        "2023.08.25: 조희연 서울시교육감, 9월4일 '공교육 멈춤의 날' 지원 약속"
                    ];
                }
                break;
            }
            default:
                clusterNames = defaultNames;
                break;
        }
    }

    return clusterNames;
}



//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
////
//// TIMESERIES - visualize timeline table
//// 
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////


async function visualizeTimelineData(svgElement, data, filepath) {

    const margin = { top: 20, right: 150, bottom: 80, left: 50 };
    const width = 1200 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select(svgElement)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const parseDate = d3.timeParse("%Y-%m-%d");


    data.forEach(d => {
        if (typeof d.date === "string") {
            d.date = parseDate(d.date);
        }
        console.log(d.date); // 변환 후 출력하여 확인
    });


    const clusterCount = Object.keys(data[0]).length - 1; // -1 for the date key
    const clusterNames = await getClusterNames(clusterCount, filepath);

    const x = d3.scaleTime().range([0, width]);
    // x.domain(d3.extent(data, d => d.date));
    const lastDate = d3.max(data, d => d.date);
    const adjustedLastDate = new Date(lastDate);
    adjustedLastDate.setDate(lastDate.getDate() + 5);  // 마지막 날짜로부터 5일 후로 범위를 확장

    x.domain([d3.min(data, d => d.date), adjustedLastDate]);


    const xAxis = d3.axisBottom(x)
        .ticks(d3.timeDay, 1)
        .tickFormat(d3.timeFormat("%Y-%m-%d"));

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


async function visualizeOverlappingAreaData(svgElement, data, filepath) {


    // 보여줄 이름이 있다고 가정
    // const clusterNames = ['Cluster 0', 'Cluster 1', 'Cluster 2', 'Cluster 3', 'Cluster 4', 'Cluster 5'];

    const margin = { top: 50, right: 150, bottom: 80, left: 50 };  // right margin을 150으로 조정
    const width = (1200 - margin.left - margin.right) * 4 / 4;  // 원래 값에 2/3을 곱합니다.
    const height = (500 - margin.top - margin.bottom) * 2 / 3;  // 원래 값에 2/3을 곱합니다.


    const width_x = (960 - margin.left - margin.right) * 4 / 4;  // 원래 값에 2/3을 곱합니다.
    const diff_x = width - width_x

    const additionalWidth = 100; // 300;

    // SVG 생성
    const svg = d3.select(svgElement)
        .attr("width", width + margin.left + margin.right + additionalWidth) // 960) // SVG 전체 너비는 그대로 유지 
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // 날짜 파서
    const parseDate = d3.timeParse("%Y-%m-%d");
    data.forEach(d => {
        d.date = parseDate(d.date);
    });


    // X, Y 스케일 설정
    const x = d3.scaleTime().range([0, width_x]);
    const y = d3.scaleLinear().range([height, 0]);

    const clusterKeys = Object.keys(data[0]).filter(key => key !== 'date');
    x.domain(d3.extent(data, d => d.date));
    y.domain([0, d3.max(data, d => Math.max(...clusterKeys.map(key => d[key])))]);

    //    cluster 수 확인 및 area generators 생성
    const xdata_date_count = data.length;
    const clusterCount = Object.keys(data[0]).filter(key => key.includes('cluster')).length;


    // 클러스터 이름!
    let clusterNames = await getClusterNames(clusterCount, filepath);  //비동기작업

    const custom_colors = d3.schemeCategory10;  // 10개의 예쁜 색상을 포함한 배열

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
    const legendSpacing = 5; // 간격
    const legendWidth = 350 + additionalWidth; // 전체 범례의 너비
    const legendOffset = 20 - diff_x; // 범례를 더 오른쪽으로 옮기기 위한 offset 값

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
        .style("font-size", "12px") // 여기에서 글씨 크기를 설정합니다. 원하는 크기로 조절하세요.
        .text((d, i) => clusterNames[i]);

    legend.append("line")
        .attr("x1", 0)
        .attr("y1", legendSize + legendSpacing)
        .attr("x2", legendWidth - 2 * legendSpacing)
        .attr("y2", legendSize + legendSpacing)
        .attr("stroke", "black")
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
