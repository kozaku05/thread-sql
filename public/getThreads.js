const ul = document.getElementById("threadList");
(async () => {
  const res = await fetch("/threads", {
    method: "GET",
  });
  const data = await res.json();
  console.log(data);
  for (let i = 0; i < data.length; i++) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "thread/" + data[i].thread_id;
    a.textContent = data[i].thread_name;
    li.appendChild(a);
    ul.appendChild(li);
  }
})();
