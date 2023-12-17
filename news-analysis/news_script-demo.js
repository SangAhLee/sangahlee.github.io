//--------------------------------------------------
// 전역 변수
//--------------------------------------------------

// 사용 예제:
let startDate = "2023-08-25";
let endDate = "2023-08-25";

let classifiedData = {};


let lastNewsDate = null;
let global_selectedDate = null;
let global_topic = null;

// 관심 주제 리스트
// const topics = ['기후 변화', '인공지능', '초중등 교육', '한일 한미 관계'];
// const topics_eng = ['weatherchange', 'ai', 'education', 'diplomacy'];

const topics = ['초중등 교육', '물오염', '인공지능', '예술/문화'];
const topics_eng = ['education', 'waterpollution', 'ai', 'artdesign'];

const bulletpoint = '⟡';

const color_lightgrey = '#f7f7f7'; // '#EFEFEF'


var tableau10_colorMapping = {
    "Blue": "#4e79a7",
    "Orange": "#f28e2c",
    "Red": "#e15759",
    "Skyblue": "#76b7b2",
    "Green": "#59a14f",
    "Yellow": "#edc949",
    "Violet": "#af7aa1",
    "Pink": "#ff9da7",
    "Brown": "#9c755f",
    "Grey": "#bab0ab"
};

var colors_tableau10 = [tableau10_colorMapping["Blue"], tableau10_colorMapping["Green"], tableau10_colorMapping["Violet"]];



