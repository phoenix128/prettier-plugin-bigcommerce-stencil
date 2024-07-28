const { parse } = require('@handlebars/parser');
const { printers } = require('./index');

const runPrettier = (text) => {
    return printers["stencil-html-ast"].print({
        getValue: () => parse(text)
    }, {});
}

describe('prettier-plugin-bigcommerce-stencil', () => {
    it('should indent correctly', () => {
        const text = `{{#if true}}\n<div>\n{{> 'test'}}\n</div>\n{{/if}}`;
        const expected = `{{#if true}}
    <div>
    {{> "test"}}
    </div>
{{/if}}`;

        expect(runPrettier(text)).toBe(expected);
    });

    it('should handle comments', () => {
        const text = `{{!-- comment --}}`;
        const expected = `{{!-- comment --}}`;

        expect(runPrettier(text)).toBe(expected);
    });

    it('should handle and format partials', () => {
        const text = `{{>   "test"}}`;
        const expected = `{{> "test"}}`;

        expect(runPrettier(text)).toBe(expected);
    });

    it ("should convert quotes to double quotes", () => {
        const text = `{{> 'test'}}`;
        const expected = `{{> "test"}}`;

        expect(runPrettier(text)).toBe(expected);
    });

    it('should handle simple mustaches with path', () => {
        const text = `{{test}}`;
        const expected = `{{test}}`;

        expect(runPrettier(text)).toBe(expected);
    });

    it('should handle simple mustaches with string', () => {
        const text = `{{"test"}}`;
        const expected = `{{"test"}}`;

        expect(runPrettier(text)).toBe(expected);
    });

    it('should handle and format hash', () => {
        const text = `{{test  key=value}}`;
        const expected = `{{test key=value}}`;

        expect(runPrettier(text)).toBe(expected);
    });

    it('should handle boolean literals', () => {
        const text = `{{test true}}`;
        const expected = `{{test true}}`;

        expect(runPrettier(text)).toBe(expected);
    });

    it('should handle parameters', () => {
        const text = `{{test "somevalue"}}`;
        const expected = `{{test "somevalue"}}`;

        expect(runPrettier(text)).toBe(expected);
    });

    it('should handle long hashes', () => {
        const text = `{{test key1=value1 key2=value2 key3=value3 key4=value4 key5=value5 key6=value6 key7=value7 key8=value8 key9=value9 key10=value10}}`;
        const expected = `{{test
    key1=value1
    key2=value2
    key3=value3
    key4=value4
    key5=value5
    key6=value6
    key7=value7
    key8=value8
    key9=value9
    key10=value10}}`;

        expect(runPrettier(text)).toBe(expected);
    });

    it('should handle escaped quotes', () => {
        const text = `{{test "some\\"value"}}`;
        const expected = `{{test "some\\"value"}}`;

        expect(runPrettier(text)).toBe(expected);
    });

    it('should handle escaped quotes in hash', () => {
        const text = `{{test key="some\\"value"}}`;
        const expected = `{{test key="some\\"value"}}`;

        expect(runPrettier(text)).toBe(expected);
    });

    it("should remove extra spaces", () => {
        const text = `{{test  "somevalue"  key=value}}\n\n`;
        const expected = `{{test "somevalue" key=value}}`;

        expect(runPrettier(text)).toBe(expected);
    });

    it("should handle triple mustaches", () => {
        const text = `{{{test "somevalue"}}}`;
        const expected = `{{{test "somevalue"}}}`;

        expect(runPrettier(text)).toBe(expected);
    });

    it("should handle inverse sections", () => {
        const text = `{{#if true}}\n{{else}}\n{{/if}}`;
        const expected = `{{#if true}}
{{else}}
{{/if}}`;

        expect(runPrettier(text)).toBe(expected);
    });

    it("should handle block params", () => {
        const text = `{{#if true key=value}}\n{{/if}}`;
        const expected = `{{#if true key=value}}
{{/if}}`;

            expect(runPrettier(text)).toBe(expected);
    });

    it("should collapse triple newlines in a double newline", () => {
        const text = `{{someval}}\n\n\n{{someval}}`;
        const expected = `{{someval}}

{{someval}}`;

            expect(runPrettier(text)).toBe(expected);
    });

    it('should preserve header indentation', () => {
        const text = `---
products:
    new:
        limit: {{theme_settings.homepage_new_products_count}}
    featured:
        limit: {{theme_settings.homepage_featured_products_count}}
    top_sellers:
        limit: {{theme_settings.homepage_top_products_count}}
carousel: {{theme_settings.homepage_show_carousel}}
blog:
    recent_posts:
        limit: {{theme_settings.homepage_blog_posts_count}}
---
{{#partial "hero"}}

{{/partial}}`;


        expect(runPrettier(text)).toBe(text);
    });
});
