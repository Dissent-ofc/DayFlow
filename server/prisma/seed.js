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
      firstName: "Priya",
      lastName: "HR",
      email: "priya.hr@dayflow.io",
      loginId: "OIPRHR20220011",
      password: "PriyaHR@2022",
      role: "HR",
      jobTitle: "HR Officer",
      department: "Human Resources",
      phone: "+91 98765 43220",
      location: "Bengaluru, IN",
      joinYear: 2022,
      serial: 11,
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

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const attendanceStatuses = [
    { loginId: "OISPAD20220001", status: "PRESENT" },
    { loginId: "OIPRHR20220011", status: "PRESENT" },
    { loginId: "OIAKKA20220003", status: "LEAVE" },
    { loginId: "OIVIKU20220005", status: "ABSENT" },
    { loginId: "OIROSH20220007", status: "LEAVE" },
    { loginId: "OIDIVE20220009", status: "ABSENT" },
  ];

  for (const attendance of attendanceStatuses) {
    const employee = await prisma.employee.findUnique({ where: { loginId: attendance.loginId } });
    if (employee) {
      const checkIn = attendance.status === "PRESENT" ? new Date(today.getTime() - 5.5 * 60 * 60 * 1000 + (9 * 60 + 20) * 60 * 1000) : null;
      const checkOut = attendance.status === "PRESENT" ? new Date(today.getTime() - 5.5 * 60 * 60 * 1000 + (17 * 60 + 20) * 60 * 1000) : null;
      await prisma.attendance.upsert({
        where: { employeeId_date: { employeeId: employee.id, date: today } },
        update: { status: attendance.status, checkIn, checkOut },
        create: { employeeId: employee.id, date: today, status: attendance.status, checkIn, checkOut },
      });
    }
  }

  const leaveReasons = ["Medical appointment", "Personal leave", "Family responsibility", "Rest day"];
  const absentReasons = ["Unplanned absence", "No check-in recorded", "Personal emergency"];
  const historyStart = new Date(today);
  historyStart.setUTCDate(historyStart.getUTCDate() - 60);
  const allEmployees = await prisma.employee.findMany({ select: { id: true } });
  for (const employee of allEmployees) {
    for (const cursor = new Date(historyStart); cursor < today; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
      if (cursor.getUTCDay() === 0 || cursor.getUTCDay() === 6) continue;
      const roll = Math.random();
      const status = roll < 0.88 ? "PRESENT" : roll < 0.94 ? "LEAVE" : "ABSENT";
      const reason = status === "PRESENT" ? null : (status === "LEAVE" ? leaveReasons : absentReasons)[Math.floor(Math.random() * 3)];
      const indiaOffset = 5.5 * 60 * 60 * 1000;
      const checkIn = status === "PRESENT" ? new Date(cursor.getTime() - indiaOffset + (9 * 60 + Math.floor(Math.random() * 60)) * 60 * 1000) : null;
      const checkOut = status === "PRESENT" ? new Date(cursor.getTime() - indiaOffset + (17 * 60 + Math.floor(Math.random() * 60)) * 60 * 1000) : null;
      await prisma.attendance.upsert({
        where: { employeeId_date: { employeeId: employee.id, date: new Date(cursor) } },
        update: { status, reason, checkIn, checkOut },
        create: { employeeId: employee.id, date: new Date(cursor), status, reason, checkIn, checkOut },
      });
    }
  }

  const approvedLeaves = [
    { loginId: "OIAKKA20220003", type: "PAID", daysAgo: 14, length: 2, remarks: "Personal leave" },
    { loginId: "OIROSH20220007", type: "SICK", daysAgo: 28, length: 1, remarks: "Medical appointment" },
    { loginId: "OIJODO20220001", type: "PAID", daysAgo: 42, length: 3, remarks: "Family responsibility" },
  ];
  for (const leave of approvedLeaves) {
    const employee = await prisma.employee.findUnique({ where: { loginId: leave.loginId }, select: { id: true } });
    if (!employee) continue;
    const startDate = new Date(today);
    startDate.setUTCDate(startDate.getUTCDate() - leave.daysAgo);
    const endDate = new Date(startDate);
    endDate.setUTCDate(endDate.getUTCDate() + leave.length - 1);
    const existing = await prisma.leaveRequest.findFirst({ where: { employeeId: employee.id, startDate, endDate, type: leave.type } });
    if (!existing) {
      await prisma.leaveRequest.create({ data: { employeeId: employee.id, type: leave.type, startDate, endDate, remarks: leave.remarks, status: "APPROVED" } });
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
