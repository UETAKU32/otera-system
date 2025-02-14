import dotenv from "dotenv";
import express, { Request, Response } from "express";
import path from "path";
import { Deceased, PrismaClient } from "@prisma/client";

dotenv.config();
const cors = require("cors");
const app = express();
app.use(cors());

app.use(
  cors({
    origin: "http://localhost:3000", // 許可するドメインを指定
    methods: "GET,POST,PUT,DELETE", // 許可する HTTP メソッドを指定
    allowedHeaders: "Content-Type,Authorization", // 許可するヘッダーを指定
  })
);

const http = require("http");
const server = http.createServer(app);

const PORT = process.env.PORT;

const prisma = new PrismaClient();

app.use(express.static(path.join(__dirname)));

app.use(express.json()); // body-parser settings

app.get("/api/members", async (request: Request, response: Response) => {
  const members = await prisma.member.findMany();
  response.json(members);
});

app.post("/api/members", async (request: Request, response: Response) => {
  console.log({ body: request.body });
  const member = await prisma.member.create({
    data: {
      name: request.body.name,
      address: request.body.address,
      phoneNumber: request.body.phoneNumber,
      birthday: new Date(request.body.birthday), //HACK: フロントでDateで送ってるはず！Responseの型定義ちゃんとすれば治りそう
    },
  });
  response.json(member);
});

app.get("/api/deceased", async (request: Request, response: Response) => {
  const deceased = await prisma.deceased.findMany();
  response.json(deceased);
});

export type CreateDeceasedRequest = Request<unknown, unknown, Omit<Deceased, "id">, unknown>; 
app.post("/api/deceased", async (request: CreateDeceasedRequest, response: Response) => {
  console.log({ body: request.body });
  const deceased = await prisma.deceased.create({
    data: {
      name: request.body.name,
      kaimyou: request.body.kaimyou,
      relationToMember: request.body.relationToMember,
      memberId: Number(request.body.memberId),//HACK: なぜか文字列になってしまう
      birthday: request.body.birthday, //HACK: フロントでDateで送ってるはず！Responseの型定義ちゃんとすれば治りそう
      deceasedDay: request.body.deceasedDay,
      kyounen: request.body.kyounen,
      comment: request.body.comment,
    },
  });
  response.json(deceased);
});

app.get("/api/temples", async (request: Request, response: Response) => {
  const temples = await prisma.temple.findMany();
  response.json(temples);
});

app.post("/api/temple", async (request: Request, response: Response) => {
  console.log({ body: request.body });
  const temple = await prisma.temple.create({
    data: {
      name: request.body.name,
    },
  });
  response.json(temple);
});
server
  .listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
  })
  .on("error", (error: Error) => {
    // エラーの処理
    throw new Error(error.message);
  });
