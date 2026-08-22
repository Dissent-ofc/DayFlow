export function calculateSalary({ monthlyWage, attendance, leaveRequests, year, month }) {
  const workingDays = 26;
  const presentDays = attendance.filter((record) => record.status === "PRESENT").length;
  const absentDays = attendance.filter((record) => record.status === "ABSENT").length;
  const leaveDays = attendance.filter((record) => record.status === "LEAVE").length;
  const paidLeaveDays = leaveRequests.filter((request) => request.type !== "UNPAID" && request.status === "APPROVED").reduce((total, request) => total + leaveLength(request), 0);
  const unpaidLeaveDays = leaveRequests.filter((request) => request.type === "UNPAID" && request.status === "APPROVED").reduce((total, request) => total + leaveLength(request), 0);
  const absentDeduction = Math.round((monthlyWage / workingDays) * absentDays);
  const unpaidLeaveDeduction = Math.round((monthlyWage / workingDays) * unpaidLeaveDays);
  const basic = Math.round(monthlyWage * 0.5);
  const hra = Math.round(basic * 0.5);
  const standardAllowance = 4167;
  const performanceBonus = Math.round(monthlyWage * 0.0833);
  const leaveTravelAllowance = Math.round(monthlyWage * 0.08333);
  const pf = Math.round(basic * 0.12);
  const professionalTax = 200;
  const gross = basic + hra + standardAllowance + performanceBonus + leaveTravelAllowance;
  const deductions = pf + professionalTax + absentDeduction + unpaidLeaveDeduction;
  return {
    period: `${year}-${String(month).padStart(2, "0")}`,
    monthlyWage,
    workingDays,
    presentDays,
    absentDays,
    leaveDays: leaveDays + paidLeaveDays,
    unpaidLeaveDays,
    components: { basic, hra, standardAllowance, performanceBonus, leaveTravelAllowance },
    contributions: { providentFund: pf, professionalTax, absentDeduction, unpaidLeaveDeduction },
    gross,
    totalDeductions: deductions,
    netPay: Math.max(0, gross - deductions),
  };
}

function leaveLength(request) {
  return Math.floor((new Date(request.endDate) - new Date(request.startDate)) / 86400000) + 1;
}