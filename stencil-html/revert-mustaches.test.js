import { expect } from "chai";
import reverseMustaches from "./revert-mustaches.js";

describe("reverseMustaches", () => {
    it("should unescape params and hashes", () => {
        const text =
            '<hbs:m _0="test/test" __foo="b&quot;a&quot;r" __baz="qux" />';
        const result = reverseMustaches(text);
        expect(result).to.equal('{{test/test foo="b\\"a\\"r" baz="qux"}}');
    });

    it("should convert if-else statements", () => {
        const text =
            '<hbs:b:if _1="condition">true</hbs:b:if><hbs:e:if>false</hbs:e:if>';
        const result = reverseMustaches(text);
        expect(result).to.equal("{{#if condition}}true{{else}}false{{/if}}");
    });

    it("should convert if-else statements with newlines", () => {
        const text =
            '<hbs:b:if _1="condition">\ntrue\n</hbs:b:if><hbs:e:if>\nfalse\n</hbs:e:if>';
        const result = reverseMustaches(text);
        expect(result).to.equal(
            "{{#if condition}}\ntrue\n{{else}}\nfalse\n{{/if}}",
        );
    });

    it("should handle nested block helpers", () => {
        const text =
            '<hbs:b:if _0="condition"><hbs:b:each _0="items">item</hbs:b:each></hbs:b:if>';
        const result = reverseMustaches(text);
        expect(result).to.equal(
            "{{#if condition}}{{#each items}}item{{/each}}{{/if}}",
        );
    });

    it("should handle multiple block helpers in complex structures", () => {
        const text =
            '<hbs:b:partial _0="page">\n' +
            "\n" +
            '<hbs:p _0="components/common/breadcrumbs" _breadcrumbs="breadcrumbs" />\n' +
            "\n" +
            '<section class="page">\n' +
            '    <hbs:b:unless _0="theme_settings.hide_contact_us_page_heading">\n' +
            '        <h1 class="page-heading"><hbs:mustache _0="page.title" /></h1>\n' +
            "    </hbs:b:unless>\n" +
            "</section>\n" +
            "\n" +
            "</hbs:b:partial>\n";

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
        const text = '<hbs:b:if _0="condition">true</hbs:b:if>';
        const result = reverseMustaches(text);
        expect(result).to.equal("{{#if condition}}true{{/if}}");
    });

    it("should convert block helpers", () => {
        const text = '<hbs:b:each _0="items">item</hbs:b:each>';
        const result = reverseMustaches(text);
        expect(result).to.equal("{{#each items}}item{{/each}}");
    });

    it("should convert multiline partials with params", () => {
        const text = '<hbs:p\n\t_0="partialName"\n\t__param="value"\n/>';
        const result = reverseMustaches(text);
        expect(result).to.equal(
            "{{> partialName\n" + '\tparam="value"\n' + "}}",
        );
    });

    it("should convert a real life block helper", () => {
        const text =
            '<hbs:b:unless _0="theme_settings.hide_contact_us_page_heading">\n' +
            '    <h1 class="page-heading"><hbs:m _0="page.title" /></h1>\n' +
            "</hbs:b:unless>\n";

        const result = reverseMustaches(text);
        expect(result).to.equal(
            "{{#unless theme_settings.hide_contact_us_page_heading}}\n" +
                '    <h1 class="page-heading">{{page.title}}</h1>\n' +
                "{{/unless}}\n",
        );
    });

    it("should convert partials", () => {
        const text = '<hbs:p _0="partialName" __param="value" />';
        const result = reverseMustaches(text);
        expect(result).to.equal('{{> partialName param="value"}}');
    });

    it("should convert comments", () => {
        const text = "<hbs:c>This is a comment</hbs:c>";
        const result = reverseMustaches(text);
        expect(result).to.equal("{{!--This is a comment--}}");
    });

    it("should convert raw mustaches", () => {
        const text = '<hbs:r _0="rawMustache" __param="value" />';
        const result = reverseMustaches(text);
        expect(result).to.equal('{{{rawMustache param="value"}}}');
    });

    it("should convert mustaches", () => {
        const text = '<hbs:m _0="mustache" __param="value" />';
        const result = reverseMustaches(text);
        expect(result).to.equal('{{mustache param="value"}}');
    });

    it("should revert mustaches with multiline params", () => {
        const text =
            "<hbs:m\n" +
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

    it("should hande closing tags at newline", () => {
        const text =
            '<hbs:b:partial __1="hero">\n' +
            '    <hbs:r _0="region" __name="home_below_menu" />\n' +
            '    <hbs:b:and _1="carousel" _2="carousel.slides.length">\n' +
            '        <hbs:p _0="components/carousel" _arrows="theme_settings.homepage_show_carousel_arrows" _play_pause_button="theme_settings.homepage_show_carousel_play_pause_button" />\n' +
            "    </hbs:b:and>\n" +
            "    <hbs:r\n" +
            '        _0="region"\n' +
            '        __name="home_below_carousel"\n' +
            "    />\n" +
            "</hbs:b:partial>";

        const result = reverseMustaches(text);
        expect(result).to.equal(
            '{{#partial "hero"}}\n' +
                '    {{{region name="home_below_menu"}}}\n' +
                "    {{#and carousel carousel.slides.length}}\n" +
                "        {{> components/carousel arrows=theme_settings.homepage_show_carousel_arrows play_pause_button=theme_settings.homepage_show_carousel_play_pause_button}}\n" +
                "    {{/and}}\n" +
                "    {{{region\n" +
                '        name="home_below_carousel"\n' +
                "    }}}\n" +
                "{{/partial}}",
        );
    });
});
