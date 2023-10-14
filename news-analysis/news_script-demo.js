
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
                    timelineTitle.textContent = bulletpoint + '타임라인';
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


                    let timeline_desc = ["관련된 이슈를 다루는 뉴스 기사들이 시간이 지남에 따라 어떤 내용을 주요하게 다루는 가를 분석한 내용입니다."];

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

                    drawContextTimeseriesHorizonGraph(category, index, timelineChart1, timelineFilepath);
                    timelineChartDiv.appendChild(timelineChart1);

                    // *********************************************************** 
                    // * TIMELINE > Chart > Type2 Chart
                    // *********************************************************** 

                    let timelineChart = document.createElement('div');
                    timelineChart.style.display = 'flex';
                    timelineChart.style.flexDirection = 'column';

                    drawContextTimeseriesOverlappingAreaGraph(category, index, timelineChart, timelineFilepath);
                    timelineChartDiv.appendChild(timelineChart);


                    // *********************************************************** 
                    // * TIMELINE > Chart > Type1 Button
                    // *********************************************************** 
                    let btTab01_timeline = document.createElement('button');
                    btTab01_timeline.innerHTML = '타임라인 보기';
                    btTab01_timeline.className = 'tab_info_button';
                    timelineChartDiv.append(btTab01_timeline);

                    btTab01_timeline.addEventListener('click', function () {
                        timelineChart1.style.display = 'block';
                        timelineChart.style.display = 'none';

                        btTab01_timeline.classList.add('active');
                        btTab02_timeline.classList.remove('active');
                    });

                    timelineChart1.style.display = 'block';
                    timelineChart.style.display = 'none';
                    btTab01_timeline.classList.add('active');  //default

                    // *********************************************************** 
                    // * TIMELINE > Chart > Type2 Button
                    // *********************************************************** 
                    let btTab02_timeline = document.createElement('button');
                    btTab02_timeline.innerHTML = '가중치 함께 보기';
                    btTab02_timeline.className = 'tab_info_button';
                    timelineChartDiv.append(btTab02_timeline);

                    btTab02_timeline.addEventListener('click', function () {
                        timelineChart1.style.display = 'none';
                        timelineChart.style.display = 'block';

                        btTab01_timeline.classList.remove('active');
                        btTab02_timeline.classList.add('active');
                    });
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
                contentTitle.textContent = bulletpoint + '핵심 내용';
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
                let btToggle_text = '핵심 내용은 어떻게 도출되었나요?'
                btToggle_info.innerHTML = ' ▼ ' + btToggle_text;
                btToggle_info.className = 'additional_info_button';

                let sentences = ["관련 그룹의 전체 뉴스 기사에 대하여 문장을 분리하여, 문장을 분석한 내용입니다."];

                if (total_articles !== 0 && total_sentences !== 0) {
                    sentences.push(`<strong>전체 관련 기사는 ${total_articles}개</strong> 이고, <strong>총 ${total_sentences}개</strong>의 문장을 분석했습니다.`);
                }

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

                var colors = [
                    "#f2d4d7", // muted pink
                    "#d4f2d6", // muted green
                    "#d4f3f4", // muted cyan
                    "#d4d7f2", // muted blue
                    "#f2d4f1", // muted purple
                    "#f4d4d4", // muted red
                    "#d4d4f2", // muted indigo
                    "#e1e1e1", // muted gray
                    "#d1d1d1", // silver
                    "#f2d7d4"  // muted salmon
                ];
                colors = shuffle(colors);

                // *********************************************************** 
                // * (KEY)CONTENT > Chart > Type1 Chart
                // *********************************************************** 

                let svgContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svgContainer.id = `news-${index + 1}-svg`;
                svgContainer.setAttribute('width', '100%');
                svgContainer.setAttribute('height', '500px');

                drawClusteredCirclesByRatio(colors, category, index, svgContainer, newsItem.data, new_mark);
                chartDiv.append(svgContainer);

                // *********************************************************** 
                // * (KEY)CONTENT > Chart > Type2 Chart
                // *********************************************************** 

                let svgContainer1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svgContainer1.id = `news-${index + 1}-svg1`;
                svgContainer1.setAttribute('width', '100%');
                svgContainer1.setAttribute('height', '500px');

                drawClusterHorizontalBarChart(colors, category, index, svgContainer1, newsItem.data, new_mark);
                chartDiv.append(svgContainer1);


                // *********************************************************** 
                // * (KEY)CONTENT > Chart > Type1 Button
                // *********************************************************** 
                let btTab01 = document.createElement('button');
                btTab01.innerHTML = '도형으로 보기';
                btTab01.className = 'tab_info_button'; //'toggle_info_button';
                chartDiv.append(btTab01);

                btTab01.addEventListener('click', function () {
                    svgContainer.style.display = 'block';
                    svgContainer1.style.display = 'none';

                    btTab01.classList.add('active');
                    btTab02.classList.remove('active');
                });

                svgContainer.style.display = 'block';
                svgContainer1.style.display = 'none';
                btTab01.classList.add('active');  //default state

                // *********************************************************** 
                // * (KEY)CONTENT > Chart > Type2 Button
                // *********************************************************** 
                let btTab02 = document.createElement('button');
                btTab02.innerHTML = '막대차트로 보기';
                btTab02.className = 'tab_info_button';
                chartDiv.append(btTab02);

                btTab02.addEventListener('click', function () {
                    svgContainer.style.display = 'none';
                    svgContainer1.style.display = 'block';

                    btTab01.classList.remove('active');
                    btTab02.classList.add('active');
                });


                // *********************************************************** 
                // * (KEY)CONTENT > List
                // *********************************************************** 

                let newsContentList = document.createElement('ul');
                newsContentList.classList.add('newsContentList');

                newsItem.contents.forEach((contentItem, contentIndex) => {
                    let contentLi = document.createElement('li');
                    contentLi.id = `news-${index + 1}-subitem-${contentIndex + 1}`;

                    // new_mark 배열 안에 contentIndex + 1 값이 포함되어 있는지 확인
                    let isNew = new_mark.includes(contentIndex + 1);
                    let newText = `핵심 내용${contentIndex + 1}.`;


                    let titleText;
                    let reversedIndex = newsItem.data.length - 1 - contentIndex;

                    if (newsItem.data.length > reversedIndex) {
                        titleText = newsItem.data[reversedIndex].Desc;
                    } else {
                        titleText = "";
                    }

                    let title = titleText

                    newText = `${newText}  ${title}`;
                    if (isNew) {
                        newText = `<span class="newMarker">NEW</span> ${newText}`;
                    }

                    newText = `<strong>${newText}</strong><br>${contentItem.content}`;  // 굵은 글씨를 위해 <strong> 태그로 감쌈

                    contentLi.innerHTML = newText;
                    contentLi.style.cursor = 'pointer';  // 마우스 커서가 포인터로 바뀝니다.
                    // 클릭 이벤트 임시 삭제
                    // contentLi.addEventListener('click', createContentClickHandler(category, index, contentItem));
                    newsContentList.appendChild(contentLi);
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

                            let titleCell = row.insertCell(0);
                            let anchor = document.createElement('a');
                            anchor.href = linkItem.link;
                            anchor.textContent = linkItem.title;
                            titleCell.appendChild(anchor);
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
        element.style.backgroundColor = '';
    } else {
        // 아니라면 모든 항목의 하이라이트를 제거하고, 선택한 항목에만 하이라이트를 적용합니다.
        let items = document.querySelectorAll('li');
        items.forEach((item) => {
            item.style.backgroundColor = '';
        });
        element.style.backgroundColor = 'lightyellow';
    }
}


