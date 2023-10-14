//--------------------------------------------------
// 전역 변수 모음
//--------------------------------------------------


const color_Owner = "#73A9AD";
const color_Model = "#F5F0BB"; 
const color_clickedOwner = '#AC4425' // red

let llmData = null; // 전역 변수로 선언


//--------------------------------------------------
// 로드 됬을 때
//--------------------------------------------------

// 화면사이즈 변경 시, 화면 다시 로드
window.addEventListener('resize', function () {
    location.reload();
});


// 화면이 로드되면, 자동으로 실행됨.
document.addEventListener("DOMContentLoaded", function () {
    load_data();
});

async function load_data() {
    const llms_data_file = "./llms.json";
    await process_llms_data(llms_data_file);
}

//--------------------------------------------------
// 탭 이벤트
//--------------------------------------------------

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('tabs-container').addEventListener('click', function (event) {
        if (event.target.className.includes('tab')) {
            // 모든 탭의 active 클래스를 제거
            document.querySelectorAll('.tab').forEach(function (tab) {
                tab.classList.remove('active');
            });
            // 클릭된 탭에 active 클래스 추가
            event.target.classList.add('active');

            // 모든 탭 내용의 active-content 클래스를 제거하여 숨깁니다.
            document.querySelectorAll('.tab-content').forEach(function (content) {
                content.classList.remove('active-content');
            });
            // 클릭된 탭에 해당하는 내용에 active-content 클래스 추가하여 보이게 합니다.
            document.getElementById('content-' + event.target.id.split('-')[1]).classList.add('active-content');
        }
    });
});





//--------------------------------------------------
// 데이터 불러오기
//--------------------------------------------------


function formatId(id) {
    if (!id) return "";
    return id.replace(/[^a-zA-Z0-9]/g, "_");
}


