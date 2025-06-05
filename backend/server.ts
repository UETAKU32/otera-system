import dotenv from "dotenv";
import express, { Request, Response } from "express";
import path from "path";
import { Area, Deceased, PrismaClient } from "@prisma/client";

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
  const members = await prisma.member.findMany({
    include: {
      temple: true, // Temple情報をEager Load
    },
  });
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
      templeId: Number(request.body.templeId),
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


app.get("/api/temples/:id", async (request: Request, response: Response) => {
  const templeId = parseInt(request.params.id, 10); // URLパラメータからidを取得し整数に変換
  try {
    const temple = await prisma.temple.findUnique({
      where: { id: templeId },
      include: { members: true }, // membersをEager Load
    });
    if (temple) {
      response.json(temple);
    } else {
      response.status(404).json({ error: "Temple not found" });
    }
  } catch (error) {
    response.status(500).json({ error: "Internal server error" });
  }
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


type AreaForm = Omit<Area, "id"> & {
  templeIds : number[];
};
app.post("/api/areas", async (request: Request<any,any,AreaForm>, response: Response) => {
  console.log({ body: request.body });
  const area = await prisma.area.create({
    data: {
      name: request.body.name,
      temples: {
        connect: request.body.templeIds.map((templeId) => ({ id: Number(templeId) })),
      },
    },
  });
  response.json(area);
});

app.get("/api/areas", async (request: Request, response: Response) => {
  const areas = await prisma.area.findMany();
  response.json(areas);
});



server
  .listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
  })
  .on("error", (error: Error) => {
    // エラーの処理
    throw new Error(error.message);
  });
