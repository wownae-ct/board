async function init() {
  await this.renderBoard(1);
}

async function renderBoard(page, flag, searchData) {
  if (flag === undefined) {
    flag = true;
  }
  console.log('first searchData: ');
  console.log(searchData);
  const tbody = document.querySelector('#boardList tbody');
  tbody.replaceChildren();
  let response;
  let paginationDto;
  let dataList;

  if (searchData) {
    //검색 데이터 있는 경우
    response = searchData;
    console.log(response);
    dataList = searchData.dataList;
    console.log(dataList);

  } else {
    //검색 데이터 없는 경우
    response = await fetch(`/board/list?page=${page}&toggle=${flag}`);
    paginationDto = await response.json();
    dataList = paginationDto.dataList;
    console.log(response);
    console.log(paginationDto);
  }

  if (searchData == undefined && dataList.length == 0) {
    return;
  }

  const table = document.querySelector('#boardList');
  const thead = document.querySelector('#boardListTitle');
  table.classList.remove('hidden');
  thead.classList.remove('hidden');
  if (response.length !== 0 && searchData === undefined) {
    for (const row of dataList) {
      const tr = createTr();
      const title = createTd(row.title);
      const username = createTd(row.username);
      const createDt = createTd(row.createDt);
      const views = createTd(row.views);
      tr.append(title, username, createDt, views);

      title.classList.add('hand-cursor');
      title.addEventListener('mouseover', (e) => {
        title.setAttribute('style', 'color: orange');
      });
      title.addEventListener('mouseout', (e) => {
        title.setAttribute('style', 'color: black');
      });
      title.addEventListener('click', (event) => {
        detail(event, row.id);
      });
      tbody.append(tr);
    }
  } else {
    for (const row of dataList) {
      const tr = createTr();
      const title = createTd(row.title);
      const username = createTd(row.username);
      const createDt = createTd(row.createDt);
      const views = createTd(row.views);
      tr.append(title, username, createDt, views);

      title.classList.add('hand-cursor');
      title.addEventListener('mouseover', (e) => {
        title.setAttribute('style', 'color: orange');
      });
      title.addEventListener('mouseout', (e) => {
        title.setAttribute('style', 'color: black');
      });
      title.addEventListener('click', (event) => {
        detail(event, row.id);
      });
      tbody.append(tr);
    }
  }
  // 현재 페이지 번호 - O
  // 총 게시글 수 - O
  // 화면에 표시될 페이지 수
  // 마지막 페이지 번호


  let curPage;
  let totalDataCount;
  let totalPgUnitCount;
  let dataCntPerPg;
  let totalPageCnt;

  const initPage = 1;
  const pagePerUnit = 5;

  console.log(response);
  console.log('second searchData: ')
  console.log(searchData);
  if (searchData) {
    curPage = searchData.currentPage;
    totalDataCount = searchData.totalCount;
    totalPgUnitCount = searchData.totalPgUnitCount;
    dataCntPerPg = searchData.dataCntPerPg;
    totalPageCnt = searchData.totalPageCnt;
  } else {
    curPage = paginationDto.currentPage;
    totalDataCount = paginationDto.totalCount;
    totalPgUnitCount = paginationDto.totalPgUnitCount;
    dataCntPerPg = paginationDto.dataCntPerPg;
    totalPageCnt = paginationDto.totalPageCnt;
  }

  console.log(totalDataCount);

  const pagingBox = document.querySelector('#pagingBox');
  pagingBox.replaceChildren();
  const curPageFirstNo =
    Math.floor((curPage - 1) / pagePerUnit) * pagePerUnit + 1;
  const lastPageNoOfUnit = curPageFirstNo + pagePerUnit - 1;
  for (let i = curPageFirstNo; i <= lastPageNoOfUnit; i++) {
    if (i > pagePerUnit && i == curPageFirstNo) {
      const previousBtn = createButton('<');
      const initBtn = createButton('<<');
      previousBtn.addEventListener('click', () => {
        renderBoard(curPageFirstNo - 1);
      });
      initBtn.addEventListener('click', (e) => {
        renderBoard(initPage);
      })

      pagingBox.append(initBtn);
      pagingBox.append(previousBtn);
    }
    if (i <= totalPageCnt) {
      const btn = createButton(i);

      if (i === curPage) {
        btn.setAttribute('id', 'checkedBtn');
      }
      btn.addEventListener('click', () => {
        console.log(i);
        renderBoard(i);
      });
      pagingBox.append(btn);
    }


    if (totalPageCnt - curPageFirstNo >= pagePerUnit && i == lastPageNoOfUnit) {
      const nextBtn = createButton('>');
      const endBtn = createButton('>>');
      nextBtn.addEventListener('click', () => {
        renderBoard(curPageFirstNo + pagePerUnit);
      });
      pagingBox.append(nextBtn);
      pagingBox.append(endBtn);
      endBtn.addEventListener('click', (e) => {
        renderBoard(totalPageCnt);
      })
    }
  }
  checkBtn();

  // 검색을 감지하고 함수 호출하는 로직
  const searchButton = document.querySelector("#searchButton");
  const searchForm = document.querySelector("#searchInput");
  searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    const searchKeyword = searchForm.value;
    searchRequest(e, searchKeyword, page, flag)
  })


}

// 현재 위치 버튼 볼드 변경.
function checkBtn() {
  const checkedBtn = document.querySelector("#checkedBtn");
  checkedBtn.setAttribute("style", "font-weight: bold");
}

function createTr() {
  return document.createElement("tr");
}

function createTd(value) {
  const td = document.createElement("td");
  td.textContent = value;
  return td;
}

function createButton(value) {
  const button = document.createElement("button");
  button.textContent = value;
  button.setAttribute('class', 'page-btn');
  return button;
}

function detail(event, id) {
  event.preventDefault()
  const resultData = id;
  window.location.href = `/board/board-detail/${resultData}`;
}

function toggle(flag) {
  const checkedBtn = document.querySelector("#checkedBtn");
  const img = document.querySelectorAll(".arrow");

  if(flag) {
    for (let i = 0; i < img.length; i++) { img[i].setAttribute('onclick', 'toggle(false)');}
    let curPageNum = checkedBtn.textContent;
    renderBoard(curPageNum, flag);
  } else {
    for (let i = 0; i < img.length; i++) { img[i].setAttribute('onclick', 'toggle(true)');}
    let curPageNum = checkedBtn.textContent;
    renderBoard(curPageNum, flag);
  }
}

function newPost() {
  window.location.href = 'http://localhost:9191/';
}


function search() {
  const searchButton = document.querySelector("#searchButton");
  const searchData = document.querySelector("#searchInput");
  searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    const userSearchData = searchData.value;
    console.log(userSearchData);
    searchRequest(e, userSearchData)
  })
}

async function searchRequest(e, userSearchData, page, flag) {
  const response = await fetch(
    `http://localhost:9191/board/list?page=${page}&toggle=${flag}&searchWord=${userSearchData}`,
    {
      method: 'GET',
      headers: {
        'content-type': 'charset=UTF-8',
      },
    },
  );
  const data = await response.json();
  renderBoard(page, flag, data);
}

init();