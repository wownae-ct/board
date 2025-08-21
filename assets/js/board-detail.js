const titleBox = document.querySelector('#titleBox');

function init() {
  const titleBox = document.querySelector('#titleBox');
  const buttonForm = document.querySelector("#buttonForm");

  titleBox.setAttribute("id","hidden");

  buttonForm.children[0].addEventListener("click", (e) => {
    let state = 0;
    passwordCheck(e, state)
  });
  buttonForm.children[1].addEventListener("click", (e) => {
    let state = 1;
    passwordCheck(e, state)
  });
  buttonForm.children[2].addEventListener("click", goToBoardList);
}


function goToBoardList(event) {
  // const listBtn = document.querySelector("#buttonBox");
  //
  // listBtn.addEventListener("submit", (event) => {
  //   console.log("goToBoardList", event);
    event.preventDefault();
    window.location.href = `/board`;
  // });
}

init();

function passwordCheck(event, state) {
  event.preventDefault();
  const createDt = document.querySelector(".writerBoxRight");
  createDt.children[0].innerText = '비밀번호';
  createDt.children[1].removeAttribute('readonly');
  // createDt.children[1].removeAttribute('placeholder');
  createDt.children[1].setAttribute('style', 'border: 3px solid black');
  createDt.children[1].setAttribute('id', 'red');
  createDt.children[1].setAttribute('type', 'password');
  createDt.children[1].setAttribute('placeholder', '비밀번호를 입력하세요');


  // createDt.children[1].addEventListener('keyup', () => {

    addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        let password = createDt.children[1].value;
        createDt.children[1].setAttribute('value', '');
        createDt.children[1].replaceChildren();
        if (state === 1) {
          deleteBoard(event, state)
        } else {
        modifyBoard2(event, password, createDt);
        }
      }
    });
  // })
}

async function modifyBoard2(event, passwd, createDt) {

const test = window.location.href;
  const id = test.substring(test.lastIndexOf('/') + 1);
  const response = await fetch(`/board/${id}`);
  const detailInform = await response.json();
  const updateDt = detailInform.updateDt;
  const title = detailInform.title;

  if (passwd !== null) {
    createDt.children[0].innerText = '최초 작성일';
    createDt.children[1].innerText = updateDt;
    createDt.children[1].setAttribute('type', 'text');
    createDt.children[1].value = null;
    createDt.children[1].setAttribute('placeholder', updateDt);
    createDt.children[1].removeAttribute('style');
    createDt.children[1].removeAttribute('id');
    createDt.children[1].setAttribute('readonly','readonly');
    
    const boardWrite = document.querySelector("#boardWrite");
    boardWrite.innerText = '게시글 수정';
    titleBox.setAttribute("id", "titleBox");
    titleBox.children[1].value = title;
    
  const contentForm = document.querySelector("#content");
  contentForm.removeAttribute("readonly");

  const buttonForm = document.querySelector("#buttonForm");
  buttonForm.children[0].value = '수정 완료';
  buttonForm.children[0].addEventListener('click', (evt) => {

    modifyBoard3(evt, id);
  });
  }
}

async function modifyBoard3(evt, id) {
  console.log(id);
  const title = document.querySelector("#titleBox input").value;
  const content = document.querySelector("#content").value;

  const result = await fetch(`/board/${id}`, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      title: title,
      content: content,
    })
  });
  // 생성한 게시글의 아이디
  window.location.href = `/board/board-detail/${id}`;
  console.log(result);
}


// createDt.children[1].addEventListener('submit', (event) => {
//   modifyBoard2(event, password);
// }

async function deleteBoard(event, state) {
  const test = window.location.href;
  const id = test.substring(test.lastIndexOf('/') + 1);
  const response = await fetch(`/board/${id}`);
  const detailInform = await response.json();
  const buttonForm = document.querySelector("#buttonForm");
  buttonForm.children[1].value = '삭제하기';
  buttonForm.children[1].addEventListener('click', async (evt) => {

    const result = await fetch(`/board/${id}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        id: id
      })
    });
    event.preventDefault();
    window.location.href = `/board`;

  });

}