function hexToRgba(hex, opacity) {
    let bigint = parseInt(hex.slice(1), 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// 이 함수를 사용하여 colors 배열의 색상을 rgba 형식으로 변환합니다.
var baseColors = colors_tableau10;

//--------------------------------------------------
// 탭(1) - 기능 삭제
//--------------------------------------------------


//--------------------------------------------------
// 탭(2)
//--------------------------------------------------


function openTab(evt, tabName) {
    let i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}
// 페이지 로드될 때 "전체 뉴스" 탭을 기본적으로 활성화
document.getElementById("defaultOpen").click();


//--------------------------------------------------
// 뉴스 날짜 선택
//--------------------------------------------------

function generateDateList(startDate, endDate) {
    let start = new Date(startDate);
    let end = new Date(endDate);
    let dateList = [];

    while (start <= end) {
        let year = start.getFullYear();
        let month = (start.getMonth() + 1).toString().padStart(2, '0');  // JavaScript는 0부터 11까지의 월을 사용하므로 1을 더해줍니다.
        let day = start.getDate().toString().padStart(2, '0');

        dateList.push(`${year}-${month}-${day}`);
        start.setDate(start.getDate() + 1);  // 다음 날짜로 이동
    }

    return dateList;
}

var dateList = generateDateList(startDate, endDate)

// Get the select element
var selectElement = document.getElementById("dateSelect");

// Dynamically create options
dateList.forEach(function (date, index) {
    var option = document.createElement("option");
    option.value = date;
    option.text = date;

    // dateList의 마지막 값을 자동으로 선택한다. 
    if (index === dateList.length - 1) {
        option.selected = true;
    }

    // Add the option to the select element
    selectElement.add(option);
});



//--------------------------------------------------
// 뉴스 날짜 변경
//--------------------------------------------------

function handleDateChange() {
    // Get the select element
    let dateSelectElement = document.getElementById("dateSelect");

    // 선택한 날짜
    let selectedDate = dateSelectElement.value || dateSelectElement.options[dateSelectElement.options.length - 1].value; // dateSelect에서 선택된 값을 가져오거나 마지막 옵션의 값을 사용합니다.

    // 선택한 날짜 확인
    console.log("Selected date: " + selectedDate); // 2023-07-11
    global_selectedDate = selectedDate

    // (전체 뉴스 삭제)
    // document.getElementById("subtitle1_desc").innerText = `${selectedDate} 일자의 뉴스를 한 페이지로 정리한 내용입니다.`; // 텍스트를 변경합니다.
    document.getElementById("subtitle2_desc").innerText = `${selectedDate} 일자의 사회 뉴스를 한 페이지로 정리한 내용입니다.`; // 텍스트를 변경합니다.
    document.getElementById("subtitle3_desc").innerText = `${selectedDate} 일자의 정치 뉴스를 한 페이지로 정리한 내용입니다.`; // 텍스트를 변경합니다.
    document.getElementById("subtitle4_desc").innerText = `${selectedDate} 일자의 경제 뉴스를 한 페이지로 정리한 내용입니다.`; // 텍스트를 변경합니다.
    document.getElementById("subtitle5_desc").innerText = `${selectedDate} 일자의 IT/과학 뉴스를 한 페이지로 정리한 내용입니다.`; // 텍스트를 변경합니다.
    document.getElementById("subtitle6_desc").innerText = `${selectedDate} 일자의 세계 뉴스를 한 페이지로 정리한 내용입니다.`; // 텍스트를 변경합니다.
    document.getElementById("subtitle7_desc").innerText = `${selectedDate} 일자의 생활/문화 뉴스를 한 페이지로 정리한 내용입니다.`; // 텍스트를 변경합니다.


    // (3) 오늘 날짜에 따라 마지막 뉴스를 봤던 날짜 찾기
    setLastNewsDate(selectedDate)


    // (4) 뉴스 기사 cluster 파일 이름 설정
    loadFilesInOrder(selectedDate + "_token");

    // (5) 뉴스 기사 cluster 정보 불러오기
    load_cluster_sentences(selectedDate + "_token");
}



// 화면이 로드되면, 자동으로 실행됨. 
document.addEventListener("DOMContentLoaded", function () {
    handleDateChange();

});


//--------------------------------------------------
// 파일 로드
//--------------------------------------------------


async function loadFilesInOrder(selectedDate) {
    let cluster_society_file = `cluster_${selectedDate}_Society.json`;
    let cluster_politic_file = `cluster_${selectedDate}_Politics.json`;
    let cluster_business_file = `cluster_${selectedDate}_Business.json`;
    let cluster_technology_file = `cluster_${selectedDate}_Technology.json`;
    let cluster_world_file = `cluster_${selectedDate}_World.json`;
    let cluster_life_file = `cluster_${selectedDate}_Life.json`;

    // 뉴스 기사 cluster 데이터 로드
    await load_cluster_info_by_category(cluster_society_file, selectedDate);
    await load_cluster_info_by_category(cluster_politic_file, selectedDate);
    await load_cluster_info_by_category(cluster_business_file, selectedDate);
    await load_cluster_info_by_category(cluster_technology_file, selectedDate);
    await load_cluster_info_by_category(cluster_world_file, selectedDate);
    await load_cluster_info_by_category(cluster_life_file, selectedDate);
}


async function load_cluster_sentences(selectedDate) {
    let cluster_sentences_society_file = `sentences_${selectedDate}_Society`;
    let cluster_sentences_politic_file = `sentences_${selectedDate}_Politics`;
    let cluster_sentences_business_file = `sentences_${selectedDate}_Business`;
    let cluster_sentences_technology_file = `sentences_${selectedDate}_Technology`;
    let cluster_sentences_world_file = `sentences_${selectedDate}_World`;
    let cluster_sentences_life_file = `sentences_${selectedDate}_Life`;

    const [societyData, politicData, businessData, technologyData, worldData, lifeData] = await Promise.all([
        load_cluster_sentences_by_category(cluster_sentences_society_file, 'json'),
        load_cluster_sentences_by_category(cluster_sentences_politic_file, 'json'),
        load_cluster_sentences_by_category(cluster_sentences_business_file, 'json'),
        load_cluster_sentences_by_category(cluster_sentences_technology_file, 'json'),
        load_cluster_sentences_by_category(cluster_sentences_world_file, 'json'),
        load_cluster_sentences_by_category(cluster_sentences_life_file, 'json')
    ]);

    classifiedData = {
        Society: societyData,
        Politics: politicData,
        Business: businessData,
        Technology: technologyData,
        World: worldData,
        Life: lifeData
    };

    console.log("-------------------------classifiedData");
    console.log(classifiedData);

}



//--------------------------------------------------
// 마지막으로 뉴스를 본 날짜
//--------------------------------------------------


function setLastNewsDate(selectedDate) {

    // selectedDate를 Date 객체로 변환
    let selectedDateParts = selectedDate.split('-');
    let today = new Date(selectedDateParts[0], selectedDateParts[1] - 1, selectedDateParts[2]);


    const dateContainer = document.querySelector(".date-container");
    while (dateContainer.firstChild) {
        dateContainer.removeChild(dateContainer.firstChild);
    }

    // "마지막으로 뉴스를 봤던 날짜" 텍스트 추가
    const title = document.createElement("div");
    title.className = "date-title";
    title.textContent = "마지막으로 뉴스를 봤던 날짜를 선택하세요. (기본 옵션: 이틀 전)";
    dateContainer.appendChild(title);


    const dateBtnContainer = document.createElement("div");
    dateBtnContainer.className = "date-btn-container";
    dateContainer.appendChild(dateBtnContainer);

    const subTitle = document.createElement("p");
    subTitle.className = "date-subtitle";

    let currentActiveDate = new Date(today);
    currentActiveDate.setDate(today.getDate() - 2);  // "이틀 전"을 기본 옵션으로 했으므로

    const selectedYear = currentActiveDate.getFullYear();
    const selectedMonth = String(currentActiveDate.getMonth() + 1).padStart(2, '0');  // 월은 0부터 시작하므로 +1
    const selectedDay = String(currentActiveDate.getDate()).padStart(2, '0');

    subTitle.innerHTML = `<span>${selectedYear}년 ${selectedMonth}월 ${selectedDay}일</span> 이 후로 업데이트된 내용을 알려드립니다.`;

    title.appendChild(subTitle);

    for (let i = 6; i >= 0; i--) {
        let pastDate = new Date(today);
        pastDate.setDate(today.getDate() - i);
        const formattedDate = pastDate.toISOString().slice(0, 10);

        const dateBtn = document.createElement("button");
        dateBtn.className = "date-btn";
        dateBtn.setAttribute("data-btn", formattedDate);  // 이 부분을 추가합니다.
        dateBtn.textContent = formattedDate;

        dateBtn.addEventListener("click", function () {

            console.log(`Button ${formattedDate} clicked!`);

            lastNewsDate = formattedDate;

            document.querySelectorAll(".date-btn").forEach(btn => {
                btn.classList.remove("active");
            });

            dateBtn.classList.add("active");

            // 선택한 날짜에 따라 subTitle 업데이트
            const dateParts = formattedDate.split('-');
            const selectedYear = dateParts[0];
            const selectedMonth = dateParts[1];
            const selectedDay = dateParts[2];
            subTitle.innerHTML = `<span>${selectedYear}년 ${selectedMonth}월 ${selectedDay}일</span> 이 후로 업데이트된 내용을 알려드립니다.`;
        });

        dateBtnContainer.appendChild(dateBtn);
    }

    // 어제 날짜를 기본으로 선택
    let yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayFormatted = yesterday.toISOString().slice(0, 10);
    const yesterdayBtn = dateContainer.querySelector(`button[data-btn="${yesterdayFormatted}"]`);  // 수정된 부분
    if (yesterdayBtn) {
        yesterdayBtn.classList.add("active");
    }

    // console.log(dateContainer.innerHTML);

}



//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
////
//// DAILY NEWS - load cluster info by category
//// 
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////


function transformFilename(filename) {
    let parts = filename.split('_'); // 문자열을 '_' 기준으로 분할

    if (parts.length < 4) {
        // 입력된 파일 이름이 예상된 형식이 아닌 경우 오류를 반환
        console.error("Invalid filename format.");
        return;
    }

    let datePart = parts[1].replace(/-/g, ''); // '2023-08-25'를 '20230825'로 변경
    let categoryPart = parts[3];

    return `NewsList_${datePart}_${categoryPart}`;
}


function load_cluster_info_by_category(filename, selectedDate) {

    let currentDate = selectedDate.replace('_token', '');

    // 웹 서버에서 JSON 데이터를 가져옵니다.
    let filepath = './data_json_cluster/' + filename
    console.log(filepath)


    let category = 'Unknown'
    if (filename.includes("Society")) {
        category = 'Society'
    }
    else if (filename.includes("Politic")) {
        category = 'Politics'
    }
    else if (filename.includes("Business")) {
        category = 'Business'
    }
    else if (filename.includes("Technology")) {
        category = 'Technology'
    }
    else if (filename.includes("World")) {
        category = 'World'
    }
    else if (filename.includes("Life")) {
        category = 'Life'
    }
    else {
        return
    }


    let newslist_filepath = './data_newslist/' + transformFilename(filename);


    let NEWS_CONTAINER_ID = `${category}-news`
    //console.log(NEWS_CONTAINER_ID)

    //화면 지우기
    let newsContainer = document.getElementById(NEWS_CONTAINER_ID);
    if (newsContainer) {
        if (newsContainer.style.display !== 'none') {
            newsContainer.style.display = 'none';
        }

        while (newsContainer.firstChild) {
            newsContainer.removeChild(newsContainer.firstChild);
        }
    }


    Promise.all([
        fetch(filepath).then(response => response.json()),
        fetch(newslist_filepath).then(response => response.json())
    ])
        .then(([newsData, newsListData]) => {

            // 상위 레벨 뉴스 컨테이너를 선택하거나 생성합니다.
            if (!newsContainer) {
                newsContainer = document.createElement('div');
                newsContainer.id = NEWS_CONTAINER_ID;
                document.body.appendChild(newsContainer);
            }

            // 혹시 컨테이너 가려져있으면 보이기
            if (newsContainer.style.display == 'none') {
                newsContainer.style.display = 'block';
            }

            newsContainer.className = 'none';


            // 각 뉴스 항목을 동적으로 생성합니다.
            newsData.forEach((newsItem, index) => {

                // ***********************************************************
                // *
                // * START (newsDiv)
                // *
                // ***********************************************************

                let newsDiv = document.createElement('div');
                newsDiv.id = `news-${index + 1}`;
                newsDiv.className = 'news-item';

                // title 표시
                let newsTitle = document.createElement('h3');
                newsTitle.id = `news-${index + 1}-title`;
                newsTitle.className = 'newstitle'; // class 추가


                if (newsItem.count !== undefined && newsItem.count !== null) {
                    let titleText = document.createTextNode(`[뉴스 ${index + 1}] ${newsItem.title}`);
                    let countSpan = document.createElement('span');

                    countSpan.style.fontWeight = 'bold';
                    countSpan.style.color = 'blue';
                    countSpan.style.marginLeft = '10px';       // 왼쪽 여백 추가
                    countSpan.innerText = `(관련 기사 ${newsItem.count} 개)`;

                    newsTitle.appendChild(titleText);          // h3 태그에 뉴스 타이틀 텍스트 추가
                    newsTitle.appendChild(countSpan);          // h3 태그에 span 태그 추가
                } else {
                    newsTitle.innerText = `[뉴스 ${index + 1}] ${newsItem.title}`;
                }

                newsDiv.appendChild(newsTitle);

                //***********************************************************
                //*
                //* SUMMARY
                //*
                //***********************************************************

                // summary (1)create div
                let summaryDiv = document.createElement('div');
                summaryDiv.id = `news-${index + 1}-summary`;
                summaryDiv.style.display = 'flex';
                summaryDiv.style.flexDirection = 'column';

                // summary (2)title
                let summaryTitle = document.createElement('h3');
                summaryTitle.textContent = bulletpoint + '요약';
                summaryTitle.style.marginBottom = '10px';  // 타이틀과 본문 사이의 간격 조절
                summaryDiv.appendChild(summaryTitle);

                let summaryText = newsItem.summary;
                if (summaryText) {
                    let sentences = summaryText.split('.').filter(sentence => sentence.trim() !== ''); // 빈 문자열 제거

                    // 각 문장을 리스트 항목으로 추가
                    let sentenceList = document.createElement('ul');
                    sentences.forEach(sentence => {
                        let listItem = document.createElement('li');
                        listItem.textContent = sentence.trim() + '.'; // 마침표 다시 추가
                        sentenceList.appendChild(listItem);
                    });

                    summaryDiv.appendChild(sentenceList);
                }

                // summary (3)attach to newsDiv
                newsDiv.appendChild(summaryDiv);

                // summary (4)divider
                var divider_summary = document.createElement('div');
                divider_summary.className = 'divider-style';
                newsDiv.appendChild(divider_summary);


                // ***********************************************************
                // *
                // * TIMELINE
                // *
                // ***********************************************************


                if (newsItem.timeline && newsItem.timeline !== '' && newsItem.timeline !== 'none') {

                    // timeline (1)create div
                    let timelineDiv = document.createElement('div');
                    timelineDiv.id = `news-${index + 1}-timeline`;
                    timelineDiv.style.display = 'flex';
                    timelineDiv.style.flexDirection = 'column';


                    // timeline (2)title
                    let timelineTitle = document.createElement('h3');
                    timelineTitle.textContent = bulletpoint + '뉴스기사 타임라인';
                    timelineTitle.style.marginBottom = '10px';  // 타이틀과 본문 사이의 간격 조절
                    timelineDiv.appendChild(timelineTitle);


                    // timeline (3)attach to newsDiv
                    newsDiv.appendChild(timelineDiv);

                    // timeline (4)divider
                    var divider_timeline = document.createElement('div');
                    divider_timeline.className = 'divider-style';
                    newsDiv.appendChild(divider_timeline);


                    // *********************************************************** 
                    // * TIMELINE > Description
                    // *********************************************************** 
                    let btToggle_info_timeline = document.createElement('button');
                    let btToggle_text_timeline = '타임라인은 어떻게 도출되었나요?'
                    btToggle_info_timeline.innerHTML = ' ▼ ' + btToggle_text_timeline;
                    btToggle_info_timeline.className = 'additional_info_button'; // 'toggle_info_button';


                    let timeline_desc = ["지속적인 사건의 경우, 시간이 지남에 따라 관련 이슈를 다루는 뉴스 기사가 주로 무엇을 다루고 있는지 분석합니다.", "이는 뉴스 기사에서 시간이 지남에 따라 다루어진 내용을 시각화한 것이며 사건의 연대순 순서와 다를 수 있습니다."];

                    let timelineDescDiv = document.createElement('div');
                    timelineDescDiv.style.display = 'none';

                    let timelineInfoDiv = document.createElement('div');
                    timelineInfoDiv.className = 'sentencesDivClass';

                    btToggle_info_timeline.addEventListener('click', () => {
                        if (timelineDescDiv.style.display === 'none' || !timelineDescDiv.style.display) {
                            timelineDescDiv.innerHTML = '';  // 이전 컨텐츠 삭제
                            timeline_desc.forEach(sentence => {
                                let p = document.createElement('p');
                                p.innerHTML = sentence;  // 변경된 부분
                                timelineDescDiv.appendChild(p);
                            });

                            timelineDescDiv.style.display = 'block';
                            btToggle_info_timeline.innerHTML = ' ▲ ' + btToggle_text_timeline;
                        } else {
                            timelineDescDiv.style.display = 'none';
                            btToggle_info_timeline.innerHTML = ' ▼ ' + btToggle_text_timeline;
                        }
                    });

                    timelineInfoDiv.appendChild(btToggle_info_timeline);
                    timelineInfoDiv.appendChild(timelineDescDiv);
                    timelineDiv.appendChild(timelineInfoDiv)

                    // *********************************************************** 
                    // * TIMELINE > Chart
                    // *********************************************************** 


                    const timelineFilename = newsItem.timeline.replace(/\s+/g, '_');
                    let timelineFilepath = `./data_overlapping_area/context_${currentDate}_huku_22_25.json`


                    if (newsItem.timeline === "Fukushima Radioactive Water") {
                        timelineFilepath = `./data_overlapping_area/context_${currentDate}_huku_22_25.json`;
                    } else if (newsItem.timeline === "Teaching Rights Infringement") {
                        timelineFilepath = `./data_overlapping_area/context_${currentDate}_edu_22_25.json`;
                    }

                    console.log(`timelineFilepath = ${timelineFilepath}`)


                    let timelineChartDiv = document.createElement('div');
                    timelineChartDiv.className = 'news-item content-box';
                    timelineDiv.appendChild(timelineChartDiv)


                    // *********************************************************** 
                    // * TIMELINE > Chart > Type1 Chart
                    // *********************************************************** 

                    let timelineChart1 = document.createElement('div');
                    timelineChart1.style.display = 'flex';
                    timelineChart1.style.flexDirection = 'column';


                    // *********************************************************** 
                    // * TIMELINE > Chart > Type1 Chart > Desc
                    // *********************************************************** 
                    let timeline1_Desc_Div = document.createElement('div');
                    let timeline1_Desc = ["뉴스 기사에서 주요하게 다뤄온 내용을 타임라인으로 확인하세요."];
                    let timeline1_ulElement = document.createElement('ul');
                    timeline1_ulElement.className = 'guidetext';  // 클래스 추가

                    // 각 문장을 리스트 항목으로 추가
                    timeline1_Desc.forEach(sentence => {
                        let listItem = document.createElement('li');
                        listItem.textContent = sentence;
                        timeline1_ulElement.appendChild(listItem);
                    });
                    timeline1_Desc_Div.appendChild(timeline1_ulElement);
                    timelineChart1.appendChild(timeline1_Desc_Div);
                    timelineChartDiv.appendChild(timelineChart1);

                    // *********************************************************** 
                    // * TIMELINE > Chart > Type1 Chart > Chart
                    // *********************************************************** 
                    drawContextTimeseriesHorizonGraph(category, index, timelineChart1, timelineFilepath);


                    // *********************************************************** 
                    // * TIMELINE > Chart > Type2 Chart
                    // *********************************************************** 

                    let timelineChart = document.createElement('div');
                    timelineChart.style.display = 'flex';
                    timelineChart.style.flexDirection = 'column';


                    // *********************************************************** 
                    // * TIMELINE > Chart > Type1 Chart > Desc
                    // *********************************************************** 
                    let timeline2_Desc_Div = document.createElement('div');

                    let timeline2_Desc = ["각 주요 내용이 언제 얼마나 주요하게 다루어졌는지 가중치를 함께 확인하세요."];
                    let timeline2_ulElement = document.createElement('ul');
                    timeline2_ulElement.className = 'guidetext';  // 클래스 추가

                    // 각 문장을 리스트 항목으로 추가
                    timeline2_Desc.forEach(sentence => {
                        let listItem = document.createElement('li');
                        listItem.textContent = sentence;
                        timeline2_ulElement.appendChild(listItem);
                    });
                    timeline2_Desc_Div.appendChild(timeline2_ulElement);
                    timelineChart.appendChild(timeline2_Desc_Div);
                    timelineChartDiv.appendChild(timelineChart);


                    // *********************************************************** 
                    // * TIMELINE > Chart > Type1 Chart > Chart
                    // *********************************************************** 

                    drawContextTimeseriesOverlappingAreaGraph(category, index, timelineChart, timelineFilepath);

                    // *********************************************************** 
                    // * TIMELINE > Chart > Type2 Button
                    // *********************************************************** 
                    let btTab01_timeline = document.createElement('button');
                    btTab01_timeline.innerHTML = 'Simple Timeline';
                    btTab01_timeline.className = 'tab_info_button';
                    timelineChartDiv.append(btTab01_timeline);

                    btTab01_timeline.addEventListener('click', function () {
                        timelineChart1.style.display = 'block';
                        timelineChart.style.display = 'none';

                        btTab01_timeline.classList.add('active');
                        btTab02_timeline.classList.remove('active');
                    });



                    // *********************************************************** 
                    // * TIMELINE > Chart > Type2 Button
                    // *********************************************************** 
                    let btTab02_timeline = document.createElement('button');
                    btTab02_timeline.innerHTML = 'Dynamic Timeline';
                    btTab02_timeline.className = 'tab_info_button';
                    timelineChartDiv.append(btTab02_timeline);

                    btTab02_timeline.addEventListener('click', function () {
                        timelineChart1.style.display = 'none';
                        timelineChart.style.display = 'block';

                        btTab01_timeline.classList.remove('active');
                        btTab02_timeline.classList.add('active');
                    });

                    // *********************************************************** 
                    // * 디폴트 설정
                    // *********************************************************** 
                    timelineChart.style.display = 'none';
                    timelineChart1.style.display = 'block';
                    btTab01_timeline.classList.add('active');  //default state
                    // btTab01_timeline.disabled = true; // 테스트용으로 잠시 막음. (작동안되서)

                }


                // ***********************************************************
                // *
                // * (KEY)CONTENT
                // *
                // ***********************************************************


                // content (1)create div
                let contentDiv = document.createElement('div');
                contentDiv.id = `news-${index + 1}-content`;
                contentDiv.style.display = 'flex';
                contentDiv.style.flexDirection = 'column';


                // content (2)title
                let contentTitle = document.createElement('h3');
                contentTitle.textContent = bulletpoint + '서브 토픽';
                contentTitle.style.marginBottom = '10px';
                contentDiv.appendChild(contentTitle);

                // content (3)attach to newsDiv
                newsDiv.appendChild(contentDiv);

                // content (4)divider
                var divider_content = document.createElement('div');
                divider_content.className = 'divider-style';
                newsDiv.appendChild(divider_content);


                // *********************************************************** 
                // * (KEY)CONTENT > Description
                // *********************************************************** 

                let total_articles = newsItem.count ? newsItem.count : 0;
                let total_sentences = newsItem.sentcount ? newsItem.sentcount : 0;

                // Create the button dynamically
                let btToggle_info = document.createElement('button');
                let btToggle_text = '서브 토픽(핵심 내용)은 어떻게 도출되었나요?'
                btToggle_info.innerHTML = ' ▼ ' + btToggle_text;
                btToggle_info.className = 'additional_info_button';


                let sentences = ["- 동일한 사건을 다루는 뉴스 기사들을 모아서, 전체 뉴스 기사에 사용된 문장들을 모았습니다.", "- 이후, 문장들을 전처리 하여 필요 없는 내용 (예: 제보 요청 문구, 광고 문구 등)을 삭제하고 이 문장들을 비슷한 내용끼리 묶어서 클러스터링(군집화) 합니다.", "- 그러면 비슷한 내용을 가진 문장끼리 묶여서 그룹을 이루게 되고, 각 그룹별 주요 내용은 기사 내용의 핵심 내용으로 간주합니다."]

                if (total_articles !== 0 && total_sentences !== 0) {
                    sentences.push(`- <strong>전체 관련 기사는 ${total_articles}개</strong>이고, <strong>총 ${total_sentences}개</strong>의 문장을 분석했습니다.`);
                }
                sentences.push(`- 뉴스 기사 내에서 각 내용이 언급되는 텍스트적인 컨텍스트를 고려하기위하여, 각 핵심 내용은 뉴스기사에서 평균적으로 게재된 위치를 기준으로 정렬되었습니다. `);

                // Create a div for sentences content
                let sentencesContentDiv = document.createElement('div');
                sentencesContentDiv.style.display = 'none';

                // Create a div for sentences
                let infomationDiv = document.createElement('div');
                infomationDiv.className = 'sentencesDivClass';

                btToggle_info.addEventListener('click', () => {
                    if (sentencesContentDiv.style.display === 'none' || !sentencesContentDiv.style.display) {
                        sentencesContentDiv.innerHTML = '';  // 이전 컨텐츠 삭제
                        sentences.forEach(sentence => {
                            let p = document.createElement('p');
                            p.innerHTML = sentence;  // 변경된 부분
                            sentencesContentDiv.appendChild(p);
                        });

                        sentencesContentDiv.style.display = 'block';
                        btToggle_info.innerHTML = ' ▲ ' + btToggle_text;
                    } else {
                        sentencesContentDiv.style.display = 'none';
                        btToggle_info.innerHTML = ' ▼ ' + btToggle_text;
                    }
                });

                infomationDiv.appendChild(btToggle_info);
                infomationDiv.appendChild(sentencesContentDiv);
                contentDiv.appendChild(infomationDiv)


                let new_mark = Array.isArray(newsItem.new) ? newsItem.new : [];


                // *********************************************************** 
                // * (KEY)CONTENT > Chart
                // *********************************************************** 

                let chartDiv = document.createElement('div');
                chartDiv.className = 'content-box';
                contentDiv.appendChild(chartDiv);

                var colors = baseColors.map(baseColors => hexToRgba(baseColors, 0.5)); // 0.5는 투명도 값입니다.

                var top3;

                // *********************************************************** 
                // * (KEY)CONTENT > Chart > Type1 Chart
                // *********************************************************** 

                let svgContainer_circle = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svgContainer_circle.id = `news-${index + 1}-svg`;
                svgContainer_circle.setAttribute('width', '100%');
                svgContainer_circle.setAttribute('height', '500px');

                top3 = drawClusteredCirclesByRatio(top = 3, colors, colors, category, index, svgContainer_circle, newsItem.data, new_mark);
                console.log(top3);  // 출력: [3, 1, 5] (예시)

                // drawClusteredCirclesByRatio(colors, category, index, svgContainer, newsItem.data, new_mark);
                // chartDiv.append(svgContainer);

                let chart1DesctDiv = document.createElement('div');
                //chart1DesctDiv.className = 'news-item content-box';  // Class 추가

                let chart1_desc = ["뉴스 기사에서 다루는 주요 내용을 가볍게 훑어보세요."];
                let chart1List_ulElement = document.createElement('ul');
                chart1List_ulElement.className = 'guidetext';  // 클래스 추가

                // 각 문장을 리스트 항목으로 추가
                chart1_desc.forEach(sentence => {
                    let listItem = document.createElement('li');
                    listItem.textContent = sentence;
                    chart1List_ulElement.appendChild(listItem);
                });
                chart1DesctDiv.appendChild(chart1List_ulElement);

                chartDiv.appendChild(chart1DesctDiv);

                //chartDiv.append(svgContainer);

                // *********************************************************** 
                // * (KEY)CONTENT > Chart > Type2 Chart
                // *********************************************************** 

                let svgContainer_bar = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svgContainer_bar.id = `news-${index + 1}-svg1`;
                svgContainer_bar.setAttribute('width', '100%');
                svgContainer_bar.setAttribute('height', '500px');

                top3 = drawClusterHorizontalBarChart(top = 3, colors, colors, category, index, svgContainer_bar, newsItem.data, new_mark);

                let chart2DesctDiv = document.createElement('div');
                //chart1DesctDiv.className = 'news-item content-box';  // Class 추가

                let chart2_desc = ["글을 위에서 아래로 읽듯, 뉴스 기사의 주요 내용을 읽어내려가세요."];
                let chart2List_ulElement = document.createElement('ul');
                chart2List_ulElement.className = 'guidetext';  // 클래스 추가

                // 각 문장을 리스트 항목으로 추가
                chart2_desc.forEach(sentence => {
                    let listItem = document.createElement('li');
                    listItem.textContent = sentence;
                    chart2List_ulElement.appendChild(listItem);
                });
                chart2DesctDiv.appendChild(chart2List_ulElement);
                chartDiv.appendChild(chart2DesctDiv);

                // *********************************************************** 
                // * (KEY)CONTENT > Chart > Type1 Button
                // *********************************************************** 
                let btTab01 = document.createElement('button');
                btTab01.innerHTML = 'Vertical Flow';
                btTab01.className = 'tab_info_button'; //'toggle_info_button';
                chartDiv.append(btTab01);

                btTab01.addEventListener('click', function () {
                    chart1DesctDiv.style.display = 'block';
                    chart2DesctDiv.style.display = 'none';

                    btTab01.classList.add('active');
                    btTab02.classList.remove('active');
                });



                // *********************************************************** 
                // * (KEY)CONTENT > Chart > Type2 Button
                // *********************************************************** 
                let btTab02 = document.createElement('button');
                btTab02.innerHTML = 'Circles';
                btTab02.className = 'tab_info_button';
                chartDiv.append(btTab02);

                btTab02.addEventListener('click', function () {
                    chart1DesctDiv.style.display = 'none';
                    chart2DesctDiv.style.display = 'block';

                    btTab01.classList.remove('active');
                    btTab02.classList.add('active');
                });

                // *********************************************************** 
                // * (KEY)CONTENT > Chart > Default
                // *********************************************************** 
                chart1DesctDiv.appendChild(svgContainer_bar);
                chart2DesctDiv.appendChild(svgContainer_circle);

                chart1DesctDiv.style.display = 'block';
                chart2DesctDiv.style.display = 'none';
                btTab01.classList.add('active');  //default state

                // *********************************************************** 
                // * (KEY)CONTENT > List
                // *********************************************************** 

                let newsContentList = document.createElement('ul');
                newsContentList.classList.add('newsContentList');


                let list_desc = ["핵심 내용과 관련 문장을 확인하세요.", "리스트 항목을 클릭하면 해당 문장의 원본 뉴스로 연결됩니다."];
                let list_desc_ulElement = document.createElement('ul');
                list_desc_ulElement.className = 'guidetext';  // 클래스 추가

                // 각 문장을 리스트 항목으로 추가
                list_desc.forEach(sentence => {
                    let listItem = document.createElement('li');
                    listItem.textContent = sentence;
                    list_desc_ulElement.appendChild(listItem);
                });
                newsContentList.appendChild(list_desc_ulElement);


                let color_bg = baseColors.map(baseColors => hexToRgba(baseColors, 0.3)); // 0.5는 투명도 값입니다.

                newsItem.contents.forEach((contentItem, contentIndex) => {
                    let contentLi = document.createElement('li');
                    contentLi.id = `news-${index + 1}-subitem-${contentIndex + 1}`;

                    // if (top3.includes(contentIndex + 1)) {
                    //     contentLi.style.backgroundColor = color_bg[contentIndex];
                    // }

                    let rank = top3.indexOf(contentIndex + 1); // 해당 content의 순위를 찾습니다.

                    if (rank > -1) {
                        // 순위에 따른 배경색 적용
                        contentLi.style.backgroundColor = color_bg[rank];

                        // 원래 배경색을 속성에 저장합니다.
                        contentLi.setAttribute('data-original-bg-color', color_bg[rank]);
                    }

                    // Check if contentIndex + 1 is included in new_mark array
                    let isNew = new_mark.includes(contentIndex + 1);
                    let newText = "";     // `핵심 내용${contentIndex + 1}.`;


                    let titleText;
                    let reversedIndex = newsItem.data.length - 1 - contentIndex;
                    if (newsItem.data[reversedIndex] && newsItem.data[reversedIndex].Desc && newsItem.data.length > reversedIndex) {
                        titleText = newsItem.data[reversedIndex].Desc;
                    } else {
                        titleText = "";
                    }

                    let title = titleText

                    newText = `${newText}  ${title}`;
                    if (isNew) {
                        newText = `<span class="newMarker">NEW</span> ${newText}`;
                    }

                    // Split into two divs for number and text
                    let numberDiv = document.createElement('div');
                    numberDiv.classList.add('numberDiv');
                    // numberDiv.style.backgroundColor = color_reverse[contentIndex]; // 배경색 추가
                    numberDiv.innerHTML = `<strong>${contentIndex + 1}</strong>`;

                    let textDiv = document.createElement('div');
                    textDiv.classList.add('textDiv');
                    textDiv.innerHTML = `<strong>${newText}</strong><br>${contentItem.content}`;

                    contentLi.appendChild(numberDiv);
                    contentLi.appendChild(textDiv);

                    contentLi.style.cursor = 'pointer';  // Set the mouse cursor to a pointer.
                    // contentLi.addEventListener('click', createContentClickHandler(category, index, contentItem));

                    contentLi.addEventListener('click', function () {
                        window.open(contentItem.link, '_blank');  // Open the link in a new window or tab.
                    });

                    newsContentList.appendChild(contentLi);


                    contentDiv.appendChild(newsContentList);
                });

                contentDiv.appendChild(newsContentList);


                // ***********************************************************
                // *
                // * ARTICLE LIST
                // *
                // ***********************************************************

                // article list (1)create div
                let articleDiv = document.createElement('div');
                articleDiv.id = `news-${index + 1}-list`;
                articleDiv.style.display = 'flex';
                articleDiv.style.flexDirection = 'column';


                // article list (2)title
                let listTitle = document.createElement('h3');
                listTitle.textContent = bulletpoint + '관련 기사 목록';
                listTitle.style.marginBottom = '10px';  // 타이틀과 본문 사이의 간격 조절
                articleDiv.appendChild(listTitle);


                // *********************************************************** 
                // * ARTICLE LIST > Expand to show
                // *********************************************************** 

                const btName_newsList = '관련 뉴스기사 ' + newsItem.count + '개'
                let btOnOff_newsList = document.createElement('button');
                btOnOff_newsList.innerHTML = ' ▼ ' + btName_newsList;
                btOnOff_newsList.className = 'newsitem_button'

                articleDiv.style.display = 'none';
                btOnOff_newsList.addEventListener('click', () => {
                    if (articleDiv.style.display === 'none' || !articleDiv.style.display) {
                        articleDiv.style.display = 'block';
                        btOnOff_newsList.innerHTML = ' ▲ ' + btName_newsList;  // 윗방향으로 화살표
                    } else {
                        articleDiv.style.display = 'none';
                        btOnOff_newsList.innerHTML = ' ▼ ' + btName_newsList;  // 아래방향으로 화살표
                    }
                });

                // article list (3)attach to newsDiv
                newsDiv.appendChild(btOnOff_newsList);
                newsDiv.appendChild(articleDiv);


                // *********************************************************** 
                // * ARTICLE LIST > Description
                // *********************************************************** 

                let newslistDiv = document.createElement('div');
                newslistDiv.className = 'news-item content-box';  // Class 추가

                let newslistDiv_list = ["관련 소식을 다루는 뉴스 기사 목록입니다."];
                let newsList_ulElement = document.createElement('ul');
                newsList_ulElement.className = 'guidetext';  // 클래스 추가

                // 각 문장을 리스트 항목으로 추가
                newslistDiv_list.forEach(sentence => {
                    let listItem = document.createElement('li');
                    listItem.textContent = sentence;
                    newsList_ulElement.appendChild(listItem);
                });
                newslistDiv.appendChild(newsList_ulElement);

                articleDiv.appendChild(newslistDiv);



                // *********************************************************** 
                // * ARTICLE LIST > list
                // *********************************************************** 

                const ITEMS_PER_PAGE = 10;
                let currentPage = 1;

                function renderItems(newsItems, tableElement, startIndex) {
                    // 먼저 테이블의 모든 row를 지운다.
                    while (tableElement.firstChild) {
                        tableElement.removeChild(tableElement.firstChild);
                    }

                    for (let i = startIndex; i < startIndex + ITEMS_PER_PAGE && i < newsItems.length; i++) {
                        let linkItem = newsItems[i];

                        if (linkItem && linkItem.title && linkItem.link) {
                            let row = tableElement.insertRow();
                            row.className = "newslist-row";

                            // Title Column with link
                            let titleCell = row.insertCell(0);
                            titleCell.className = "title";


                            // Title
                            let anchor = document.createElement('a');
                            anchor.href = linkItem.link;
                            anchor.textContent = linkItem.title;
                            anchor.className = "anchor";
                            titleCell.appendChild(anchor);

                            // Intro
                            if (linkItem.intro) {
                                let introElement = document.createElement('p');
                                introElement.textContent = `${linkItem.intro.trim()}...`;
                                introElement.className = "intro";
                                titleCell.appendChild(introElement);
                            }

                            // Media & Date
                            if (linkItem.media) {
                                let mediaElement = document.createElement('p');
                                mediaElement.style.color = "grey"; // Makes the text lighter
                                mediaElement.style.fontSize = "0.8em"; // Makes the text smaller
                                mediaElement.textContent = `${linkItem.media} | ${linkItem.date}`;
                                mediaElement.className = "media-date";
                                titleCell.appendChild(mediaElement);
                            }

                        }
                    }
                }

                function renderPagination(totalItems, paginationElement, callback) {
                    // 기존의 페이지 번호들을 지운다.
                    while (paginationElement.firstChild) {
                        paginationElement.removeChild(paginationElement.firstChild);
                    }

                    let totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

                    for (let i = 1; i <= totalPages; i++) {
                        let btn = document.createElement('button');
                        btn.textContent = i;
                        btn.className = 'navbutton';
                        btn.addEventListener('click', function () {
                            callback(i);
                            Array.from(paginationElement.children).forEach(button => {
                                button.classList.remove('highlighted');
                            });
                            btn.classList.add('highlighted');  // 현재 페이지 번호 버튼에 highlight 스타일 적용
                        });
                        paginationElement.appendChild(btn);
                    }

                    // 기본적으로 첫 번째 페이지 버튼을 highlighted 상태로 만든다.
                    if (paginationElement.firstChild) {
                        paginationElement.firstChild.classList.add('highlighted');
                    }
                }

                // 여기서 newsListData에서 index에 해당되는 뉴스 항목을 찾아서 그립니다.
                let matchingNewItem = newsListData.find(item => item.group_index === index);

                if (matchingNewItem && Array.isArray(matchingNewItem.link)) {
                    let table = document.createElement('table');
                    newslistDiv.appendChild(table);

                    let paginationDiv = document.createElement('div');
                    newslistDiv.appendChild(paginationDiv);

                    renderItems(matchingNewItem.link, table, 0); // 초기에는 첫 번째 페이지의 아이템들을 그린다.
                    renderPagination(matchingNewItem.link.length, paginationDiv, function (page) {
                        renderItems(matchingNewItem.link, table, (page - 1) * ITEMS_PER_PAGE);
                    });
                }


                // ***********************************************************
                // *
                // * DONE (newsDiv)
                // *
                // ***********************************************************
                newsContainer.appendChild(newsDiv);
            });
        })
        .catch(error => {
            console.error('Error:', error); // 에러가 발생하면 콘솔에 에러를 출력
        });
}



function createContentClickHandler(category, index, contentItem) {
    return function handleContentClick(event) {
        const contentLi = event.currentTarget;
        const contentIndex = Array.from(contentLi.parentElement.children).indexOf(contentLi);

        console.log(`Item ${contentIndex + 1} was clicked`);
        highlightSelected(contentLi);  // 선택된 항목을 하이라이트 합니다.

        let clickedText = contentLi.innerText.replace(`${contentIndex + 1}. `, '');

        openRightPane(category, index, contentIndex, contentItem, clickedText);
        // const specificArticles = getArticlesByGroupAndLabel(category, index, contentIndex, classifiedData);
        // displayTextInRightPane(contentItem.link, clickedText, specificArticles);
    };
}


function openRightPane(category, index, contentIndex, contentItem, clickedText) {
    const specificArticles = getArticlesByGroupAndLabel(category, index, contentIndex, classifiedData);
    displayTextInRightPane(contentItem.link, clickedText, specificArticles);
};


//--------------------------------------------------
// 뉴스 클러스터 센턴스 불러오기
//--------------------------------------------------

// 서버 연동 버전
// async function load_cluster_sentences_by_category(csv_filename) {


//     fetchDataFromServerWithPost('http://localhost:5000/sentences', { filename: csv_filename })
//         .then(data => {
//             console.log(data);
//         })
//         .catch(error => {
//             console.error("There was an error fetching data:", error);
//         });
// }


// 데모버전
async function load_cluster_sentences_by_category(json_filename, ext = 'json') {

    // 웹 서버에서 JSON 데이터를 가져옵니다.
    let filepath = './data_cluster_sentences/' + json_filename + '.' + ext
    console.log(filepath)

    // JSON 파일 로드
    const response = await fetch(filepath);
    const articles = await response.json();

    // 데이터 분류
    let classifiedData = {};

    articles.forEach(article => {
        const groupIndex = article.group_index;
        const label = article.label;

        if (!classifiedData[groupIndex]) {
            classifiedData[groupIndex] = {};
        }
        if (!classifiedData[groupIndex][label]) {
            classifiedData[groupIndex][label] = [];
        }

        classifiedData[groupIndex][label].push(article);
    });

    return classifiedData;
}


function getArticlesByGroupAndLabel(category, groupIndex, label, classifiedData) {

    console.log(category, groupIndex, label, classifiedData)

    if (classifiedData[category] && classifiedData[category][groupIndex] && classifiedData[category][groupIndex][label]) {
        return classifiedData[category][groupIndex][label];
    }
    return [];
}




//--------------------------------------------------
// 뉴스 클러스터 센턴스 보여주기
//--------------------------------------------------


function highlightSelected(element) {
    // 이미 하이라이트된 항목을 누른 경우 하이라이트를 제거합니다.
    if (element.style.backgroundColor === 'lightyellow') {
        // 원래의 배경색으로 복구합니다.
        element.style.backgroundColor = element.getAttribute('data-original-bg-color') || '';
    } else {
        // 아니라면 모든 항목의 하이라이트를 제거하고, 선택한 항목에만 하이라이트를 적용합니다.
        // let items = document.querySelectorAll('li');
        // items.forEach((item) => {
        //     item.style.backgroundColor = item.getAttribute('data-original-bg-color') || '';
        // });
        let items = document.querySelectorAll('li');
        items.forEach((item) => {
            if (/news-\d+-subitem-\d+/.test(item.id)) {
                item.style.backgroundColor = item.getAttribute('data-original-bg-color') || '';
            }
        });

        // 원래의 배경색을 저장합니다.
        element.setAttribute('data-original-bg-color', element.style.backgroundColor);
        element.style.backgroundColor = 'lightyellow';
    }
}


// 닫히기 버튼이나 닫히기 이벤트에 이 함수를 연결하세요.
function clearHighlightWhenRightPaneClosed() {
    let rightPane = document.getElementById('rightPane');
    if (rightPane.style.display === 'none') {
        // let items = document.querySelectorAll('li');
        // items.forEach((item) => {
        //     // 원래의 배경색으로 복구합니다.
        //     item.style.backgroundColor = item.getAttribute('data-original-bg-color') || '';
        // });
        let items = document.querySelectorAll('li');
        items.forEach((item) => {
            if (/news-\d+-subitem-\d+/.test(item.id)) {
                item.style.backgroundColor = item.getAttribute('data-original-bg-color') || '';
            }
        });
    }
}


function displayTextInRightPane(newsurl, text, sentencesList) {
    const rightPane = document.getElementById('rightPane');

    // 패널이 이미 열려있다면 닫습니다.
    if (rightPane.style.display === 'block') {
        rightPane.style.display = 'none';
        clearHighlightWhenRightPaneClosed();  // 하이라이트를 제거합니다.
    }
    // 패널이 닫혀있다면 엽니다.
    else {
        // 패널을 보이게 하고, 기존의 내용을 지웁니다
        rightPane.style.display = 'flex';
        rightPane.innerHTML = '';

        // '닫기' 버튼을 추가합니다
        const closeButton = document.createElement('button');
        closeButton.innerText = '닫기';
        closeButton.onclick = function () {
            rightPane.style.display = 'none';  // 패널을 숨깁니다
            clearHighlightWhenRightPaneClosed();  // 하이라이트를 제거합니다.
        };
        rightPane.appendChild(closeButton);


        // 설명 문장들을 배열로 저장
        const descriptionList = [
            '이 화면은 사용자가 선택한 뉴스 기사 문장과 관련된 내용을 보여줍니다.',
            '사용자가 선택한 문장은, 전체 뉴스 기사의 문장들을 클러스터링(군집화)했을 때, 가장 군집의 가운데 위치하는 값(centroid)이자, 핵심 내용입니다.',
            '핵심 내용 이 외에, 함께 클러스터로 뭉쳐진 다른 문장들을 살펴보세요.'
        ];

        // ul 요소 생성
        const ulElement = document.createElement('ul');
        ulElement.className = 'guidetext';  // 클래스 추가


        // 각 문장을 li 요소로 만들어 ul 요소에 추가
        descriptionList.forEach(desc => {
            const liElement = document.createElement('li');
            liElement.innerText = desc;
            ulElement.classList.add('ul');
            ulElement.appendChild(liElement);
        });

        // ul 요소를 rightPane에 추가
        rightPane.appendChild(ulElement);




        // 새로운 div 생성
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('section');


        // 화면 구성

        // "클릭한 문장:" 출력
        const label_text = document.createElement('strong');
        label_text.innerText = '클릭한 문장:';
        contentDiv.appendChild(label_text);

        // text 출력
        const content = document.createElement('p');
        text = text.replace(/핵심 내용\d+\./, '').trim();
        content.innerText = text;
        contentDiv.appendChild(content);



        let sent_link_divider = document.createElement('hr');
        sent_link_divider.classList.add('custom-divider');  // CSS 클래스 추가
        contentDiv.appendChild(sent_link_divider);

        // "원본 뉴스 보기" 출력
        const label_link = document.createElement('strong'); // strong 태그로 굵은 글씨체 사용
        label_link.innerText = '원본 뉴스 보기:';
        contentDiv.appendChild(label_link);

        // 줄바꿈 추가
        contentDiv.appendChild(document.createElement('br'));

        // 링크 추가
        let link = document.createElement('a');
        link.href = newsurl;
        link.target = '_blank';
        link.innerText = newsurl;
        contentDiv.appendChild(link);


        // contentDiv를 rightPane에 추가합니다
        rightPane.appendChild(contentDiv);


        // 새로운 div 생성
        const candidatesDiv = document.createElement('div');
        candidatesDiv.classList.add('section');


        // "클릭한 문장:" 출력
        const label_candidates = document.createElement('strong');
        label_candidates.innerText = '비슷한 내용으로 군집화된 다른 문장들:';
        candidatesDiv.appendChild(label_candidates);




        let candidates_divider = document.createElement('hr');
        candidates_divider.classList.add('custom-divider');  // CSS 클래스 추가
        candidatesDiv.appendChild(candidates_divider);


        // text 출력
        const sentences = document.createElement('p');
        sentences.innerText = "관련 기사들에서 비슷한 것으로 분류된 문장들입니다. ";
        candidatesDiv.appendChild(sentences);





        // specificArticles 정보 출력
        console.log("*****************")

        // specificArticles 정보 출력
        sentenceCount = 0
        sentencesList.forEach(article => {
            console.log(article)
            const sentenceListDiv = document.createElement('div');
            sentenceListDiv.classList.add('sentencelist'); //  스타일링을 위해


            const count = document.createElement('h3');
            sentenceCount += 1
            count.innerText = sentenceCount
            sentenceListDiv.appendChild(count);

            const sentence = document.createElement('p');
            sentence.innerText = article.sentence;
            sentenceListDiv.appendChild(sentence);

            const link = document.createElement('a'); // 'a' 태그 사용
            link.href = article.link; // 'href' 속성에 링크 설정
            link.innerText = article.link; // 가정: 각 기사에 'link' 속성이 있다.
            link.target = "_blank"; // 새 탭에서 링크 열기
            sentenceListDiv.appendChild(link);

            candidatesDiv.appendChild(sentenceListDiv);
        });


        // contentDiv를 rightPane에 추가합니다
        rightPane.appendChild(candidatesDiv);
    }
}



//--------------------------------------------------
// D3 막대 그래프 그리기
//--------------------------------------------------

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


//--------------------------------------------------
// 문장 클러스터 시각화 그래프 모음
//--------------------------------------------------

// function drawClusterGraph(category, index, svgElement, data, new_mark) {
//     //drawClusterHorizontalBarChart(category, index, svgElement, data, new_mark);

//     // drawClusterHorizontalCircles(category, index, svgElement, data, new_mark);

//     drawClusteredCirclesByRatio(category, index, svgElement, data, new_mark);
// }

// y축 값을 "핵심 내용1", "핵심 내용2", ... 로 변경하는 함수
function convertToRepresentative(clusterNum) {
    return "핵심 내용" + clusterNum;
}

//--------------------------------------------------
// 문장 클러스터 시각화 - (1)바차트
//--------------------------------------------------

function drawClusterHorizontalBarChart(top, rankingColors, colors, category, index, svgElement, data, new_mark) {

    // data를 Count 값에 따라 내림차순으로 정렬
    var sortedData = data.slice().sort((a, b) => b.Count - a.Count);

    // 상위 3개의 Cluster 값을 가져옴
    var topClusters = sortedData.slice(0, top).map(d => d.Cluster);

    // 고정된 bar의 높이
    const fixedBarHeight = 50;

    var barHeight = fixedBarHeight;
    var barSpacing = 20;

    // 동적으로 SVG의 높이를 설정합니다.
    var dynamicHeight = data.length * (barHeight + barSpacing);

    var margin = { top: 120, right: 150, bottom: 80, left: 70 },
        initialWidth = 1280,
        initialHeight = 500,
        scaleRatio = 1.3, // 130%
        width = (initialWidth * scaleRatio - margin.left - margin.right) / 3,
        height = dynamicHeight; // 동적 높이를 사용합니다.

    var svg = d3.select(svgElement)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // x scale - 이제 문장의 개수로 스케일링
    var x = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return d.Count; })])
        .range([0, width]);

    // x축 틱(tick)
    // svg.append("g")
    //     .call(d3.axisBottom(x))
    //     .attr("transform", "translate(0," + height + ")")
    //     .selectAll("text")
    //     .style("fill", "#000000");

    // y scale - 클러스터 종류
    var y = d3.scaleBand()
        .range([height, 0])
        .domain(data.sort((a, b) => b.Cluster - a.Cluster).map(function (d) { return convertToRepresentative(d.Cluster); }))
        .padding(0.8);


    /*--축 정보 그리기 ------------------------------*/

    svg.append("g")
        .call(d3.axisLeft(y).tickSize(0).tickFormat(""))  // 틱 크기를 0으로 설정하여 y축의 틱을 제거합니다.
        .selectAll("path")  // y축의 경로를 선택합니다.
        .attr("stroke-width", 2.5)  // y축의 두께를 2로 설정합니다.
        .attr("stroke-dasharray", "5,5")  // 5픽셀 실선, 5픽셀 공백의 점선 패턴으로 설정
        .attr("stroke", "#aaa")  // y축의 색깔을 #aaa로 설정
        .selectAll("line")  // y축의 라인을 선택합니다.
        .attr("stroke-width", 2)  // y축의 라인 두께를 2로 설정합니다.
        .attr("stroke", "#aaa");  // y축의 라인 색깔을 #aaa로 설정

    // // y축 레이블 (클러스터 종류)
    // svg.append("text")
    //     .attr("transform", "rotate(-90)")
    //     .attr("y", 0 - margin.left / 1.5)
    //     .attr("x", 0 - (height / 2))
    //     .attr("text-anchor", "middle")
    //     .style("font-size", "0.8em")
    //     .text("클러스터 종류");

    // // x축 레이블 (문장개수)
    // svg.append("text")
    //     .attr("x", width / 2)
    //     .attr("y", height + margin.bottom / 1.5)
    //     .attr("text-anchor", "middle")
    //     .style("font-size", "0.8em")
    //     .text("포함된 문장 개수");


    /*--타임라인 느낌주기 ------------------------------*/

    // y축에 원과 날짜 텍스트 추가
    svg.append("circle")
        .attr("cx", 0)  // 원의 x 위치를 y축에서 왼쪽으로 조금 이동합니다.
        .attr("cy", 0)  // 원의 y 위치를 y축 맨 위로 설정합니다.
        .attr("r", 10)  // 원의 반지름을 설정합니다.
        .attr("fill", "blue");  // 원의 색상을 파란색으로 설정합니다.

    svg.append("text")
        .attr("x", -10)  // 텍스트의 x 위치를 원의 중앙으로 설정합니다.
        .attr("y", -30)  // 텍스트의 y 위치를 원 위로 조금 이동합니다.
        .attr("text-anchor", "middle")  // 텍스트를 중앙 정렬합니다.
        .style("font-size", "1em")  // 텍스트의 크기를 설정합니다.
        .style("font-weight", "bold")  // 텍스트를
        .text("2023.08.25");  // 텍스트 내용을 설정합니다.

    /*--bar graph 막대 그리기 ------------------------------*/

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("y", function (d) { return y(convertToRepresentative(d.Cluster)) + (y.bandwidth() - fixedBarHeight) / 2; })
        .attr("height", fixedBarHeight)
        .attr("x", 3) //막대 오른쪽으로 조금 옮기기
        .attr("width", function (d) { return x(d.Count); })
        .attr("fill", (d) => {
            let rank = topClusters.indexOf(d.Cluster);  // 원의 순위를 찾습니다.
            if (rank !== -1) {
                return rankingColors[rank];  // 순위에 따라 색상을 반환합니다.
            } else {
                return color_lightgrey; // '#FFFFFF'; // color_lightgrey; 
            }
        })
        //        .attr("fill", (d, i) => topClusters.includes(d.Cluster) ? colors[colors.length - 1 - i] : color_lightgrey)
        .attr("stroke", "#000000")
        .attr("stroke-width", function (d) {
            return (new_mark.length !== 0 && new_mark.includes(d.Cluster)) ? 3 : 1;
        });




    /*--bar graph 위에 텍스트 ------------------------------*/

    let total = d3.sum(data, d => d.Count);



    svg.selectAll(".barTextContainer")
        .data(data)
        .enter().append("foreignObject")
        .attr("class", "barTextContainer")
        .attr("x", 5)
        // .attr("y", d => y(convertToRepresentative(d.Cluster)))
        .attr("y", d => y(convertToRepresentative(d.Cluster)) + y.bandwidth() / 2 - fixedBarHeight / 2)
        .attr("width", d => x(d.Count) - 10)  // 10을 빼서 텍스트 시작점과 오른쪽 여백을 고려
        .attr("height", fixedBarHeight) // y.bandwidth() * 1.5)
        .append("xhtml:div")
        .style("display", "flex")
        .style("align-items", "center")  // 세로 중앙 정렬
        .style("font-size", "0.8em")
        .style("word-wrap", "break-word")  // 단어 분리 기능 활용
        .style("text-align", "start")  // 왼쪽 정렬
        .style("width", "100%")
        .style("height", "100%")
        .style("padding", "0")
        .html(function (d) {
            let descriptions = [];
            if (new_mark.length !== 0 && new_mark.includes(d.Cluster)) {
                descriptions.push("[NEW]");
            }
            if (d.Desc) {
                descriptions.push(d.Desc);
            } else {
                descriptions.push(description[d.Cluster - 1]);
            }
            return descriptions.join('<br>');
        });

    // SVG의 bounding box를 사용하여 크기를 조절
    var bbox = svg.node().getBBox();
    var extraPadding = 200;

    d3.select(svgElement.parentNode)
        .attr("width", bbox.width + extraPadding)
        .attr("height", bbox.height + extraPadding)
        .attr("viewBox", [bbox.x - extraPadding / 2, bbox.y - extraPadding / 2, bbox.width + extraPadding, bbox.height + extraPadding]);

    svg.attr("transform", `translate(${-bbox.x + extraPadding / 2}, ${-bbox.y + extraPadding / 2})`);


    // ratio % 텍스트 추가
    svg.selectAll(".ratioText")
        .data(data)
        .enter().append("text")
        .attr("class", "ratioText")
        .attr("x", function (d) { return x(d.Count) + 5 + 5; })
        .attr("y", function (d) { return y(convertToRepresentative(d.Cluster)) + y.bandwidth() / 2; })
        .attr("text-anchor", "start")
        .attr("alignment-baseline", "middle")
        .style("font-size", "12px")
        .style("fill", "darkgray")  // 글자의 색깔을 "darkgray"로 설정
        // .text(d => `(${d.Count}개, ${((d.Count / total) * 100).toFixed(2)}%)`);
        .text(d => `${((d.Count / total) * 100).toFixed(2)}%`);


    return topClusters;
}






