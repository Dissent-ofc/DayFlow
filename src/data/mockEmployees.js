// Placeholder data — replace with API results once the backend is wired up.
import { employeeIdFromDetails } from "./identity";

const employeeSeeds = [
  { name: "Jordan Dean", status: "present" },
  { name: "Riya Halder", status: "present" },
  { name: "Akash Kapoor", status: "leave" },
  { name: "Sana Mehta", status: "present" },
  { name: "Vikram Kumar", status: "absent" },
  { name: "Neha Patil", status: "present" },
  { name: "Rohit Sharma", status: "leave" },
  { name: "Ananya Iyer", status: "present" },
  { name: "Divya Verma", status: "absent" },
];

export const mockEmployees = employeeSeeds.map((employee, index) => ({
  ...employee,
  id: employeeIdFromDetails("Odoo India", employee.name, 2022, index + 1),
}));
