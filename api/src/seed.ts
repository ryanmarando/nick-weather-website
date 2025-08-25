import bcrypt from "bcrypt";
import { prisma } from "./config"

async function main() {
  const email = process.env.EMAIL;
  const plainPassword = process.env.PASSWORD;

  // Hash the password
  const hashedPassword = await bcrypt.hash(plainPassword!, 10);

  if (!email) {
    return
  }

  // Create admin with hashed password
  const admin = await prisma.admin.create({
    data: {
      email,
      hashedPassword: hashedPassword
    },
  });

  console.log("Admin created:", admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