//--------------------------------------------------
// 문장 클러스터 시각화 - (2)도형
//--------------------------------------------------

function drawClusteredCirclesByRatio(top, rankingColors, colors, category, index, svgElement, data, new_mark) {

    // data를 Count 값에 따라 내림차순으로 정렬
    var sortedData = data.slice().sort((a, b) => b.Count - a.Count);

    // 상위 3개의 Cluster 값을 가져옴
    var topClusters = sortedData.slice(0, top).map(d => d.Cluster);

    var circleSizeMax = 100;
    var rScale = d3.scaleSqrt()
        .domain([0, d3.max(data, d => d.Count)])
        .range([0, circleSizeMax]); // (500 / 25) * 4 * circlesizeup]);  // 원의 크기 조절


    // 고정된 원 간의 간격
    var circleSpacing = 50;

    // 원들 간의 전체 너비 계산
    var totalWidthOfCircles = data.reduce((acc, d) => acc + 2 * rScale(d.Count) + circleSpacing, 0) - circleSpacing; // 마지막 원 다음의 간격을 빼줍니다.


    var margin = { top: 120, right: 100, bottom: 80, left: 100 },
        initialWidth = 1280,
        initialHeight = 500,
        scaleRatio = 1.3, // 130%
        width = totalWidthOfCircles + margin.left + margin.right, // (initialWidth * scaleRatio - margin.left - margin.right) / 3,
        height = (initialHeight * scaleRatio - margin.top - margin.bottom) / 3;

    var svg = d3.select(svgElement)
        .attr("width", width) // + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var totalSentences = d3.sum(data, d => d.Count);

    var x = d3.scaleBand()
        .range([0, width])
        .domain(data.sort((a, b) => a.Cluster - b.Cluster).map(d => convertToRepresentative(d.Cluster)))  // a와 b의 순서를 변경하여 오름차순 정렬
        .padding(0.2);


    /*-- graph 원 그리기 ------------------------------*/


    rankingColors = colors.slice(0, top);  // 데이터에 필요한 수만큼의 색상만 추출하기


    let description = data.map((d, index) => `클러스터 번호 ${index + 1}`);

    let currentXPosition = 0;
    // 원들을 그립니다
    svg.selectAll(".circle")
        .data(data)
        .enter().append("circle")
        .attr("class", "circle")
        // .attr("cx", d => x(convertToRepresentative(d.Cluster)) + x.bandwidth() / 2)
        .attr("cx", d => {
            let cx = currentXPosition + rScale(d.Count);
            currentXPosition += 2 * rScale(d.Count) + circleSpacing;
            return cx;
        })
        .attr("cy", (height + margin.top + margin.bottom) / 2) // 원의 y 위치는 SVG의 중앙으로 설정합니다.

        //        .attr("cy", height / 2) // 원의 y 위치는 중앙으로 설정합니다.
        .attr("r", d => rScale(d.Count))
        // .attr("fill", (d, i) => colors[colors.length - 1 - i]) // 인덱스를 역순으로 사용
        // .attr("fill", (d, i) => topClusters.includes(d.Cluster) ? colors[colors.length - 1 - i] : color_lightgrey)
        .attr("fill", (d) => {
            let rank = topClusters.indexOf(d.Cluster);  // 원의 순위를 찾습니다.
            if (rank !== -1) {
                return rankingColors[rank];  // 순위에 따라 색상을 반환합니다.
            } else {
                return color_lightgrey; // '#FFFFFF'; // color_lightgrey; 
            }
        })
        .attr("stroke", "#000000")
        //        .attr("stroke-width", d => new_mark.length !== 0 && new_mark.includes(d.Cluster) ? 3 : 1);
        .attr("stroke-width", d => {
            let rank = topClusters.indexOf(d.Cluster);
            if (rank !== -1) {
                return 1.5;  // 원이 상위 클러스터에 속하는 경우 굵기를 4로 설정합니다.
            } else if (new_mark.length !== 0 && new_mark.includes(d.Cluster)) {
                return 3;  // 원이 new_mark 배열에 포함되어 있을 때 굵기를 3으로 설정합니다.
            } else {
                return 1;  // 위의 조건에 모두 해당되지 않는 경우 굵기를 1로 설정합니다.
            }
        });


    currentXPosition = 0; // cx 계산을 위한 위치 초기화

    // 원 아래에 % 정보
    svg.selectAll(".circleTextDescription")
        .data(data)
        .enter().append("text")
        .attr("class", "circleTextDescription")
        // .attr("x", d => x(convertToRepresentative(d.Cluster)) + x.bandwidth() / 2)
        .attr("x", d => {
            let x = currentXPosition + rScale(d.Count);
            currentXPosition += 2 * rScale(d.Count) + circleSpacing;
            return x;
        })

        .attr("y", d => (height + margin.top + margin.bottom) / 2 + rScale(d.Count) + 15)  // 원의 중심보다 원의 반지름과 추가로 15px 아래로 이동

        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "hanging")  // 'hanging'으로 변경하여 tspan이 올바르게 정렬되도록 합니다.
        .style("font-size", "0.8em")
        .each(function (d) {  // .each() 함수를 사용하여 각 데이터 항목에 대한 처리를 수행합니다.
            let percentage = (d.Count / totalSentences) * 100;
            d3.select(this).append("tspan")  // 두 번째 행 (비율)을 추가합니다.
                .attr("fill", "darkgray")  // 진한 회색으로 텍스트 색상 변경
                .text(`${percentage.toFixed(2)}%`);
            //                .text(d => `(${d.Count}개, ${percentage.toFixed(2)}%)`);
        });

    currentXPosition = 0; // cx 계산을 위한 위치 초기화
    svg.selectAll(".circleTextContainer")
        .data(data)
        .enter().append("foreignObject")
        .attr("class", "circleTextContainer")
        // .attr("x", d => x(convertToRepresentative(d.Cluster)) + x.bandwidth() / 2 - (rScale(d.Count) * 2) / 2)
        .attr("x", d => {
            let x = currentXPosition;
            currentXPosition += 2 * rScale(d.Count) + circleSpacing;
            return x;
        })
        .attr("y", d => (height + margin.top + margin.bottom) / 2 - rScale(d.Count)) // 원의 중심에서 반지름만큼 위로 이동

        // .attr("y", d => (height / 2) - rScale(d.Count))
        .attr("width", d => rScale(d.Count) * 2)
        .attr("height", d => rScale(d.Count) * 2)
        .append("xhtml:div")
        .style("display", "flex")
        .style("align-items", "center") // centers text vertically
        .style("justify-content", "center") // centers text horizontally
        .style("font-size", "12px")
        .style("word-wrap", "break-word")
        .style("text-align", "center")
        .style("width", "100%")
        .style("height", "100%")
        .style("padding", "0")  // padding을 0으로 설정
        .html(function (d) {
            let descriptions = [];
            if (new_mark.length !== 0 && new_mark.includes(d.Cluster)) {
                descriptions.push("[NEW]");
            }
            if (d.Desc) {
                descriptions.push(d.Desc);
            } else {
                descriptions.push(description[d.Cluster - 1]);
            }
            return descriptions.join('<br>');
        });



    // 다음의 코드를 추가

    var bbox = svg.node().getBBox();
    var extraPadding = 20;  // 추가 패딩

    d3.select(svgElement.parentNode)  // SVG 요소에 접근
        .attr("width", bbox.width + extraPadding)
        .attr("height", bbox.height + extraPadding)
        .attr("viewBox", [bbox.x - extraPadding / 2, bbox.y - extraPadding / 2, bbox.width + extraPadding, bbox.height + extraPadding]);

    svg.attr("transform", `translate(${-bbox.x + extraPadding / 2}, ${-bbox.y + extraPadding / 2})`);

    return topClusters;
}



