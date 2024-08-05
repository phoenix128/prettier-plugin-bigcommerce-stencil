import { expect } from "chai";
import parseAttributes from "./parse-attributes.js";

describe("parseAttributes", () => {
    it("should parse key/value pairs", () => {
        const attributeString = 'foo="bar" baz="qux"';
        const result = parseAttributes(attributeString);

        expect(result).to.deep.equal([
            ["foo", '"bar"'],
            ["baz", '"qux"'],
        ]);
    });

    it("should parse key/value pairs with single quotes and normalize to double", () => {
        const attributeString = "foo='bar' baz='qux'";
        const result = parseAttributes(attributeString);

        expect(result).to.deep.equal([
            ["foo", '"bar"'],
            ["baz", '"qux"'],
        ]);
    });

    it("should parse key/value pairs with no quotes", () => {
        const attributeString = "foo=bar baz=qux";
        const result = parseAttributes(attributeString);

        expect(result).to.deep.equal([
            ["foo", "bar"],
            ["baz", "qux"],
        ]);
    });

    it("should parse params", () => {
        const attributeString = "foo bar baz qux";
        const result = parseAttributes(attributeString);

        expect(result).to.deep.equal(["foo", "bar", "baz", "qux"]);
    });

    it("should parse params with quotes", () => {
        const attributeString = '"foo" "bar" "baz" "qux"';
        const result = parseAttributes(attributeString);

        expect(result).to.deep.equal(['"foo"', '"bar"', '"baz"', '"qux"']);
    });

    it("should parse params with single quotes", () => {
        const attributeString = "'foo' 'bar' 'baz' 'qux'";
        const result = parseAttributes(attributeString);

        expect(result).to.deep.equal(['"foo"', '"bar"', '"baz"', '"qux"']);
    });

    it("should parse params with mixed quotes", () => {
        const attributeString = "'foo' bar 'baz' qux";
        const result = parseAttributes(attributeString);

        expect(result).to.deep.equal(['"foo"', "bar", '"baz"', "qux"]);
    });

    it("should parse hash and params", () => {
        const attributeString = 'foo bar baz="qux" quux';
        const result = parseAttributes(attributeString);

        expect(result).to.deep.equal(["foo", "bar", ["baz", '"qux"'], "quux"]);
    });

    it("should parse hash and params with and without quotes in multiline", () => {
        const attributeString = "foo\n" + "bar\n" + 'baz="qux"\n' + "quux";

        const result = parseAttributes(attributeString);

        expect(result).to.deep.equal(["foo", "bar", ["baz", '"qux"'], "quux"]);
    });

    it("should handle mixed quotes within single quotes", () => {
        const attributeString = "foo='b\"a\"r'";
        const result = parseAttributes(attributeString);

        expect(result).to.deep.equal([["foo", '"b&quot;a&quot;r"']]);
    });

    it("should accept params with slashes", () => {
        const attributeString = "test/test key=value";
        const result = parseAttributes(attributeString);

        expect(result).to.deep.equal(["test/test", ["key", "value"]]);
    });

    it("should accept params with dots", () => {
        const attributeString = "test.test key=value";
        const result = parseAttributes(attributeString);

        expect(result).to.deep.equal(["test.test", ["key", "value"]]);
    });
});
