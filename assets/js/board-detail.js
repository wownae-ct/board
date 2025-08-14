function goToBoardList() {
  const listBtn = document.querySelector("#buttonBox");

  listBtn.addEventListener("submit", (event) => {
    console.log("goToBoardList", event);
    event.preventDefault();
    window.location.href = `/board`;
  });
}

goToBoardList();