// 닫히기 버튼이나 닫히기 이벤트에 이 함수를 연결하세요.
function clearHighlightWhenRightPaneClosed() {
    let rightPane = document.getElementById('rightPane');
    if (rightPane.style.display === 'none') {
        let items = document.querySelectorAll('li');
        items.forEach((item) => {
            item.style.backgroundColor = '';  // 모든 항목의 하이라이트를 제거합니다.
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




//-----------------------  여러 그래프 그려보기

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

function drawClusterHorizontalBarChart(colors, category, index, svgElement, data, new_mark) {

    // 고정된 bar의 높이
    const fixedBarHeight = 50;

    var barHeight = fixedBarHeight;
    var barSpacing = 20;

    // 동적으로 SVG의 높이를 설정합니다.
    var dynamicHeight = data.length * (barHeight + barSpacing);

    var margin = { top: 120, right: 100, bottom: 80, left: 70 },
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


    // // Title 추가
    // svg.append("text")
    //     .attr("x", (width / 2))
    //     .attr("y", -(margin.top / 2))
    //     .attr("text-anchor", "middle")
    //     .style("font-size", "16px")
    //     .style("font-weight", "bold")
    //     .text("뉴스 문장 군집화 결과");

    // // 설명 추가 (타이틀 바로 밑에)
    // svg.append("text")
    //     .attr("x", (width / 2))
    //     .attr("y", -(margin.top / 2) + 25)  // 타이틀 위치에서 20 아래로
    //     .attr("text-anchor", "middle")
    //     .style("font-size", "14px")
    //     .text("y축은 클러스터 종류, x축은 클러스터에 포함된 문장 개수를 나타냅니다.");



    // x scale - 이제 문장의 개수로 스케일링
    var x = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return d.Count; })])
        .range([0, width]);

    svg.append("g")
        .call(d3.axisBottom(x))
        .attr("transform", "translate(0," + height + ")")
        .selectAll("text")
        .style("fill", "#000000");

    // y scale - 클러스터 종류
    var y = d3.scaleBand()
        .range([height, 0])
        .domain(data.sort((a, b) => b.Cluster - a.Cluster).map(function (d) { return convertToRepresentative(d.Cluster); }))
        .padding(0.8);



    svg.append("g")
        .call(d3.axisLeft(y))
        .selectAll("text")
        .style("fill", "#000000");

    // // y축 레이블 (클러스터 종류)
    // svg.append("text")
    //     .attr("transform", "rotate(-90)")
    //     .attr("y", 0 - margin.left / 1.5)
    //     .attr("x", 0 - (height / 2))
    //     .attr("text-anchor", "middle")
    //     .style("font-size", "12px")
    //     .text("클러스터 종류");

    // // x축 레이블 (문장개수)
    // svg.append("text")
    //     .attr("x", width / 2)
    //     .attr("y", height + margin.bottom / 1.5)
    //     .attr("text-anchor", "middle")
    //     .style("font-size", "12px")
    //     .text("포함된 문장 개수");


    /*--bar graph ------------------------------*/



    /*--bar graph 막대 그리기 ------------------------------*/

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("y", function (d) { return y(convertToRepresentative(d.Cluster)) + (y.bandwidth() - fixedBarHeight) / 2; })
        .attr("height", fixedBarHeight)
        .attr("x", 0)
        .attr("width", function (d) { return x(d.Count); })
        .attr("fill", function (d, i) {
            return colors[i % colors.length];
        })
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
        .style("font-size", "12px")
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
        .attr("x", function (d) { return x(d.Count) + 5; })
        .attr("y", function (d) { return y(convertToRepresentative(d.Cluster)) + y.bandwidth() / 2; })
        .attr("text-anchor", "start")
        .attr("alignment-baseline", "middle")
        .style("font-size", "12px")
        .text(d => `${((d.Count / total) * 100).toFixed(2)}%`);

}






