// DB에서 데이터 받아오기
async function renderData() {
  const response = await fetch('/board/list?page=1');
  const data = await response.json();
  addBoardList(data);
};



// const response = fetch('/board/list')
//   .then((res) => res.json())
//     .then((data) => {
//     console.log(data)
//     return data;
//     });

// 게시글 목록 HTML 생성
function addBoardList(boardData) {
  const hiddenForm = document.querySelectorAll('.hidden');
  // for (let i = 0; i < boardData.length; i++) {
  for (let i = 0; i < 10; i++) {

    const tbodyForm = document.body.getElementsByTagName('tbody');
    const trElement = document.createElement('tr');
    const data = boardData[i];
    trElement.classList.add('tr');
    tbodyForm[0].prepend(trElement);

    for (let j = 0; j < 10; j++) {
      if (j < 1) {
        for (let k = 0; k < 4; k++) {
          const tdElement = document.createElement('td');
          trElement.append(tdElement);
          tdElement.classList.add('td');
          tdElement.setAttribute('id', k);
        }
      }
    }

  const HIDDEN_CLASSNAME = 'hidden';
  hiddenForm.forEach((element) => {
    element.classList.remove(HIDDEN_CLASSNAME);
    // console.log(element);
  });
  }
  dataPut(boardData);
}

// 게시글 목록 중 <td> 태그에 DB 데이터 삽입
function dataPut(boardData) {
  const trForm = document.querySelectorAll('.tr');
  for (let i = 0; i < 10; i++) {
    trForm[i].setAttribute('id', boardData[i].row);
    trForm[i].children[0].innerText = boardData[i].title;
    trForm[i].children[1].innerText = boardData[i].username;
    trForm[i].children[2].innerText = boardData[i].create_dt;
    trForm[i].children[3].innerText = boardData[i].views;
  }
  const itemsPerPage = 5;
  const test = new Pagination(boardData, itemsPerPage);
  test.createPagination()
}



// 데이터 가져오기
renderData();









