function connect() {
  const websocket = new WebSocket("ws://kozaku05.f5.si:3000");
  websocket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const thread = document.getElementById("thread");
    if (data.threadId === location.href.split("/").pop()) {
      const in_thread_message_id = document.createElement("p");
      in_thread_message_id.textContent = data.in_thread_message_id;
      localStorage.setItem(
        "in_thread_message_id",
        data.in_thread_message_id + 1
      );
      const div = document.createElement("div");
      div.className = "content";
      const Name = document.createElement("span");
      Name.textContent = " 名前：" + data.name;
      const Content = document.createElement("p");
      Content.textContent = "内容：" + data.content;
      const date = new Date();
      const time = document.createElement("span");
      time.textContent = " 投稿：" + date.toLocaleString();
      div.appendChild(in_thread_message_id);
      in_thread_message_id.appendChild(Name);
      div.appendChild(Content);
      Name.appendChild(time);
      thread.appendChild(div);
    }
  };
  websocket.onclose = () => {
    document.getElementById("Warning").textContent =
      "websocket通信が途切れたため再接続します";
    setTimeout(connect, 1000);
    setTimeout(() => {
      document.getElementById("Warning").textContent = "";
    }, 2000);
  };
}
connect();
