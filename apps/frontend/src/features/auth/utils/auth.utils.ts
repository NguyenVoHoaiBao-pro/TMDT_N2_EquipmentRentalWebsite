// Regex for validating user input

export const fullNameRegex = /^[a-zA-Z\s]+$/;
export const phoneRegex = /^[0-9]{10}$/;
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
