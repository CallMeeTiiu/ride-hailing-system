/**
 * Helper auto-formatting phone number for driver app.
 * Converts digits into: +84 123 456 789 format.
 */
export const formatPhoneNumber = (text: string): string => {
    // Remove non-digit characters except +
    let cleaned = text.replace(/[^\d+]/g, '');

    // Handle +84 conversions
    if (cleaned.startsWith('+84')) {
        let digits = cleaned.slice(3).replace(/\D/g, '');
        return formatDigits(digits);
    }

    if (cleaned.startsWith('84')) {
        let digits = cleaned.slice(2).replace(/\D/g, '');
        return formatDigits(digits);
    }

    // Remove leading 0 dynamically
    if (cleaned.startsWith('0')) {
        let digits = cleaned.slice(1).replace(/\D/g, '');
        return formatDigits(digits);
    }

    let digits = cleaned.replace(/\D/g, '');
    return formatDigits(digits);
};

const formatDigits = (digits: string): string => {
    if (!digits) return '+84 ';

    if (digits.length <= 3) {
        return `+84 ${digits}`;
    } else if (digits.length <= 6) {
        return `+84 ${digits.slice(0, 3)} ${digits.slice(3)}`;
    } else {
        return `+84 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
    }
};
