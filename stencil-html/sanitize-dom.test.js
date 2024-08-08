import { expect } from "chai";
import sanitizeDom from "./sanitize-dom.js";

describe("placeholders", () => {
    it("should replace script tags with placeholders", () => {
        const html = '<script>alert("hello")</script>';
        const { dom, placeholders } = sanitizeDom(html);

        expect(dom).to.equal("<script>___PLACEHOLDER_0__</script>");
        expect(placeholders).to.deep.equal(['alert("hello")']);
    });

    it("should replace script tags with attributes", () => {
        const html = '<script type="text/javascript">alert("hello")</script>';
        const { dom, placeholders } = sanitizeDom(html);

        expect(dom).to.equal(
            '<script type="text/javascript">___PLACEHOLDER_0__</script>',
        );
        expect(placeholders).to.deep.equal(['alert("hello")']);
    });

    it("should preserve text nodes", () => {
        const html = "<div>foo</div>";
        const { dom, placeholders } = sanitizeDom(html);

        expect(dom).to.equal("<div>foo</div>");
        expect(placeholders).to.deep.equal([]);
    });

    it("should replace attributes with placeholders if including mustaches", () => {
        const html = '<div foo="bar" baz="{{test}}"></div>';
        const { dom, placeholders } = sanitizeDom(html);

        expect(dom).to.equal('<div foo="bar" baz="___PLACEHOLDER_0__"></div>');
        expect(placeholders).to.deep.equal(["{{test}}"]);
    });

    it("should replace mustaches inside tags", () => {
        const html = '<div {{#if something}}id="pippo"{{/if}}>hello</div>';
        const { dom, placeholders } = sanitizeDom(html);

        expect(dom).to.equal(
            '<div ___PLACEHOLDER_0__id="pippo"___PLACEHOLDER_1__>hello</div>',
        );
        expect(placeholders).to.deep.equal(["{{#if something}}", "{{/if}}"]);
    });

    it("should correctly handle complex structures inside html attributes", () => {
        const html =
            '<div id="{{#if remove_url}}{{remove_url}}{{else}}#{{/if}}">hello</div>';
        const { dom, placeholders } = sanitizeDom(html);

        expect(dom).to.equal(
            '<div id="___PLACEHOLDER_0_____PLACEHOLDER_1_____PLACEHOLDER_2__#___PLACEHOLDER_3__">hello</div>',
        );
        expect(placeholders).to.deep.equal([
            "{{#if remove_url}}",
            "{{remove_url}}",
            "{{else}}",
            "{{/if}}",
        ]);
    });

    it("should correctly handle mustaches with quotes inside html attributes", () => {
        const html =
            "<div id=\"{{#if remove_url}}'{{remove_url}}'{{/if}}\">hello</div>";
        const { dom, placeholders } = sanitizeDom(html);

        expect(dom).to.equal(
            "<div id=\"___PLACEHOLDER_0__'___PLACEHOLDER_1__'___PLACEHOLDER_2__\">hello</div>",
        );
        expect(placeholders).to.deep.equal([
            "{{#if remove_url}}",
            "{{remove_url}}",
            "{{/if}}",
        ]);
    });

    it("should correctly handle mustaches with gt inside html attributes", () => {
        const html = '<div id="this is {{ "a > test"}}">hello</div>';
        const { dom, placeholders } = sanitizeDom(html);

        expect(dom).to.equal(
            '<div id="this is ___PLACEHOLDER_0__">hello</div>',
        );
        expect(placeholders).to.deep.equal(['{{ "a > test"}}']);
    });
});
