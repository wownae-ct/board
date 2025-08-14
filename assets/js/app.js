function init() {
  console.log("Initializing...");
  //등록 버튼에 이벤트 리스너를 등록한다.
  const submitBtn = document.querySelector("#buttonBox");
  submitBtn.addEventListener('submit', savePost);
}

/**
 * 게시글을 저장한다.
 * */
async function savePost(event) {
  event.preventDefault();
  console.log("Saving post...");
  const title = document.querySelector("#titleBox input").value;
  const writer = document.querySelector("#writerBoxLeft input").value;
  const password = document.querySelector("#writerBoxRight input").value;
  const content = document.querySelector("#content").value;

  const result = await fetch('/board', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      title: title,
      writer: writer,
      passwd: password,
      content: content,
    })
  });
  // 생성한 게시글의 아이디
  const resultData = await result.json();
  window.location.href = `/board/board-detail/${resultData.id}`;
}




// 초기화
init();