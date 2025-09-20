export async function generate_user(prisma) {

  const role = await prisma.role.findUnique({
    where: {
      name: "admin"
    }
  })

  await prisma.user.upsert({
    where: { email: "sumanbalayar62@gmail.com" },
    update: {},
    create: {
      email: "sumanbalayar62@gmail.com",
      firstName: "Suman",
      lastName: "Balayar",
      password: "suman123",
      roleId: role.id,
    },
  });
}