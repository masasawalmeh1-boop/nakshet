const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  await prisma.message.deleteMany();
  await prisma.conversationMember.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.upload.deleteMany();
  await prisma.project.deleteMany();
  await prisma.clientProfile.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("12345678", 10);

  const company = await prisma.user.create({
    data: {
      name: "NAKSHET Company",
      email: "company@nakshet.com",
      passwordHash,
      role: "company",
    },
  });

  const designer = await prisma.user.create({
    data: {
      name: "Sara Designer",
      email: "designer@nakshet.com",
      passwordHash,
      role: "designer",
    },
  });

  const client = await prisma.user.create({
    data: {
      name: "Taste House",
      email: "client@nakshet.com",
      passwordHash,
      role: "client",
      clientProfile: {
        create: {
          companyName: "Taste House",
          businessType: "Restaurant",
          contactPerson: "Omar Khaled",
          phone: "0597000000",
          location: "Nablus",
          packageName: "Premium",
          contractStart: "2026-04-01",
          contractStatus: "Active",
          website: "https://tastehouse.com",
          socialMedia: "Instagram, Facebook",
        },
      },
    },
  });

  const project = await prisma.project.create({
    data: {
      name: "Taste House Ramadan Campaign",
      service: "Social Media Design + Video",
      status: "In Progress",
      deadline: "2026-04-20",
      ownerId: company.id,
      designerId: designer.id,
    },
  });

  const conversation = await prisma.conversation.create({
    data: {
      title: "Ramadan Campaign Chat",
      projectId: project.id,
      members: {
        create: [
          { userId: company.id },
          { userId: designer.id },
          { userId: client.id },
        ],
      },
    },
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: conversation.id,
        senderId: company.id,
        text: "Please upload the first poster design today.",
      },
      {
        conversationId: conversation.id,
        senderId: designer.id,
        text: "Sure, I will upload both the poster and story version.",
      },
      {
        conversationId: conversation.id,
        senderId: client.id,
        text: "Please keep the brand colors warm and elegant.",
      },
    ],
  });

  await prisma.upload.create({
    data: {
      title: "Initial Poster Design",
      fileName: "sample-poster.jpg",
      fileUrl: "/uploads/sample-poster.jpg",
      fileType: "image/jpeg",
      category: "design",
      status: "Pending Review",
      note: "First draft for approval.",
      uploaderId: designer.id,
      projectId: project.id,
    },
  });

  console.log("Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });