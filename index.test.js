const { parse } = require('@handlebars/parser');
const { printers, parsers } = require('./index');

const runPrettier = (text) => {
    const preprocessedText = parsers["stencil-html"].preprocess(text);
    return printers["stencil-html-ast"].print({
        getValue: () => parse(preprocessedText)
    }, {});
}

const runPreprocess = (text) => {
    return parsers["stencil-html"].preprocess(text);
}

describe('prettier-plugin-bigcommerce-stencil', () => {
    it('should indent correctly', () => {
        const text = `{{#if true}}\n{{#if true}}\n<div>\n{{> 'test'}}\n</div>\n{{/if}}\n{{/if}}`;
        const expected = '{{#if true}}\n' +
            '    {{#if true}}\n' +
            '        <div>\n' +
            '        {{> "test"}}\n' +
            '        </div>\n' +
            '    {{/if}}\n' +
            '{{/if}}';

        expect(runPrettier(text)).toBe(expected);
    });

    it('should preserve inline blocks', () => {
        const text = `{{#if true}}{{add 1 2}}{{/if}}`;

        expect(runPrettier(text)).toBe(text);
    });

    it('should indent inline blocks', () => {
        const text = `{{#if true}}\n{{add 1 2}}{{/if}}`;
        const expected = '{{#if true}}\n' +
            '    {{add 1 2}}\n' +
            '{{/if}}';

        expect(runPrettier(text)).toBe(expected);
    });

    it('should fix wrong indent', () => {
        const text = `\t{{#if true}}\n\t\t{{#if true}}\n<div>\n\t\t{{> 'test'}}\n</div>\n{{/if}}\n{{/if}}`;
        const expected = '{{#if true}}\n' +
            '    {{#if true}}\n' +
            '        <div>\n' +
            '        {{> "test"}}\n' +
            '        </div>\n' +
            '    {{/if}}\n' +
            '{{/if}}';

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
        const expected = '{{test\n' +
            '    key1=value1\n' +
            '    key2=value2\n' +
            '    key3=value3\n' +
            '    key4=value4\n' +
            '    key5=value5\n' +
            '    key6=value6\n' +
            '    key7=value7\n' +
            '    key8=value8\n' +
            '    key9=value9\n' +
            '    key10=value10}}';

        expect(runPrettier(text)).toBe(expected);
    });

    it('should handle indent on few, but long parameters', () => {
        const text = `{{> components/products/featured products=featured columns=theme_settings.homepage_featured_products_column_count}}`;
        const expected = '{{> components/products/featured\n' +
            '    products=featured\n' +
            '    columns=theme_settings.homepage_featured_products_column_count}}';

        expect(runPrettier(text)).toBe(expected);
    });

    it('should fix hashes with wrong indent', () => {
        const text = '{{test key1=value1 key2=value2\n' +
            'key3=value3}}';
        const expected = '{{test\n' +
            '    key1=value1\n' +
            '    key2=value2\n' +
            '    key3=value3}}';

        expect(runPrettier(text)).toBe(expected);
    });

    it ('should preserve multiline hashes', () => {
        const text = `{{test\nkey1=value1\nkey2=value2\nkey3=value3}}`;
        const expected = '{{test\n' +
            '    key1=value1\n' +
            '    key2=value2\n' +
            '    key3=value3}}'

        expect(runPrettier(text)).toBe(expected);
    });

    it ('should nest long lines', () => {
        const text = `{{#if condition}}{{#each items}}{{#with item}}{{#if subCondition}}{{> partial param1=value1 param2=value2 param3=value3 param4=value4 param5=value6 param5=value6}}{{/if}}{{/with}}{{/each}}{{/if}}`;
        const expected = '{{#if condition}}\n' +
            '    {{#each items}}\n' +
            '        {{#with item}}\n' +
            '            {{#if subCondition}}\n' +
            '                {{> partial\n' +
            '                    param1=value1\n' +
            '                    param2=value2\n' +
            '                    param3=value3\n' +
            '                    param4=value4\n' +
            '                    param5=value6\n' +
            '                    param5=value6}}\n' +
            '            {{/if}}\n' +
            '        {{/with}}\n' +
            '    {{/each}}\n' +
            '{{/if}}';

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
        const text = `{{#if true}}\n{{add 1 2}}{{else}}\n{{add 1 2}}\n{{/if}}`;
        const expected = '{{#if true}}\n' +
            '    {{add 1 2}}\n' +
            '{{else}}\n' +
            '    {{add 1 2}}\n' +
            '{{/if}}';

        expect(runPrettier(text)).toBe(expected);
    });

    it("should preserve inline", () => {
        const text = `{{#if true}}{{add 1 2}}{{/if}}`;

        expect(runPrettier(text)).toBe(text);
    });

    it("should handle block params", () => {
        const text = `{{#if true key=value}}\n{{/if}}`;
        const expected = `{{#if true key=value}}\n{{/if}}`;

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
    {{add 1 2}}
{{/partial}}`;


        expect(runPrettier(text)).toBe(text);
    });

    it('should preserve inline syntax for lines not exceeding the length', () => {
        const text = `{{#if condition}}{{#each items}}{{this}}{{/each}}{{/if}}`;

        expect(runPrettier(text)).toBe(text);
    });

    it('should handle subexpressions', () => {
        const text = `{{helper (subhelper param1 param2)}}`;

        expect(runPrettier(text)).toBe(text);
    });

    it('should handle decorators', () => {
        const text = `{{#*inline "myPartial"}}Some content{{/inline}}`;

        expect(runPrettier(text)).toBe(text);
    });

    it('should handle partial blocks', () => {
        const text = `{{#> myPartial}}Default content{{/myPartial}}`;

        expect(runPrettier(text)).toBe(text);
    });

    it('should handle number literals', () => {
        const text = `{{add 1 2.5}}`;
        const expected = `{{add 1 2.5}}`;

        expect(runPrettier(text)).toBe(expected);
    });

    it('should handle undefined and null literals', () => {
        const text = `{{helper undefined null}}`;
        const expected = `{{helper undefined null}}`;

        expect(runPrettier(text)).toBe(expected);
    });

    it('should correctly format a real document', () => {
        const text = '---\n' +
            'products:\n' +
            '    new:\n' +
            '        limit: {{theme_settings.homepage_new_products_count}}\n' +
            '    featured:\n' +
            '        limit: {{theme_settings.homepage_featured_products_count}}\n' +
            '    top_sellers:\n' +
            '        limit: {{theme_settings.homepage_top_products_count}}\n' +
            'carousel: {{theme_settings.homepage_show_carousel}}\n' +
            'blog:\n' +
            '    recent_posts:\n' +
            '        limit: {{theme_settings.homepage_blog_posts_count}}\n' +
            '---\n' +
            '{{#partial "hero"}}\n' +
            '    {{{region name="home_below_menu"}}}\n' +
            '    {{#and carousel carousel.slides.length}}\n' +
            '        {{> components/carousel arrows=theme_settings.homepage_show_carousel_arrows play_pause_button=theme_settings.homepage_show_carousel_play_pause_button}}\n' +
            '    {{/and}}\n' +
            '    {{{region name="home_below_carousel"}}}\n' +
            '{{/partial}}\n' +
            '\n' +
            '{{#partial "page"}}\n' +
            '    {{#each shipping_messages}}\n' +
            '        {{> components/common/alert/alert-info message}}\n' +
            '    {{/each}}\n' +
            '\n' +
            '<div class="main full">\n' +
            '    {{#if products.featured}}\n' +
            '        {{> components/products/featured products=products.featured columns=theme_settings.homepage_featured_products_column_count}}\n' +
            '    {{/if}}\n' +
            '    {{{region name="home_below_featured_products"}}}\n' +
            '\n' +
            '    {{#if products.top_sellers}}\n' +
            '        {{> components/products/top products=products.top_sellers columns=theme_settings.homepage_top_products_column_count}}\n' +
            '    {{/if}}\n' +
            '    {{{region name="home_below_top_products"}}}\n' +
            '\n' +
            '    {{#if products.new}}\n' +
            '        {{> components/products/new products=products.new columns=theme_settings.homepage_new_products_column_count}}\n' +
            '    {{/if}}\n' +
            '    {{{region name="home_below_new_products"}}}\n' +
            '</div>\n' +
            '{{/partial}}\n' +
            '{{> layout/base}}\n';

        const expected = '---\n' +
            'products:\n' +
            '    new:\n' +
            '        limit: {{theme_settings.homepage_new_products_count}}\n' +
            '    featured:\n' +
            '        limit: {{theme_settings.homepage_featured_products_count}}\n' +
            '    top_sellers:\n' +
            '        limit: {{theme_settings.homepage_top_products_count}}\n' +
            'carousel: {{theme_settings.homepage_show_carousel}}\n' +
            'blog:\n' +
            '    recent_posts:\n' +
            '        limit: {{theme_settings.homepage_blog_posts_count}}\n' +
            '---\n' +
            '{{#partial "hero"}}\n' +
            '    {{{region name="home_below_menu"}}}\n' +
            '    {{#and carousel carousel.slides.length}}\n' +
            '        {{> components/carousel\n' +
            '            arrows=theme_settings.homepage_show_carousel_arrows\n' +
            '            play_pause_button=theme_settings.homepage_show_carousel_play_pause_button}}\n' +
            '    {{/and}}\n' +
            '    {{{region name="home_below_carousel"}}}\n' +
            '{{/partial}}\n' +
            '\n' +
            '{{#partial "page"}}\n' +
            '    {{#each shipping_messages}}\n' +
            '        {{> components/common/alert/alert-info message}}\n' +
            '    {{/each}}\n' +
            '\n' +
            '    <div class="main full">\n' +
            '    {{#if products.featured}}\n' +
            '        {{> components/products/featured\n' +
            '            products=products.featured\n' +
            '            columns=theme_settings.homepage_featured_products_column_count}}\n' +
            '    {{/if}}\n' +
            '    {{{region name="home_below_featured_products"}}}\n' +
            '\n' +
            '    {{#if products.top_sellers}}\n' +
            '        {{> components/products/top\n' +
            '            products=products.top_sellers\n' +
            '            columns=theme_settings.homepage_top_products_column_count}}\n' +
            '    {{/if}}\n' +
            '    {{{region name="home_below_top_products"}}}\n' +
            '\n' +
            '    {{#if products.new}}\n' +
            '        {{> components/products/new\n' +
            '            products=products.new\n' +
            '            columns=theme_settings.homepage_new_products_column_count}}\n' +
            '    {{/if}}\n' +
            '    {{{region name="home_below_new_products"}}}\n' +
            '    </div>\n' +
            '{{/partial}}\n' +
            '{{> layout/base}}';

        expect(runPrettier(text)).toBe(expected);
    });

    it('should remove indentation on preprocess', () => {
        const text = `\t{{#if true}}\n\t\t{{#if true}}\n<div>\n\t\t{{> 'test'}}\n</div>\n{{/if}}\n{{/if}}`;
        const expected = '{{#if true}}\n' +
            '{{#if true}}\n' +
            '<div>\n' +
            '{{> \'test\'}}\n' +
            '</div>\n' +
            '{{/if}}\n' +
            '{{/if}}';

        expect(runPreprocess(text)).toBe(expected);
    });
});
