const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include", // sends/receives the httpOnly auth cookie
    headers: { "Content-Type": "application/json", ...options.headers },
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error ?? "Something went wrong.");
  }
  return data;
}

export const api = {
  // Auth
  login: (identifier, password) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ identifier, password }) }),

  registerCompany: (payload) =>
    request("/auth/register-company", { method: "POST", body: JSON.stringify(payload) }),

  logout: () => request("/auth/logout", { method: "POST" }),

  me: () => request("/auth/me"),

  changePassword: (currentPassword, newPassword) =>
    request("/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  // Employees
  listEmployees: () => request("/employees"),

  getEmployee: (id) => request(`/employees/${id}`),

  createEmployee: (data) =>
    request("/employees", { method: "POST", body: JSON.stringify(data) }),
};
