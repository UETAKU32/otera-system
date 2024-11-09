// seed.ts

import { PrismaClient, Thread } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 初期データを定義
  const threads = [
    {
      title: "初めてのスレッド",
      content: "これは初めてのスレッドの内容です。",
    },
    {
      title: "二番目のスレッド",
      content: "これは二番目のスレッドの内容です。",
    },
    {
      title: "三番目のスレッド",
      content: null, // contentはオプションなのでnullも許容されます
    },
  ];

  // データベースに初期データを投入
  for (const thread of threads) {
    await prisma.thread.create({
      data: thread,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
