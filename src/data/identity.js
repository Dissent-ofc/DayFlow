export function loginIdFromName(name) {
  const [firstName = "", lastName = ""] = name.trim().split(/\s+/);
  return `${firstName.slice(0, 2)}${lastName.slice(0, 2)}`.toUpperCase();
}

export function employeeIdFromDetails(companyName, employeeName, joiningYear, serialNumber) {
  const companyInitials = companyName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const employeeLoginId = loginIdFromName(employeeName);
  const year = String(joiningYear).replace(/\D/g, "").slice(-4).padStart(4, "0");
  const serial = String(serialNumber).replace(/\D/g, "").padStart(4, "0");

  if (companyInitials.length !== 2 || employeeLoginId.length !== 4 || year.length !== 4 || serial.length !== 4) {
    throw new Error("Employee ID requires a two-letter company, full employee name, year, and serial number.");
  }

  return `${companyInitials}${employeeLoginId}${year}${serial}`;
}