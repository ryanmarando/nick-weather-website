import bcrypt from "bcrypt";
import { prisma } from "./config";

const seedYoutubeVideos = [
  {
    url: "https://wwww.youtube.com/watch?v=B4u1nXhh5ck",
    title: "Youtube Video UPDATED1",
    onFrontpage: false,
    adminId: 1,
  },
  {
    url: "https://www.youtube.com/watch?v=uP2WSUBnFBA",
    title: "3D Floor Map - Experiment - 7/31/2025",
    onFrontpage: true,
    adminId: 1,
  },
  {
    url: "https://www.youtube.com/watch?v=-P3Chg40DV4",
    title: "Drought Package",
    onFrontpage: false,
    adminId: 1,
  },
  {
    url: "https://www.youtube.com/watch?v=EzMuPUo7rKU",
    title: "Everyday Weather",
    onFrontpage: false,
    adminId: 1,
  },
];

async function main() {
  const email = process.env.EMAIL;
  const plainPassword = process.env.PASSWORD;

  // Hash the password
  const hashedPassword = await bcrypt.hash(plainPassword!, 10);

  if (!email) {
    return;
  }

  // Create admin with hashed password
  const admin = await prisma.admin.create({
    data: {
      email,
      hashedPassword: hashedPassword,
    },
  });

  console.log("Admin created:", admin);

  console.log("Seeding YouTube videos...");

  // Delete all existing videos to start fresh
  await prisma.youtubeVideo.deleteMany({});

  // Create new videos
  for (const video of seedYoutubeVideos) {
    await prisma.youtubeVideo.create({
      data: video,
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
