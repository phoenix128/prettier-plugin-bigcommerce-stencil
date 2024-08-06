import { expect } from "chai";
import revertParams from "./revert-params.js";

describe("revertParams", () => {
    it("should revert simple params", () => {
        const params = '_foo="bar" _baz="qux"';
        const result = revertParams(params);
        expect(result).to.equal("foo=bar baz=qux");
    });

    it("should revert escaped params", () => {
        const params = '__foo="bar" __baz="qux"';
        const result = revertParams(params);
        expect(result).to.equal('foo="bar" baz="qux"');
    });

    it("should revert params with spaces", () => {
        const params = '__foo="b a r"';
        const result = revertParams(params);
        expect(result).to.equal('foo="b a r"');
    });

    it("should revert params without keys", () => {
        const params = '_0="foo" _1="bar" _2="baz"';
        const result = revertParams(params);
        expect(result).to.equal("foo bar baz");
    });

    it("should revert params with special chars", () => {
        const params = '_0="foo/foo" _1="bar.bar"';
        const result = revertParams(params);
        expect(result).to.equal("foo/foo bar.bar");
    });

    it("should revert params with quotes", () => {
        const params = '__0="foo" __1="bar"';
        const result = revertParams(params);
        expect(result).to.equal('"foo" "bar"');
    });

    it("should revert params with escaped quotes", () => {
        const params = '__0="b&quot;a&quot;r"';
        const result = revertParams(params);
        expect(result).to.equal('"b\\"a\\"r"');
    });

    it("should revert params with single quotes", () => {
        const params = '__0="foo" __1=\'b"ar\'';
        const result = revertParams(params);
        expect(result).to.equal('"foo" \'b"ar\'');
    });
});
