import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { Socket } from "socket.io";
import path from "path";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const cors = require('cors');
const app = express();
app.use(cors());

app.use(cors({
  origin: 'http://localhost:3000', // 許可するドメインを指定
  methods: 'GET,POST,PUT,DELETE', // 許可する HTTP メソッドを指定
  allowedHeaders: 'Content-Type,Authorization', // 許可するヘッダーを指定
}));

const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);

const PORT = process.env.PORT;

const prisma = new PrismaClient();

app.use(express.static(path.join(__dirname)));
//note: スレッド作成時のエラー`request.body as it is undefined express`の回避
app.use(express.json()); // body-parser settings

app.get("/api/members", async (request: Request, response: Response) => {
  const members = await prisma.member.findMany();
  response.json(members);
});


server
  .listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
  })
  .on("error", (error: Error) => {
    // エラーの処理
    throw new Error(error.message);
  });
