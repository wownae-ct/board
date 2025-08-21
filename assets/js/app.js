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
  const title = document.querySelector("#titleBox input").value;
  const writer = document.querySelector(".writerBoxLeft input").value;
  const password = document.querySelector("#writerBoxRight input").value;
  const content = document.querySelector("#content").value;

  console.log(content.length);

    if (title.length > 10) {
      alert('제목은 10글자를 초과할 수 없습니다.');
    } else if (!title) {
      alert('제목을 입력해주세요.');
    }

    if (!writer) {
      alert('작성자명을 입력해주세요.');
    } else if (!writer.match(/^[ㄱ-ㅎㅏ-ㅣ가-힣a-z0-9_-]{1,10}$/g)) {
      alert("특수문자는 '-', '_'만 가능합니다.");
    }

    if (content.length <= 10) {
      alert('게시글의 최소 글자 수는 10자입니다.');
    } else if (content.length > 10000) {
      alert('내용은 5000자를 초과할 수 없습니다.');
    } else if (!content) {
      alert('내용을 입력해주세요.');
    }

    if (!password) {
      alert('비밀번호를 입력하세요');
    } else if (password.length > 8 && writer.match(/^[ㄱ-ㅎㅏ-ㅣ가-힣a-z0-9!@#+-]{1,10}$/g) === null) {
      alert('비밀번호는 영문자, 숫자, 특수문자 포함 8글자 이상이 필요합니다.');
    } else if (password.length < 8) {
      alert('비밀번호는 8글자 이상 적어주세요.');
    }
    // } else {
    //
    //   const test = window.location.href;
    //   console.log(test);
    //   const id = test.substring(test.lastIndexOf('/') + 1);
    //   console.log(id);
    //   const response = await fetch(`/board/${id}`);
    //   console.log(response);
    //   const detailInform = await response.json();
    //   console.log(detailInform);
    //   const dbPassword = detailInform.password;
    //   console.log(dbPassword);
    //
    //   if (dbPassword !== password) {
    //     console.log ('비밀번호가 일치하지 않습니다.');
    //   }
    // }

  if (title.length < 20 && writer.match(/^[ㄱ-ㅎㅏ-ㅣ가-힣a-z0-9_-]{1,10}$/g) && content.length > 10 && password) {
    console.log("Saving post...");
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
      }),
    });
    // 생성한 게시글의 아이디
    console.log(result);
    const resultData = await result.json();
    console.log(resultData);
    window.location.href = `/board/board-detail/${resultData.id}`;
    return resultData;
  }
    // const pwdChecked = await passwordCheck(title, writer, password, content);
    // console.log(pwdChecked);
}




// 초기화
init();