function process_llms_data(filepath) {
    console.log(filepath);

    const LLMS_CONTAINER_ID = `svg-container`;

    //화면 지우기
    let llmsContainer = document.getElementById(LLMS_CONTAINER_ID);

    fetch(filepath)
        .then((response) => response.json()) // 응답을 JSON 형태로 파싱합니다.
        .then((data) => {
            llmData = data;
            console.log(llmData);

            if (!llmsContainer) {
                llmsContainer = document.createElement("div");
                llmsContainer.id = LLMS_CONTAINER_ID;
                document.body.appendChild(llmsContainer);
            }

            // SVG 컨테이너의 크기 설정
            let width = window.innerWidth * 0.7;
            let height = window.innerHeight * 0.7;

            let svg = d3
                .select("#svg-container")
                .append("svg")
                .attr("width", width)
                .attr("height", height);

            let allOwners = [...new Set(llmData.map((d) => d.owner))]; // owner 중복 제거


            let ownerNodes = allOwners.map((owner) => ({
                id: formatId(owner),
                type: "owner",
                originalName: owner
            }));

            let modelNodes = llmData.map((d) => ({
                id: formatId(d.name),
                type: "model",
                owner: formatId(d.owner),
                originalName: d.name
            }));


            let nodes = [...modelNodes, ...ownerNodes];
            let links = llmData.map((d) => ({
                source: formatId(d.name),
                target: formatId(d.owner),
            }));


            let simulation = d3
                .forceSimulation(nodes)
                .force(
                    "link",
                    d3
                        .forceLink(links)
                        .id((d) => d.id)
                        .distance(20)
                ) //200
                .force("charge", d3.forceManyBody().strength(-50)) //-300
                .force("center", d3.forceCenter(width / 2, height / 2))
                .force("collide", d3.forceCollide(30));

            let link = svg
                .append("g")
                .selectAll("line")
                .data(links)
                .enter()
                .append("line")
                // .attr("stroke", "pink")
                .attr("class", "link");

            let nodeGroup = svg
                .append("g")
                .attr("class", "nodes")
                .selectAll(".nodeGroup")
                .data(nodes)
                .enter()
                .append("g")
                .attr("class", "nodeGroup")
                .call(
                    d3
                        .drag()
                        .on("start", dragstarted)
                        .on("drag", dragged)
                        .on("end", dragended)
                );

            nodeGroup
                .append("circle")
                .attr("class", (d) => d.type)
                .attr("id", d => formatId(d.id))
                .attr("r", 20)
                .style("fill", (d) => (d.type === "owner" ? color_Owner : color_Model))
                .attr("stroke", "white") // 원의 테두리 색상을 흰색으로 설정
                .attr("stroke-width", "2px"); // 원의 테두리 두께 설정

            nodeGroup
                .append("text")
                .text((d) => d.originalName)
                .attr("dx", 15)
                .attr("dy", 4)
                .attr("class", (d) => `${d.type} nodeText`);




            // 모든 노드와 링크의 기본 스타일을 초기화하는 함수
            function resetNodeHighlight() {
                nodeGroup.select("circle").attr("stroke", "white"); // 원래 테두리 색상으로 초기화
            }

            nodeGroup.on("click", function (event, d) {
                resetNodeHighlight(); // 모든 노드의 하이라이트를 초기화

                // 현재 클릭된 노드 하이라이트
                d3.select(this).select("circle").attr("stroke", color_clickedOwner).attr("stroke-width", "5px");

                links.forEach(link => {
                    if (d.type === 'model' && link.source.id === d.id) {
                        // 'model' 클릭 시, 연결된 'owner'만 노란색으로
                        d3.select(`#${formatId(link.target.id)}`).select("circle")
                            .attr("stroke", "#FFD700")
                            .attr("stroke-width", "5px")
                            .style("fill", "#FFD700");
                    } else if (d.type === 'owner' && link.target.id === d.id) {
                        // 'owner' 클릭 시, 연결된 모든 'model' 노드들만 노란색으로
                        d3.select(`#${formatId(link.source.id)}`).select("circle")
                            .attr("stroke", "#FFD700")
                            .attr("stroke-width", "5px")
                            .style("fill", "#FFD700");
                    }
                });

                if (d.type === 'owner') {
                    console.log("Owner Node clicked!");
                    displayOwnerInfo(d.originalName);
                } else {
                    console.log("Node clicked!");
                }
            });

            simulation.on("tick", function () {
                link
                    .attr("x1", (d) => d.source.x)
                    .attr("y1", (d) => d.source.y)
                    .attr("x2", (d) => d.target.x)
                    .attr("y2", (d) => d.target.y);

                nodeGroup.attr("transform", (d) => {
                    // 노드의 위치를 SVG 경계 안으로 제한
                    d.x = Math.max(20, Math.min(width - 20, d.x));
                    d.y = Math.max(20, Math.min(height - 20, d.y));
                    return `translate(${d.x}, ${d.y})`;
                });
            });


            function dragstarted(event, d) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            }

            function dragged(event, d) {
                d.fx = event.x;
                d.fy = event.y;
            }

            function dragended(event, d) {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }
        })
        .catch((error) => {
            console.error("Error:", error); // 에러가 발생하면 콘솔에 에러를 출력
        });
}


function displayOwnerInfo(ownerName) {
    const models = llmData.filter(d => d.owner === ownerName);

    let table = document.createElement('table');
    table.id = "ownerInfoTable";

    let thead = document.createElement('thead');
    let headerRow = document.createElement('tr');

    ["Owner", "Date", "Model", "Parameters (Billions)", "Note", "Link"].forEach(header => {
        let th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    let tbody = document.createElement('tbody');
    models.forEach(model => {
        let row = document.createElement('tr');

        let ownerCell = document.createElement('td');
        ownerCell.classList.add('ownerCell'); // 클래스 추가
        ownerCell.textContent = model.owner;
        row.appendChild(ownerCell);

        let dateCell = document.createElement('td');
        dateCell.textContent = model.date;
        row.appendChild(dateCell);

        let nameCell = document.createElement('td');
        nameCell.textContent = model.name;
        row.appendChild(nameCell);

        let paramCell = document.createElement('td');
        paramCell.textContent = model["trained on x billion parameters"];
        row.appendChild(paramCell);

        let noteCell = document.createElement('td');
        noteCell.textContent = model["note / * = parameters undisclosed"] || "N/A";
        row.appendChild(noteCell);

        let linkCell = document.createElement('td');
        let link = document.createElement('a');
        link.href = model.link;
        link.textContent = "Link";
        link.target = "_blank";
        linkCell.appendChild(link);
        row.appendChild(linkCell);

        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    let tableContainer = document.getElementById('table-container');
    tableContainer.innerHTML = '';
    tableContainer.appendChild(table);
}
