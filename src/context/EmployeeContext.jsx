import { createContext, useContext, useState } from "react";
import { getEmployees, saveEmployees } from "../data/employeeStore";

const EmployeeContext = createContext(null);

export function EmployeeProvider({ children }) {
  const [employees, setEmployees] = useState(() => getEmployees());

  function addEmployee(employee) {
    setEmployees((current) => {
      const updated = [...current, employee];
      saveEmployees(updated);
      return updated;
    });
  }

  return <EmployeeContext.Provider value={{ employees, addEmployee }}>{children}</EmployeeContext.Provider>;
}

export function useEmployees() {
  const context = useContext(EmployeeContext);
  if (!context) throw new Error("useEmployees must be used inside EmployeeProvider");
  return context;
}
