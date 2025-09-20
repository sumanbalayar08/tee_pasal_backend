import { PrismaClient } from "@prisma/client";
import { generate_user } from "./scripts/generate_user";

const prisma = new PrismaClient()
async function main() {
  const roles = [
    { name: "admin" },
    { name: "customer" },
    { name: "artist" }
  ];
  
  for (const role of roles) {
    await prisma.role.upsert({
      where: {
        name: role.name
      },
      update: {},
      create: {
        name: role.name
      },
    })
  }
  await generate_user(prisma);
  console.log('✅ Seeded roles:', roles);
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })