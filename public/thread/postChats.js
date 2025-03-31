function warn(message) {
  const warnZone = document.getElementById("Warning");
  warnZone.textContent = message;
  setTimeout(() => {
    warnZone.textContent = "";
  }, 2000);
}
async function send() {
  const name = document.getElementById("name").value;
  const content = document.getElementById("content").value;
  if (name.length === 0 || content.length === 0) {
    warn("名前とメッセージを入力してください");
    return;
  }
  if (name.length > 20 || content.length > 200) {
    warn("名前は20文字以内、メッセージは200文字以内で入力してください");
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
  if (!res.ok) {
    const data = await res.text();
    warn(data);
  } else {
    const element = document.documentElement;
    const bottom = element.scrollHeight - element.clientHeight;
    window.scroll(0, bottom);
    document.getElementById("content").value = "";
  }
}
//エンターキーで送信可能
document.getElementById("content").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    send();
  }
});
