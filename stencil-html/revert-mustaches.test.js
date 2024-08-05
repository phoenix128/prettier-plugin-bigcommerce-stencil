import { expect } from "chai";
import reverseMustaches from "./revert-mustaches.js";

describe("reverseMustaches", () => {
    it("should unescape params and hashes", () => {
        const text =
            '<hbs:mustache _0="test/test" __foo="b&quot;a&quot;r" __baz="qux" />';
        const result = reverseMustaches(text);
        expect(result).to.equal('{{test/test foo="b\\"a\\"r" baz="qux"}}');
    });

    it("should convert if-else statements", () => {
        const text =
            '<hbs:if-else><hbs:if _0="condition">true</hbs:if><hbs:else>false</hbs:else></hbs:if-else>';
        const result = reverseMustaches(text);
        expect(result).to.equal("{{#if condition}}true{{else}}false{{/if}}");
    });

    it("should convert if-else statements with newlines", () => {
        const text =
            '<hbs:if-else><hbs:if _0="condition">\ntrue\n</hbs:if><hbs:else>\nfalse\n</hbs:else></hbs:if-else>';
        const result = reverseMustaches(text);
        expect(result).to.equal(
            "{{#if condition}}\ntrue\n{{else}}\nfalse\n{{/if}}",
        );
    });

    it("should handle nested block helpers", () => {
        const text =
            '<hbs:block:if _0="condition"><hbs:block:each _0="items">item</hbs:block:each></hbs:block:if>';
        const result = reverseMustaches(text);
        expect(result).to.equal(
            "{{#if condition}}{{#each items}}item{{/each}}{{/if}}",
        );
    });

    it("should handle multiple block helpers in complex structures", () => {
        const text =
            '<hbs:block:partial _0="page">\n' +
            "\n" +
            '<hbs:partial _0="components/common/breadcrumbs" _breadcrumbs="breadcrumbs" />\n' +
            "\n" +
            '<section class="page">\n' +
            '    <hbs:block:unless _0="theme_settings.hide_contact_us_page_heading">\n' +
            '        <h1 class="page-heading"><hbs:mustache _0="page.title" /></h1>\n' +
            "    </hbs:block:unless>\n" +
            "</section>\n" +
            "\n" +
            "</hbs:block:partial>\n";

        const result = reverseMustaches(text);
        expect(result).to.equal(
            "{{#partial page}}\n" +
                "\n" +
                "{{> components/common/breadcrumbs breadcrumbs=breadcrumbs}}\n" +
                "\n" +
                '<section class="page">\n' +
                "    {{#unless theme_settings.hide_contact_us_page_heading}}\n" +
                '        <h1 class="page-heading">{{page.title}}</h1>\n' +
                "    {{/unless}}\n" +
                "</section>\n" +
                "\n" +
                "{{/partial}}\n",
        );
    });

    it("should convert a simple if statement", () => {
        const text = '<hbs:block:if _0="condition">true</hbs:block:if>';
        const result = reverseMustaches(text);
        expect(result).to.equal("{{#if condition}}true{{/if}}");
    });

    it("should convert block helpers", () => {
        const text = '<hbs:block:each _0="items">item</hbs:block:each>';
        const result = reverseMustaches(text);
        expect(result).to.equal("{{#each items}}item{{/each}}");
    });

    it("should convert multiline partials with params", () => {
        const text = '<hbs:partial\n\t_0="partialName"\n\tparam="value"\n/>';
        const result = reverseMustaches(text);
        expect(result).to.equal(
            "{{> partialName\n" + '\tparam="value"\n' + "}}",
        );
    });

    it("should convert a real life block helper", () => {
        const text =
            '<hbs:block:unless _0="theme_settings.hide_contact_us_page_heading">\n' +
            '    <h1 class="page-heading"><hbs:mustache _0="page.title" /></h1>\n' +
            "</hbs:block:unless>\n";

        const result = reverseMustaches(text);
        expect(result).to.equal(
            "{{#unless theme_settings.hide_contact_us_page_heading}}\n" +
                '    <h1 class="page-heading">{{page.title}}</h1>\n' +
                "{{/unless}}\n",
        );
    });

    it("should convert partials", () => {
        const text = '<hbs:partial _0="partialName" param="value" />';
        const result = reverseMustaches(text);
        expect(result).to.equal('{{> partialName param="value"}}');
    });

    it("should convert strip whitespace", () => {
        const text = '<hbs:strip _0="stripMe" />';
        const result = reverseMustaches(text);
        expect(result).to.equal("{{~stripMe}}");
    });

    it("should convert comments", () => {
        const text = "<hbs:comment>This is a comment</hbs:comment>";
        const result = reverseMustaches(text);
        expect(result).to.equal("{{!-- This is a comment --}}");
    });

    it("should convert raw mustaches", () => {
        const text = '<hbs:raw _0="rawMustache" param="value" />';
        const result = reverseMustaches(text);
        expect(result).to.equal('{{{rawMustache param="value"}}}');
    });

    it("should convert mustaches", () => {
        const text = '<hbs:mustache _0="mustache" param="value" />';
        const result = reverseMustaches(text);
        expect(result).to.equal('{{mustache param="value"}}');
    });

    it("should revert mustaches with multiline params", () => {
        const text =
            "<hbs:mustache\n" +
            '    _0="test"\n' +
            '    _key1="value1"\n' +
            '    _key2="value2"\n' +
            '    _key3="value3"\n' +
            '    _key4="value4"\n' +
            '    _key5="value5"\n' +
            '    _key6="value6"\n' +
            '    _key7="value7"\n' +
            '    _key8="value8"\n' +
            '    _key9="value9"\n' +
            '    _key10="value10"\n' +
            "/>\n";

        const result = reverseMustaches(text);
        expect(result).to.equal(
            "{{test\n" +
                "    key1=value1\n" +
                "    key2=value2\n" +
                "    key3=value3\n" +
                "    key4=value4\n" +
                "    key5=value5\n" +
                "    key6=value6\n" +
                "    key7=value7\n" +
                "    key8=value8\n" +
                "    key9=value9\n" +
                "    key10=value10\n" +
                "}}\n",
        );
    });
});
