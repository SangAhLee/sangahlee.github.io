// import { marked } from 'marked'

// marked의 renderer을 설정하여, 링크를 새창으로 뜨게 한다. 
let renderer = new marked.Renderer();
let linkRenderer = renderer.link;
renderer.link = (href, title, text) => {
  let html = linkRenderer.call(renderer, href, title, text);
  return html.replace(/^<a /, '<a target="_blank" rel="nofollow" ');
};

marked.setOptions({ renderer });  // 전역 설정



function toggleTheme() {
  var body = document.body;
  body.classList.toggle("dark");
  var button = document.querySelector(".theme-toggle button");
  if (body.classList.contains("dark")) {
    button.textContent = "Light Mode로 변환";
  } else {
    button.textContent = "Dark Mode로 변환";
  }
}

// 페이지 로드할 때
document.addEventListener("DOMContentLoaded", function () {
  var button = document.querySelector(".theme-toggle button");
  button.textContent = "Light Mode로 변환";
});



/* ------메뉴 동작------ */


var contents = {
  mycareer: "./pages/99_about.md",
  myinterest: "./pages/00_research.md",
  graphvis: "./datavis/visualizellms.html",
  newssnapshotdemo: "./news-analysis/newssnapshot-demo.html"
};

// GNB 아이템을 클릭했을 때 이벤트 핸들러
function handleNavClick(event) {
  var targetId = event.target.id;

  // id 속성이 있는 항목에 대해서만 이벤트 적용
  if (targetId) {
    event.preventDefault();
    var contentDiv = document.getElementById("page-content");


    if (contents[targetId] == contents.newssnapshotdemo) {
      console.log("It's a html file!");
      let currentDate = new Date('2023-12-18'); // 업데이트일자
      let initialDate = new Date('2023-10-14'); // 최초 작성일을 원하는 날짜로 설정

      let additionalContent = `<div style="margin-bottom: 20px;">
      - 최초 작성일: ${initialDate.toLocaleDateString()}<br>
      - 최근 업데이트 일자: ${currentDate.toLocaleDateString()}<br><br>
      뉴스 분석 및 시각화 인터페이스에 관한 연구를 진행 중입니다.<br><br>
        이 컨텐츠는 아래의 URL로 바로 접근 가능합니다.<br>
        <a href="https://sangahlee.github.io/news-analysis/newssnapshot-demo.html" target="_blank" style="color: #63d1ef;">https://sangahlee.github.io/news-analysis/newssnapshot-demo.html</a><br>
      </div>`;
      contentDiv.innerHTML = additionalContent + `<iframe src="${contents[targetId]}" width="95%" height="95%" frameborder="0"></iframe>`;
    }
    else if (contents[targetId] == contents.graphvis) {
      console.log("It's a html file!");
      let currentDate = new Date('2023-10-15'); // 업데이트일자
      let initialDate = new Date('2023-10-15'); // 최초 작성일을 원하는 날짜로 설정

      let additionalContent = `<div style="margin-bottom: 20px;">
      - 최초 작성일: ${initialDate.toLocaleDateString()}<br>
      - 최근 업데이트 일자: ${currentDate.toLocaleDateString()}<br><br>
      학습 목적으로 제작한 Large Language Models (LLMs)의 시각화 결과물입니다.<br><br>
      이 컨텐츠는 아래의 URL로 바로 접근 가능합니다.<br>
      <a href="https://sangahlee.github.io/datavis/visualizellms.html" target="_blank" style="color: #63d1ef;">https://sangahlee.github.io/datavis/visualizellms.html</a><br>
    </div>`;
      contentDiv.innerHTML = additionalContent + `<iframe src="${contents[targetId]}" width="95%" height="95%" frameborder="0"></iframe>`;
    }
    else if (contents[targetId]) {
      // If the content is an HTML file, load it in an iframe instead of fetching it
      if (contents[targetId].endsWith('.html')) {
        console.log("It's a html file!");
        contentDiv.innerHTML = `<iframe src="${contents[targetId]}" width="100%" height="100%" frameborder="0"></iframe>`;
      }
      else {
        fetch(contents[targetId])
          .then(response => {
            if (response.ok) {
              return response.text();
            } else {
              throw new Error('Error: ' + response.status);
            }
          })
          .then(data => {
            if (contents[targetId].endsWith('.md')) {
              // Markdown 파일인 경우, HTML로 변환
              if (typeof marked !== 'undefined') {

                // 여기서 특정 내용을 추가합니다.
                let additionalContent = '<div>한글로 변경할 예정입니다.</div>';
                let markdownContent = marked(data);

                // 추가한 내용과 Markdown 파일의 내용을 합칩니다.
                contentDiv.innerHTML = additionalContent + markdownContent;
              } else {
                throw new Error('marked library is not properly initialized.');
              }
            } else {
              contentDiv.innerHTML = data;
            }
          })
          .catch(error => console.error('Error:', error));

      }
    }
    // 모든 아이템의 선택 스타일을 초기화
    var navItems = document.querySelectorAll('.nav a');
    navItems.forEach(item => {
      item.classList.remove('selected');
    });

    // 현재 선택된 아이템에 선택 스타일 적용
    event.target.classList.add('selected');

    // // GNB의 선택 스타일 제거
    // var gnbTitle = document.querySelector('.gnb-title');
    // gnbTitle.classList.remove('selected');

  }
}

