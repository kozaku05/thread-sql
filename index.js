const mysql = require("mysql2");
const express = require("express");
const crypto = require("crypto");
const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(express.static("./public/thread"));
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "keijiban",
});
connection.connect((e) => {
  if (e) throw e;
  console.log("Connected to MySQL");
});
//スレッドのIDがあるか確認
async function checkThread(id) {
  return new Promise((resolve) => {
    connection.query(
      "select * from threads where thread_id =?",
      [id],
      (e, r) => {
        if (e) {
          console.log(e);
          resolve(false);
        }
        resolve(r.length > 0);
      }
    );
  });
}
app.get("/", (req, res) => {
  res.sendFile(__dirname + "index.html");
});
//スレッド作成
app.post("/create", (req, res) => {
  let { threadName } = req.body;
  threadName = threadName.trim();
  if (!threadName) {
    res.status(400).send("スレッド名を入力してください");
    return;
  }
  if (threadName.length > 40) {
    res.status(400).send("スレッド名は40文字以内で入力してください");
    return;
  }
  connection.query(
    "INSERT INTO threads (thread_name) VALUES (?)",
    [threadName],
    (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      res.status(201).send(`${result.insertId}`);
    }
  );
});
//スレッドID存在確認ひな形HTML返す
app.get("/thread/:id", async (req, res) => {
  const { id } = req.params;
  const check = await checkThread(id);
  if (!check) {
    res.status(404).send("存在しないスレッドIDです");
    return;
  }
  res.sendFile(__dirname + "/public/thread/thread.html");
});
//メッセージの送信
let sending;
let send_ip_addres = [];
app.post("/send/:id", async (req, res) => {
  const ip = req.ip;
  if (send_ip_addres.includes(ip)) {
    res.status(429).send("3秒後に再送信できます");
    return;
  }
  send_ip_addres.push(ip);
  setTimeout(() => {
    send_ip_addres.shift();
  }, 3000);
  if (sending) {
    res.status(429).send("SQL処理中。しばらくお待ちください");
    return;
  }
  let { name, content } = req.body;
  name = name.trim();
  content = content.trim();
  const { id } = req.params;
  if (!name || !content) {
    res.status(400).send("名前とメッセージを入力してください");
    return;
  }
  if (name.length > 20 || content.length > 200) {
    res
      .status(400)
      .send("名前は20文字以内、メッセージは200文字以内で入力してください");
    return;
  }
  const check = await checkThread(id);
  if (!check) {
    res.status(404).send("存在しないスレッドIDです");
    return;
  }
  sending = true;
  let [message_id] = await connection
    .promise()
    .query(
      "select in_thread_message_id from chats where thread_id = ? order by in_thread_message_id desc limit 1",
      [id]
    );
  let in_thread_message_id;
  if (message_id.length == 0) {
    in_thread_message_id = 1;
  } else {
    in_thread_message_id = message_id[0].in_thread_message_id + 1;
  }
  if (in_thread_message_id > 1000) {
    res.status(400).send("1000件以上のメッセージを送信することはできません");
    sending = false;
    return;
  }
  connection.query(
    "insert into chats(user_name,message,in_thread_message_id,thread_id)values(?,?,?,?)",
    [name, content, in_thread_message_id, id],
    (e) => {
      if (e) {
        console.log(e);
        res.status(500).send("サーバーエラー");
        sending = false;
        return;
      }
      res.status(201).send();
      sending = false;
    }
  );
});
//チャット内容取得する
app.get("/info/:id", async (req, res) => {
  const { id } = req.params;
  const check = checkThread(id);
  if (!check) {
    res.status(404).send("存在しないスレッドIDです");
    return;
  }
  const [info] = await connection
    .promise()
    .query("select * from chats where thread_id = ?", [id]);
  const [threadName] = await connection
    .promise()
    .query("select thread_name from threads where thread_id=?", [id]);
  info.push(threadName);
  res.status(200).json(info);
});
//スレッドを取得する
app.get("/threads", (req, res) => {
  connection.query("SELECT * FROM threads", (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("サーバーエラー");
      return;
    }
    res.status(200).json(result);
  });
});
// 管理者パスワード
let pass;
function genPass() {
  pass = crypto.randomUUID();
  console.log("new pass: " + pass);
  setTimeout(genPass, 60000);
}
genPass();
//管理者画面
app.get(`/${pass}`, (req, res) => {
  res.sendFile(__dirname + "/public/admin/index.html");
});
//通報時
app.post("/report", (req, res) => {});
app.listen(80);
