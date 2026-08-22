import { prisma } from "../src/lib/prisma.js";
import { hashPassword } from "../src/utils/auth.js";

async function main() {
  console.log("Seeding database with default users and company...");

  // 1. Create or get Company
  const company = await prisma.company.upsert({
    where: { code: "OI" },
    update: {},
    create: {
      name: "Odoo India",
      code: "OI",
    },
  });

  console.log(`Company: ${company.name} (${company.code})`);

  // Default demo accounts
  const demoUsers = [
    {
      firstName: "Sparsh",
      lastName: "Admin",
      email: "sparsh.admin@dayflow.io",
      loginId: "OISPAD20220001",
      password: "SparshAdmin@2026",
      role: "ADMIN",
      jobTitle: "People Operations Lead",
      department: "Human Resources",
      phone: "+91 98765 43210",
      location: "Bengaluru, IN",
      joinYear: 2022,
      serial: 1,
    },
    {
      firstName: "Jordan",
      lastName: "Dean",
      email: "jordan.dean@dayflow.io",
      loginId: "OIJODO20220001",
      password: "Jordan@2022",
      role: "EMPLOYEE",
      jobTitle: "Product Designer",
      department: "Product & Design",
      phone: "+91 98765 43211",
      location: "Bengaluru, IN",
      joinYear: 2022,
      serial: 2,
    },
    {
      firstName: "Riya",
      lastName: "Halder",
      email: "riya.halder@dayflow.io",
      loginId: "OIRIHA20220002",
      password: "Riya@2022",
      role: "EMPLOYEE",
      jobTitle: "Software Engineer",
      department: "Engineering",
      phone: "+91 98765 43212",
      location: "Bengaluru, IN",
      joinYear: 2022,
      serial: 3,
    },
    {
      firstName: "Akash",
      lastName: "Kapoor",
      email: "akash.kapoor@dayflow.io",
      loginId: "OIAKKA20220003",
      password: "Akash@2022",
      role: "EMPLOYEE",
      jobTitle: "Talent Partner",
      department: "Human Resources",
      phone: "+91 98765 43213",
      location: "Mumbai, IN",
      joinYear: 2022,
      serial: 4,
    },
    {
      firstName: "Sana",
      lastName: "Mehta",
      email: "sana.mehta@dayflow.io",
      loginId: "OISAME20220004",
      password: "Sana@2022",
      role: "EMPLOYEE",
      jobTitle: "Quality Analyst Lead",
      department: "Engineering",
      phone: "+91 98765 43214",
      location: "Bengaluru, IN",
      joinYear: 2022,
      serial: 5,
    },
    {
      firstName: "Vikram",
      lastName: "Kumar",
      email: "vikram.kumar@dayflow.io",
      loginId: "OIVIKU20220005",
      password: "Vikram@2022",
      role: "EMPLOYEE",
      jobTitle: "DevOps Engineer",
      department: "Infrastructure",
      phone: "+91 98765 43215",
      location: "Hyderabad, IN",
      joinYear: 2022,
      serial: 6,
    },
    {
      firstName: "Neha",
      lastName: "Patil",
      email: "neha.patil@dayflow.io",
      loginId: "OINEPA20220006",
      password: "Neha@2022",
      role: "EMPLOYEE",
      jobTitle: "Product Manager",
      department: "Product",
      phone: "+91 98765 43216",
      location: "Pune, IN",
      joinYear: 2022,
      serial: 7,
    },
    {
      firstName: "Rohit",
      lastName: "Sharma",
      email: "rohit.sharma@dayflow.io",
      loginId: "OIROSH20220007",
      password: "Rohit@2022",
      role: "EMPLOYEE",
      jobTitle: "Backend Engineer",
      department: "Engineering",
      phone: "+91 98765 43217",
      location: "Bengaluru, IN",
      joinYear: 2022,
      serial: 8,
    },
    {
      firstName: "Ananya",
      lastName: "Iyer",
      email: "ananya.iyer@dayflow.io",
      loginId: "OIANIY20220008",
      password: "Ananya@2022",
      role: "EMPLOYEE",
      jobTitle: "Frontend Engineer",
      department: "Engineering",
      phone: "+91 98765 43218",
      location: "Chennai, IN",
      joinYear: 2022,
      serial: 9,
    },
    {
      firstName: "Divya",
      lastName: "Verma",
      email: "divya.verma@dayflow.io",
      loginId: "OIDIVE20220009",
      password: "Divya@2022",
      role: "EMPLOYEE",
      jobTitle: "Operations Specialist",
      department: "Operations",
      phone: "+91 98765 43219",
      location: "Delhi, IN",
      joinYear: 2022,
      serial: 10,
    },
  ];

  for (const user of demoUsers) {
    const passwordHash = await hashPassword(user.password);
    const existing = await prisma.employee.findUnique({
      where: { email: user.email },
    });

    if (!existing) {
      const created = await prisma.employee.create({
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          loginId: user.loginId,
          passwordHash,
          role: user.role,
          jobTitle: user.jobTitle,
          department: user.department,
          phone: user.phone,
          location: user.location,
          companyId: company.id,
          joinYear: user.joinYear,
          serial: user.serial,
          mustChangePassword: false,
        },
      });
      console.log(`Created user: ${created.firstName} ${created.lastName} [${created.loginId}]`);
    } else {
      // Update password and loginId to ensure match
      await prisma.employee.update({
        where: { id: existing.id },
        data: {
          loginId: user.loginId,
          passwordHash,
          role: user.role,
          jobTitle: user.jobTitle,
          department: user.department,
          phone: user.phone,
          location: user.location,
        },
      });
      console.log(`Updated user: ${existing.firstName} ${existing.lastName} [${user.loginId}]`);
    }
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
