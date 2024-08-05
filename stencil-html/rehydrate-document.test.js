import { expect } from "chai";
import rehydrateDocument from "./rehydrate-document.js";

describe("rehydrateDocument", () => {
    it("should rehydrate placeholders", () => {
        const html = "<script>___PLACEHOLDER_0__</script>";
        const placeholders = ['alert("hello")'];
        const result = rehydrateDocument(html, placeholders);
        expect(result).to.equal('<script>alert("hello")</script>');
    });
});
