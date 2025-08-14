const titleInput = document.querySelector("#titleBox input");
const writerInput = document.querySelector("#writerBoxLeft input");
const passwdInput = document.querySelector("#writerBoxRight input");

const contentForm = document.getElementById("buttonBox");
const contentInput = document.querySelector("#content");

let post =[];

console.log(contentForm);
console.log(contentInput)

function handleSubmit(event) {
  event.preventDefault();
  const newTitle = titleInput.value;
  const newWriter = writerInput.value;
  const newPasswd = passwdInput.value;
  const newContent = contentInput.value;
  contentInput.value = "";
  console.log(newTitle);
  console.log(newWriter);
  console.log(newPasswd);
  console.log(newContent);

  const newPost = {
    title: newTitle,
    writer: newWriter,
    passwd: newPasswd,
    content: newContent
  }

  saveNewPost(newPost);
}

async function saveNewPost(newPost) {
  post.push(newPost);
  console.log(newPost);
  console.log(post);

  const data = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newPost)
    }
  await fetch('./board', data);

}
contentForm.addEventListener("submit", handleSubmit);

fetch('/board/post-list?status=test&flag=true').then((response) => {
});

fetch('/board/post-list-2?status=test&flg=true').then((response) => {
});

