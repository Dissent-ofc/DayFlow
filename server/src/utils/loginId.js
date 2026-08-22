/**
 * Generates the system Login ID in the format shown in the wireframe:
 *   [Company code][First 2 letters of first + last name][Year][Serial]
 *   Example: OIJODO20220001
 *     OI    -> Odoo India (company code)
 *     JODO  -> "Jo"hn "Do"e (first 2 letters of first + last name)
 *     2022  -> year of joining
 *     0001  -> serial number of joining, for that year
 */

/** Derives a 2-letter company code from a company name, e.g. "Odoo India" -> "OI". */
export function deriveCompanyCode(companyName) {
  const words = companyName.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return words[0].slice(0, 2).toUpperCase();
}

export function generateLoginId({ companyCode, firstName, lastName, joinYear, serial }) {
  const namePart = (firstName.slice(0, 2) + lastName.slice(0, 2)).toUpperCase();
  const serialPart = String(serial).padStart(4, "0");
  return `${companyCode}${namePart}${joinYear}${serialPart}`;
}

/** Generates a random temporary password (system-issued, per the wireframe note). */
export function generateTempPassword(length = 10) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}
