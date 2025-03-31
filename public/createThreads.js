function warn(message) {
  const warnZone = document.getElementById("Warning");
  warnZone.textContent = message;
  setTimeout(() => {
    warnZone.textContent = "";
  }, 2000);
}
async function create() {
  const threadName = document.getElementById("threadName");
  if (threadName.length == 0) {
    warn("スレッド名を入力してください");
    return;
  }
  if (threadName.length > 40) {
    warn("スレッド名は40文字以内で入力してください");
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
    warn(error);
    return;
  }
  const threadId = await res.text();
  location.href = "thread/" + threadId;
}
