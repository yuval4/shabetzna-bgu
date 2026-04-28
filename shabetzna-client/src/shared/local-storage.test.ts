import {
    USER_TOKEN_KEY,
    getFromLocalStorage,
    removeFromLocalStorage,
    setLocalStorage,
} from "./local-storage";

describe("local storage helpers", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("sets, gets, and removes values correctly", () => {
        setLocalStorage(USER_TOKEN_KEY, "abc123");
        expect(getFromLocalStorage(USER_TOKEN_KEY)).toBe("abc123");

        removeFromLocalStorage(USER_TOKEN_KEY);
        expect(getFromLocalStorage(USER_TOKEN_KEY)).toBeNull();
    });
});
