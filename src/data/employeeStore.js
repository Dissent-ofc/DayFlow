import { mockEmployees } from "./mockEmployees";

const STORAGE_KEY = "dayflow-employees";

export function getEmployees() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : mockEmployees;
}

export function saveEmployees(employees) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
}