//--------------------------------------------------
// 문장 클러스터 시각화 - (3)도형리스트
//--------------------------------------------------

function drawClusterHorizontalCircles(colors, category, index, svgElement, data, new_mark) {

    var margin = { top: 120, right: 200, bottom: 80, left: 100 },
        initialWidth = 1280,
        initialHeight = 500,
        scaleRatio = 1.3,
        width = (initialWidth * scaleRatio - margin.left - margin.right) / 3,
        height = (initialHeight * scaleRatio - margin.top - margin.bottom) / 3;

    var svg = d3.select(svgElement)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", -(margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("뉴스 문장 군집화 결과");

    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", -(margin.top / 2) + 25)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("y축은 클러스터 종류, x축은 클러스터에 포함된 문장 개수를 나타냅니다.");

    var x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Count)])
        .range([0, width]);

    svg.append("g")
        .call(d3.axisBottom(x))
        .attr("transform", "translate(0," + height + ")")
        .selectAll("text")
        .style("fill", "#000000");

    var y = d3.scaleBand()
        .range([height, 0])
        .domain(data.sort((a, b) => b.Cluster - a.Cluster).map(d => convertToRepresentative(d.Cluster)))
        .padding(0.2);

    svg.append("g")
        .call(d3.axisLeft(y))
        .selectAll("text")
        .style("fill", "#000000");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left / 1.5)
        .attr("x", 0 - (height / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("클러스터 종류");

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom / 1.5)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("포함된 문장 개수");

    let description = data.map((d, index) => `클러스터 번호 ${index + 1}`);

    svg.selectAll(".circleText")
        .data(data)
        .enter().append("text")
        .attr("class", "circleText")
        .attr("x", d => x(d.Count) + 5)
        .attr("y", d => y(convertToRepresentative(d.Cluster)) + y.bandwidth() / 2)
        .attr("text-anchor", "start")
        .attr("alignment-baseline", "middle")
        .style("font-size", "1em")
        .each(function (d) {
            let node = d3.select(this);
            if (new_mark.length !== 0 && new_mark.includes(d.Cluster)) {
                node.append("tspan")
                    .style("font-weight", "bold")
                    .text("[NEW] ");
            }
            if (d.Desc) {
                node.append("tspan").text(d.Desc);
            } else {
                node.append("tspan").text(description[d.Cluster - 1]);
            }
        });

    svg.selectAll(".circle")
        .data(data)
        .enter().append("circle")
        .attr("class", "circle")
        .attr("cy", d => y(convertToRepresentative(d.Cluster)) + y.bandwidth() / 2)
        .attr("cx", d => x(d.Count))
        .attr("r", y.bandwidth() / 2)
        .attr("fill", (d, i) => colors[i % colors.length])
        .attr("stroke", "#000000")
        .attr("stroke-width", d => new_mark.length !== 0 && new_mark.includes(d.Cluster) ? 3 : 1);
}
