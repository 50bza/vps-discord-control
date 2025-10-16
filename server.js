const express = require("express");
const { exec } = require("child_process");
require("dotenv").config();

const app = express();
app.use(express.json());

const API_TOKEN = process.env.API_TOKEN;

app.post("/api/command", (req, res) => {
  const { token, action } = req.body;
  if (token !== API_TOKEN) return res.status(403).send("Unauthorized");

  let cmd;
  if (action === "restart") cmd = "shutdown /r /t 0";
  else if (action === "shutdown") cmd = "shutdown /s /t 0";
  else if (action === "reset-password") cmd = "net user Administrator NEWPASSWORD";
  else return res.status(400).send("Invalid action");

  exec(cmd, (err, stdout, stderr) => {
    if (err) return res.status(500).send(stderr);
    res.send(stdout || "Command executed successfully");
  });
});

app.listen(3000, () => console.log("✅ Web Service running on port 3000"));