var navItems = document.querySelectorAll(".nav a");
navItems.forEach(item => {
  item.addEventListener("click", handleNavClick);
});


/* ------welcome message------ */

// var welcomeMessage = `
// <p>Hi there!</p>
// <p>My name is <b>SangAh Lee(이상아)</b>, but you can call me <b>Ivory</b>. In Korean, my first name "SangAh" means "Ivory," a name my father gave me.</p>
// <p>I've always thought that elephants, which are big and wonderful, are really amazing.
//  Also, I love the ivory color because it looks elegant and matches well with everything.
//  That's why I chose "Ivory" as my nickname.</p>
// `;
var welcomeMessage = `
<style>
  .welcome-message b {
    color: #0092CA;
  }
</style>

<div class="welcome-message">
  <h3>Hi there!
  My name is <b>SangAh Lee(이상아)</b>, but you can call me <b>Ivory</b>.</h3>
  <p>In Korean, my first name "SangAh" means "Ivory," a name my father gave me.<br>
  I've always thought that elephants, which are big and wonderful, are really amazing.
  Also, I love the ivory color because it looks elegant and matches well with everything.
  That's why I chose "Ivory" as my nickname.</p>
</div>
`;

/* ------메인 꾸미기------ */
var mainContent = `
<div class="maincontainer curves">
<div id="sec1" class="section">
  <h1>Loving person</h1>
  <p>사랑하는 마음으로 살고있습니다. 사랑하는 나의 가족, 친구들, 지인들 뿐만 아니라 나무, 꽃, 강아지, 고양이 모두 사랑합니다.</p>
  <hr>
  <p>I cherish all living beings. Not only do I love my family, friends, and acquaintances, but also trees, flowers, dogs, and cats.</p>
</div>
<div id="sec2" class="section">
  <h1>Content lover</h1>
  <p>책을 읽거나 영화를 보며 이야기에 빠지거나, 새로운 것을 배우는 것을 좋아합니다. 다양한 장르의 음악을 듣고, 노래 부르는 것도 좋아합니다. :) </p>
  <p>또한, 다양한 새 미디어를 탐구하고 사용하는 것을 즐깁니다.플랫한 스크린에서의 경험을 확장하기 위한 서비스나 툴, 그리고 XR 경험에 관심이 많습니다.</p>
  <hr>
  <p>I enjoy immersing myself in stories through reading books or watching movies, and I love learning new things. I also take pleasure in listening to various genres of music and singing along. :) </p>
  <p>Additionally, I have a keen interest in exploring and utilizing various new media. I am especially interested in services or tools to expand the experiences beyond the flat screen and in Extended Reality (XR) experiences.</p>
</div>
<div id="sec3" class="section">
  <h1>Storyteller</h1>
  <!-- <img src="resources/bolkimum.png" alt="profile image" /> --> <!-- 이미지 추가 -->
  <p>컨텐츠를 소비하는 것 뿐만 아니라 컨텐츠를 직접 제작하고 스토리를 전달하는 것에 관심이 많습니다. 영상, 글 뿐만 아니라 간단한 소프트웨어 또는 웹 서비스를 제작합니다.</p>
  <p>개인 유튜브 채널 및 블로그를 운영하고 있습니다. (프로페셔널 목적은 아니고 취미 목적이라서 이 페이지에서는 소개하지 않습니다.)</p>
  <hr>
  <p>Not only do I consume content, but I am also interested in creating content and sharing stories myself. This includes making videos, writing articles, and even developing simple software or web services.</p>
  <p>I run a personal YouTube channel and a blog. (Please note that these are hobby-driven and are not introduced on this page for professional purposes.)</p>
</div>
</div>
`;

// 페이지 로드할 때
document.addEventListener("DOMContentLoaded", function () {
  var contentDiv = document.getElementById("page-content");
  mainContent = welcomeMessage + mainContent;
  contentDiv.innerHTML = mainContent;
});

// 페이지 타이틀 클릭했을 때
var gnbTitle = document.querySelector('#gnb-title');
gnbTitle.addEventListener("click", handleTitlelick);

function handleTitlelick(event) {
  event.preventDefault();
  var contentDiv = document.getElementById("page-content");
  contentDiv.innerHTML = mainContent;

  // 모든 아이템의 선택 스타일을 초기화
  var navItems = document.querySelectorAll('.nav a');
  navItems.forEach(item => {
    item.classList.remove('selected');
  });

  // // GNB에 선택 스타일 적용
  // event.target.classList.add('selected');
}





// const markdownText = '# Hello, Markdown!';
// const htmlText = marked(markdownText);
// console.log(htmlText); // <h1>Hello, Markdown!</h1>
