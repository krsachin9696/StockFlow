/**
 * validators — Shared validation utilities.
 */
export class Validators {
  static isRequired(value, fieldName = 'Field') {
    if (!value || String(value).trim() === '') {
      return `${fieldName} is required.`;
    }
    return null;
  }

  static isPositiveNumber(value, fieldName = 'Value') {
    const num = Number(value);
    if (isNaN(num) || num <= 0) {
      return `${fieldName} must be a positive number greater than 0.`;
    }
    return null;
  }

  static isValidEmail(email) {
    const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!regex.test(email)) return 'Please enter a valid email address.';
    return null;
  }

  static passwordsMatch(p1, p2) {
    if (p1 !== p2) return 'Passwords do not match.';
    return null;
  }

  static minLength(value, min, fieldName = 'Field') {
    if (String(value).length < min) return `${fieldName} must be at least ${min} characters.`;
    return null;
  }

  static maxOrderQty(orderQty, available) {
    const qty = Number(orderQty);
    if (qty > available) {
      return `Order quantity cannot exceed available stock (${available}).`;
    }
    return null;
  }
}
