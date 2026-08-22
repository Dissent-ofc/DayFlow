import { employeeIdFromDetails, loginIdFromName } from "./identity";

export const demoAccounts = [
  { role: "admin", name: "Sparsh Admin", loginId: loginIdFromName("Sparsh Admin"), password: "SparshAdmin@2026" },
  { role: "employee", name: "Riya Halder", loginId: loginIdFromName("Riya Halder"), employeeId: employeeIdFromDetails("Odoo India", "Riya Halder", 2022, 2), password: "Riya@2022" },
];

const STORAGE_KEY = "dayflow-accounts";

export function getAccounts() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : demoAccounts;
}

export function saveAccount(account) {
  const accounts = getAccounts();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...accounts, account]));
}