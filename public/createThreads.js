const Warning = document.getElementById("Warning");
async function create() {
  const threadName = document.getElementById("threadName");
  if (threadName.length == 0) {
    Warning.textContent = "スレッド名を入力してください";
    return;
  }
  if (threadName.length > 40) {
    Warning.textContent = "スレッド名は40文字以内で入力してください";
    return;
  }
  const res = await fetch("/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      threadName: threadName.value,
    }),
  });
  if (!res.ok) {
    const error = await res.text();
    Warning.textContent = error;
    return;
  }
  const threadId = await res.text();
  location.href = "thread/" + threadId;
}
