import { expect } from "chai";
import convertMustaches from "./convert-mustaches.js";

describe("convertMustaches", () => {
    it("should convert a simple mustache", () => {
        const text = "{{ mustache }}";
        const result = convertMustaches(text);
        expect(result).to.equal('<hbs:m _0="mustache" />');
    });

    it("should convert a simple raw mustaches", () => {
        const text = "{{{ rawMustache }}}";
        const result = convertMustaches(text);
        expect(result).to.equal('<hbs:r _0="rawMustache" />');
    });

    it("should convert a simple mustache with params", () => {
        const text = "{{ mustache param1 'param2' }}";
        const result = convertMustaches(text);
        expect(result).to.equal(
            '<hbs:m _0="mustache" _1="param1" __2="param2" />',
        );
    });

    it("should convert a simple mustache with params with values to escape", () => {
        const text = "{{ mustache param1 'par\"am2' }}";
        const result = convertMustaches(text);
        expect(result).to.equal(
            '<hbs:m _0="mustache" _1="param1" __2="par&quot;am2" />',
        );
    });

    it("should convert a simple mustache with hashes", () => {
        const text = '{{ mustache param1 key="value" }}';
        const result = convertMustaches(text);
        expect(result).to.equal(
            '<hbs:m _0="mustache" _1="param1" __key="value" />',
        );
    });

    it("should escape params and hashes", () => {
        const text = '{{ test/test foo=\'b"a"r\' baz="qux" }}';
        const result = convertMustaches(text);
        expect(result).to.equal(
            '<hbs:m _0="test/test" __foo="b&quot;a&quot;r" __baz="qux" />',
        );
    });

    it("should convert nested if statements", () => {
        const text = "{{#if condition}}{{#if nested}}true{{/if}}{{/if}}";
        const result = convertMustaches(text);
        expect(result).to.equal(
            '<hbs:b:if _1="condition"><hbs:b:if _1="nested">true</hbs:b:if></hbs:b:if>',
        );
    });

    it("should convert two non nested blocks", () => {
        const text = "{{#if condition}}true{{/if}}{{#if nested}}true{{/if}}";
        const result = convertMustaches(text);
        expect(result).to.equal(
            '<hbs:b:if _1="condition">true</hbs:b:if><hbs:b:if _1="nested">true</hbs:b:if>',
        );
    });

    it("should handle empty blocks", () => {
        const text = "{{#if condition}}{{/if}}";
        const result = convertMustaches(text);
        expect(result).to.equal('<hbs:b:if _1="condition"></hbs:b:if>');
    });

    it("should convert if-else statements", () => {
        const text = "{{#if condition}}true{{else}}false{{/if}}";
        const result = convertMustaches(text);
        expect(result).to.equal(
            '<hbs:b:if _1="condition">true</hbs:b:if><hbs:e:if>false</hbs:e:if>',
        );
    });

    it("should convert if-else-if statements with newlines", () => {
        const text = "{{#if condition}}\ntrue\n{{else}}\nfalse\n{{/if}}";
        const result = convertMustaches(text);
        expect(result).to.equal(
            '<hbs:b:if _1="condition">\n' +
                "true\n" +
                "</hbs:b:if><hbs:e:if>\n" +
                "false\n" +
                "</hbs:e:if>",
        );
    });

    it("should handle nested if-else blocks", () => {
        const text =
            "{{#if condition1}}true1{{else}}{{#if condition2}}true2{{else}}false2{{/if}}{{/if}}";
        const result = convertMustaches(text);
        expect(result).to.equal(
            '<hbs:b:if _1="condition1">true1</hbs:b:if><hbs:e:if><hbs:b:if _1="condition2">true2</hbs:b:if><hbs:e:if>false2</hbs:e:if></hbs:e:if>',
        );
    });

    it("should handle nested block helpers", () => {
        const text = "{{#if condition}}{{#each items}}item{{/each}}{{/if}}";
        const result = convertMustaches(text);
        expect(result).to.equal(
            '<hbs:b:if _1="condition">' +
                '<hbs:b:each _1="items">item</hbs:b:each>' +
                "</hbs:b:if>",
        );
    });

    it("should handle multiple block helpers in complex structures", () => {
        const text =
            '{{#partial "page"}}\n' +
            "\n" +
            "{{> components/common/breadcrumbs breadcrumbs=breadcrumbs}}\n" +
            "\n" +
            '<section class="page">\n' +
            "    {{#unless theme_settings.hide_contact_us_page_heading }}\n" +
            '        <h1 class="page-heading">{{page.title}}</h1>\n' +
            "    {{/unless}}\n" +
            "</section>\n" +
            "\n" +
            "{{/partial}}\n";

        const result = convertMustaches(text);
        expect(result).to.equal(
            '<hbs:b:partial __1="page">\n' +
                "\n" +
                '<hbs:p _0="components/common/breadcrumbs" _breadcrumbs="breadcrumbs" />\n' +
                "\n" +
                '<section class="page">\n' +
                '    <hbs:b:unless _1="theme_settings.hide_contact_us_page_heading">\n' +
                '        <h1 class="page-heading"><hbs:m _0="page.title" /></h1>\n' +
                "    </hbs:b:unless>\n" +
                "</section>\n" +
                "\n" +
                "</hbs:b:partial>\n",
        );
    });

    it("should convert a simple if statement", () => {
        const text = "{{#if condition}}true{{/if}}";
        const result = convertMustaches(text);
        expect(result).to.equal('<hbs:b:if _1="condition">true</hbs:b:if>');
    });

    it("should convert block helpers", () => {
        const text = "{{#each items}}item{{/each}}";
        const result = convertMustaches(text);
        expect(result).to.equal('<hbs:b:each _1="items">item</hbs:b:each>');
    });

    it("should convert a real life block helper", () => {
        const text =
            "{{#unless theme_settings.hide_contact_us_page_heading }}\n" +
            '    <h1 class="page-heading">{{page.title}}</h1>\n' +
            "{{/unless}}\n";

        const result = convertMustaches(text);
        expect(result).to.equal(
            '<hbs:b:unless _1="theme_settings.hide_contact_us_page_heading">\n' +
                '    <h1 class="page-heading"><hbs:m _0="page.title" /></h1>\n' +
                "</hbs:b:unless>\n",
        );
    });

    it("should convert partials", () => {
        const text = '{{> partialName param="value"}}';
        const result = convertMustaches(text);
        expect(result).to.equal('<hbs:p _0="partialName" __param="value" />');
    });

    it("should convert strip whitespace", () => {
        const text = "{{~ stripMe }}";
        const result = convertMustaches(text);
        expect(result).to.equal('<hbs:m _0="stripMe" s="o" />');
    });

    it("should convert comments", () => {
        const text = "{{!-- This is a comment --}}";
        const result = convertMustaches(text);
        expect(result).to.equal("<hbs:c> This is a comment </hbs:c>");
    });

    it("should convert short comments", () => {
        const text = "{{! This is a short comment }}";
        const result = convertMustaches(text);
        expect(result).to.equal("<hbs:c> This is a short comment </hbs:c>");
    });

    it("should convert mustaches", () => {
        const text = '{{ mustache param="value" }}';
        const result = convertMustaches(text);
        expect(result).to.equal('<hbs:m _0="mustache" __param="value" />');
    });

    it("should convert params with quotes", () => {
        const text = '{{test key="some\\"value"}}';
        const result = convertMustaches(text);
        expect(result).to.equal('<hbs:m _0="test" __key="some&quot;value" />');
    });

    it("should convert mustache with multiple params", () => {
        const text = "{{~inject 'zoomSize' theme_settings.zoom_size}}";
        const result = convertMustaches(text);
        expect(result).to.equal(
            '<hbs:m _0="inject" __1="zoomSize" _2="theme_settings.zoom_size" s="o" />',
        );
    });

    it("should handle sub expressions", () => {
        const text = "{{helper (subhelper param1 param2)}}";
        const result = convertMustaches(text);
        expect(result).to.equal(
            '<hbs:m _0="helper" _1="(subhelper param1 param2)" />',
        );
    });
});
