const id = location.href.split("/").pop();
const thread = document.getElementById("thread");
(async () => {
  const res = await fetch("/info/" + id);
  info = await res.json();
  const title = info.pop()[0].thread_name;
  document.getElementById("threadName").textContent = "スレッド名：" + title;
  document.title = title;
  for (let i = 0; i < info.length; i++) {
    const in_thread_message_id = document.createElement("p");
    in_thread_message_id.textContent = info[i].in_thread_message_id;
    const div = document.createElement("div");
    div.className = "content";
    const name = document.createElement("span");
    name.textContent = " 名前：" + info[i].user_name;
    const content = document.createElement("p");
    content.textContent = "内容：" + info[i].message;
    const date = new Date(info[i].post_time);
    const time = document.createElement("span");
    time.textContent = " 投稿：" + date.toLocaleString();
    div.appendChild(in_thread_message_id);
    in_thread_message_id.appendChild(name);
    div.appendChild(content);
    name.appendChild(time);
    thread.appendChild(div);
    localStorage.setItem("in_thread_message_id", i + 1);
  }
  const element = document.documentElement;
  const bottom = element.scrollHeight - element.clientHeight;
  window.scroll(0, bottom);
  if (info.length > 1000) {
    document.getElementById("form").style.display = "none";
    const message = document.createElement("h2");
    message.textContent = "1000以上書き込めません";
    document.getElementById("thread").appendChild(message);
  }
})();
