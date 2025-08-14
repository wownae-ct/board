async function init() {
  this.renderBoard(1);
}

async function renderBoard(page) {
  const tbody = document.querySelector("#boardList tbody");
  tbody.replaceChildren();
  const response = await fetch(`/board/list?page=${page}`);
  const paginationDto = await response.json();
  const dataList = paginationDto.dataList;
  if (dataList.length == 0) {
    return;
  }

  const table = document.querySelector("#boardList");
  const thead = document.querySelector("#boardListTitle");
  table.classList.remove('hidden');
  thead.classList.remove('hidden');
  for (const row of dataList) {
    const tr = createTr();
    const title = createTd(row.title);
    const username = createTd(row.username);
    const createDt = createTd(row.createDt);
    const views = createTd(row.views);
    tr.append(title, username, createDt, views);
    tbody.append(tr);
  }

  // 현재 페이지 번호 - O
  // 총 게시글 수 - O
  // 화면에 표시될 페이지 수
  // 마지막 페이지 번호
  const curPage = paginationDto.currentPage;
  const totalDataCount = paginationDto.totalCount;
  const totalPgUnitCount = paginationDto.totalPgUnitCount;
  const dataCntPerPg = paginationDto.dataCntPerPg;
  const totalPageCnt = paginationDto.totalPageCnt;
  const pagePerUnit = 5;

  const pagingBox = document.querySelector("#pagingBox");
  pagingBox.replaceChildren();
  const curPageFirstNo = Math.floor((curPage -1) / pagePerUnit) * pagePerUnit + 1;
  const lastPageNoOfUnit = (curPageFirstNo + pagePerUnit - 1);
  for (let i = curPageFirstNo; i <= lastPageNoOfUnit; i++) {
    if (i > pagePerUnit && i == curPageFirstNo) {
      const previousBtn = createButton('<');
      previousBtn.addEventListener("click", () => {
        renderBoard(curPageFirstNo - 1);
      });
      pagingBox.append(previousBtn);
    }
    if (i <= totalPageCnt) {
      const btn = createButton(i);
      btn.addEventListener("click", () => {
        renderBoard(i);
      });
      pagingBox.append(btn);
    }

    if (totalPageCnt - curPageFirstNo >= pagePerUnit && i == lastPageNoOfUnit) {
      const nextBtn = createButton('>');
      nextBtn.addEventListener("click", () => {
        renderBoard(curPageFirstNo + pagePerUnit);
      });
      pagingBox.append(nextBtn);
    }
  }

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

init();