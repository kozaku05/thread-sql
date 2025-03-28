const Warning = document.getElementById("Warning");
async function send() {
  const name = document.getElementById("name").value;
  const content = document.getElementById("content").value;
  if (name.length === 0 || content.length === 0) {
    Warning.textContent = "名前とメッセージを入力してください";
    return;
  }
  if (name.length > 20 || content.length > 200) {
    Warning.textContent =
      "名前は20文字以内、メッセージは200文字以内で入力してください";
    return;
  }
  const res = await fetch(`/send/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      content: content,
    }),
  });
  if (res.ok) {
    location.reload();
  } else {
    const data = await res.text();
    Warning.textContent = data;
    setTimeout(() => {
      Warning.textContent = "";
    }, 5000);
  }
}
