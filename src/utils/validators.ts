export namespace Validation {
  export function isRequired(value: string): boolean {
    return value !== undefined && value !== null && value.trim().length > 0;
  }

  export function isNumeric(value: string): boolean {
    return /^\d+$/.test(value.trim());
  }

  export function isValidYear(yearStr: string): boolean {
    const yearRegex = /^(1\d{3}|20\d{2})$/;
    if (!yearRegex.test(yearStr.trim())) {
      return false;
    }
    const year = parseInt(yearStr.trim(), 10);
    const currentYear = new Date().getFullYear();
    return year <= currentYear + 1;
  }

  export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }
}
