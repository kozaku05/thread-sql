const name = "test";
const content = "hello world";
function send() {
  fetch("http://kozaku05.f5.si/send/2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, content }),
  });
}
setInterval(() => {
  send();
}, 1000);