//--------------------------------------------------
// 문장 클러스터 시각화 - (2)도형
//--------------------------------------------------


function drawClusteredCirclesByRatio(colors, category, index, svgElement, data, new_mark) {

    var rScale = d3.scaleSqrt()
        .domain([0, d3.max(data, d => d.Count)])
        .range([0, (500 / 25) * 4]);  // 원의 크기 조절


    // var maxRadius = width / data.length; //  / (2 * data.length);  // 이 값을 통해 SVG 내에서 원들의 최대 반지름을 계산합니다.

    // var rScale = d3.scaleSqrt()
    //     .domain([0, d3.max(data, d => d.Count)])
    //     .range([0, maxRadius]);  // 계산된 최대 반지름 값을 사용하여 범위를 설정합니다.

    // 원들 간의 전체 너비 계산
    var totalWidthOfCircles = data.reduce((acc, d) => acc + 2 * rScale(d.Count), 0) + (data.length - 1) * 20; // 20은 원들 사이의 간격입니다.

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

    // var colors = [
    //     "#ffd1dc", "#d1ffd1", "#dcfffd", "#d1dcff", "#fdd1ff", "#ffdcdc",
    //     "#dcdcff", "#dcdcdc", "#d1d1d1", "#fddcdc"
    // ];
    // colors = shuffle(colors);

    colors = colors.reverse();  // colors 배열을 역순으로 바꾸기
    colors = colors.slice(0, data.length);  // 데이터에 필요한 수만큼의 색상만 추출하기



    let description = data.map((d, index) => `클러스터 번호 ${index + 1}`);

    let currentXPosition = 0;
    // 원들을 그립니다
    svg.selectAll(".circle")
        .data(data)
        .enter().append("circle")
        .attr("class", "circle")
        .attr("cx", d => x(convertToRepresentative(d.Cluster)) + x.bandwidth() / 2)
        .attr("cy", (height + margin.top + margin.bottom) / 2) // 원의 y 위치는 SVG의 중앙으로 설정합니다.

        //        .attr("cy", height / 2) // 원의 y 위치는 중앙으로 설정합니다.
        .attr("r", d => rScale(d.Count))
        .attr("fill", (d, i) => colors[colors.length - 1 - i]) // 인덱스를 역순으로 사용

        // .attr("fill", (d, i) => colors[i % colors.length])
        .attr("stroke", "#000000")
        .attr("stroke-width", d => new_mark.length !== 0 && new_mark.includes(d.Cluster) ? 3 : 1);

    // 원 아래에 핵심 내용을 그립니다.
    svg.selectAll(".circleTextDescription")
        .data(data)
        .enter().append("text")
        .attr("class", "circleTextDescription")
        .attr("x", d => x(convertToRepresentative(d.Cluster)) + x.bandwidth() / 2)
        // .attr("y", d => (height / 2) + rScale(d.Count) + 15)  // 원의 중심보다 아래로 15px 이동
        .attr("y", d => (height + margin.top + margin.bottom) / 2 + rScale(d.Count) + 15)  // 원의 중심보다 원의 반지름과 추가로 15px 아래로 이동

        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "hanging")  // 'hanging'으로 변경하여 tspan이 올바르게 정렬되도록 합니다.
        .style("font-size", "12px")
        .each(function (d) {  // .each() 함수를 사용하여 각 데이터 항목에 대한 처리를 수행합니다.
            let percentage = (d.Count / totalSentences) * 100;

            d3.select(this).append("tspan")  // 첫 번째 행을 추가합니다.
                .text(`핵심 내용${d.Cluster}`);

            d3.select(this).append("tspan")  // 두 번째 행 (비율)을 추가합니다.
                .attr("x", x(convertToRepresentative(d.Cluster)) + x.bandwidth() / 2)  // x 위치를 다시 설정합니다.
                .attr("dy", "15")  // 이전 tspan 요소에서 15px 아래로 이동합니다.
                .text(`${percentage.toFixed(2)}%`);
        });


    svg.selectAll(".circleTextContainer")
        .data(data)
        .enter().append("foreignObject")
        .attr("class", "circleTextContainer")
        .attr("x", d => x(convertToRepresentative(d.Cluster)) + x.bandwidth() / 2 - (rScale(d.Count) * 2) / 2)
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

    // var colors = [
    //     "#ffd1dc", "#d1ffd1", "#dcfffd", "#d1dcff", "#fdd1ff", "#ffdcdc",
    //     "#dcdcff", "#dcdcdc", "#d1d1d1", "#fddcdc"
    // ];
    // colors = shuffle(colors);

    let description = data.map((d, index) => `클러스터 번호 ${index + 1}`);

    svg.selectAll(".circleText")
        .data(data)
        .enter().append("text")
        .attr("class", "circleText")
        .attr("x", d => x(d.Count) + 5)
        .attr("y", d => y(convertToRepresentative(d.Cluster)) + y.bandwidth() / 2)
        .attr("text-anchor", "start")
        .attr("alignment-baseline", "middle")
        .style("font-size", "12px")
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
