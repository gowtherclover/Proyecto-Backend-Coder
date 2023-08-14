export default class CustomError {
    static createError({ name = "Error", cause, message, code }) {
        let error = new Error(message, { cause });
        error.name = name;
        error.code = code;
    
        throw error;
    }
}