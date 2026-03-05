/**
 * Local Storage Helper for ORIZURU
 */
export const storage = {
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(`orizuru_${key}`);
            return item ? JSON.parse(item) : defaultValue;
        } catch {
            return defaultValue;
        }
    },
    set: (key, value) => {
        try {
            localStorage.setItem(`orizuru_${key}`, JSON.stringify(value));
        } catch (e) {
            console.warn("Storage error", e);
        }
    },
    remove: (key) => {
        try {
            localStorage.removeItem(`orizuru_${key}`);
        } catch (e) {
            console.warn("Storage removal error", e);
        }
    }
};
