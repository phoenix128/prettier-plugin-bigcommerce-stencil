import { expect } from 'chai';
import prettier from "prettier"

const options = {
    tabWidth: 4,
    singleQuote: false,
    useTabs: false,
    printWidth: 80,
    preserveNewlines: false
}

const runPrettier = async (text) => {
    return prettier.format(text, {
        parser: 'stencil-html',
        plugins: ['./index.js'],
        ...options
    })
}

describe('prettier-plugin-bigcommerce-stencil', () => {
    it('should handle partials', async () => {
        const text = `{{> test}}`;

        const result = await runPrettier(text);
        expect(result).to.equal(text);
    });

    it('should indent correctly', async () => {
        const text = `{{#if true}}\n{{#if true}}\n<div>\n{{> 'test'}}\n</div>\n{{/if}}\n{{/if}}`;
        const expected = '{{#if true}}\n' +
            '    {{#if true}}\n' +
            '        <div>\n' +
            '            {{> "test"}}\n' +
            '        </div>\n' +
            '    {{/if}}\n' +
            '{{/if}}';

        const result = await runPrettier(text);
        expect(result).to.equal(expected);
    });

    it('should preserve inline blocks', async () => {
        const text = `{{#if true}}{{add 1 2}}{{/if}}`;

        const result = await runPrettier(text);
        expect(result).to.equal(text);
    });

    it ('should add a newline at the end of the file', async () => {
        const text = `{{#if true}}{{add 1 2}}{{/if}}`;
        const expected = `{{#if true}}{{add 1 2}}{{/if}}`;

        const result = await runPrettier(text);
        expect(result).to.equal(expected);
    });

    it('should fix wrong indent', async () => {
        const text = `\t{{#if true}}\n\t\t{{#if true}}\n<div>\n\t\t{{> 'test'}}\n</div>\n{{/if}}\n{{/if}}`;
        const expected = '{{#if true}}\n' +
            '    {{#if true}}\n' +
            '        <div>\n' +
            '            {{> "test"}}\n' +
            '        </div>\n' +
            '    {{/if}}\n' +
            '{{/if}}';

        const result = await runPrettier(text);
        expect(result).to.equal(expected);
    });

    it('should handle comments', async () => {
        const text = `{{! This comment will not show up in the output}}`;

        const result = await runPrettier(text);
        expect(result).to.equal(text);
    });

    it('should handle comments with mustaches', async () => {
        const text = `{{!-- This comment may contain mustaches like }} --}}`;

        const result = await runPrettier(text);
        expect(result).to.equal(text);
    });

    it('should handle and format partials', async () => {
        const text = `{{>   "test"}}`;
        const expected = `{{> "test"}}`;

        const result = await runPrettier(text);
        expect(result).to.equal(expected);
    });

    it("should convert quotes to double quotes", async () => {
        const text = `{{> 'test'}}`;
        const expected = `{{> "test"}}`;

        const result = await runPrettier(text);
        expect(result).to.equal(expected);
    });

    it('should handle simple mustaches with path', async () => {
        const text = `{{test}}`;
        const expected = `{{test}}`;

        const result = await runPrettier(text);
        expect(result).to.equal(expected);
    });

    it('should handle simple mustaches with string', async () => {
        const text = `{{"test"}}`;
        const expected = `{{"test"}}`;

        const result = await runPrettier(text);
        expect(result).to.equal(expected);
    });

    it('should handle and format hash', async () => {
        const text = `{{test  key=value}}`;
        const expected = `{{test key=value}}`;

        const result = await runPrettier(text);
        expect(result).to.equal(expected);
    });

    it('should handle boolean literals', async () => {
        const text = `{{test true}}`;
        const expected = `{{test true}}`;

        const result = await runPrettier(text);
        expect(result).to.equal(expected);
    });

    it('should handle parameters', async () => {
        const text = `{{test "somevalue"}}`;
        const expected = `{{test "somevalue"}}`;

        const result = await runPrettier(text);
        expect(result).to.equal(expected);
    });

    it('should handle long hashes', async () => {
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
            '    key10=value10\n' +
            '}}';

        const result = await runPrettier(text);
        expect(result).to.equal(expected);
    });

    it('should inline wrongly indented short statements', async () => {
        const text = '{{test key1=value1 key2=value2\n' +
            'key3=value3}}';
        const expected = '{{test key1=value1 key2=value2 key3=value3}}';

        const result = await runPrettier(text);
        expect(result).to.equal(expected);
    });

    it('should collapse not necessary multiline hashes', async () => {
        const text = `{{test\nkey1=value1\nkey2=value2\nkey3=value3}}`;
        const expected = '{{test key1=value1 key2=value2 key3=value3}}';

        const result = await runPrettier(text);
        expect(result).to.equal(expected);
    });

    it('should handle escaped quotes in hash', async () => {
        const text = `{{test key="some\\"value"}}`;
        const expected = `{{test key='some"value'}}`;

        const result = await runPrettier(text);
        expect(result).to.equal(expected);
    });

    it("should remove extra spaces", async () => {
        const text = `{{test  "somevalue"  key=value}}\n`;
        const expected = `{{test "somevalue" key=value}}`;

        const result = await runPrettier(text);
        expect(result).to.equal(expected);
    });

    it("should handle triple mustaches", async () => {
        const text = `{{{test "somevalue"}}}`;
        const expected = `{{{test "somevalue"}}}`;

        const result = await runPrettier(text);
        expect(result).to.equal(expected);
    });

    it("should collapse empty block params", async () => {
        const text = `{{#if true key=value}}\n{{/if}}`;
        const expected = `{{#if true key=value}}{{/if}}`;

        const result = await runPrettier(text);
        expect(result).to.equal(expected);
    });

    it("should collapse triple newlines in a double newline", async () => {
        const text = `{{someval}}\n\n\n{{someval}}`;
        const expected = `{{someval}}\n\n{{someval}}`;

        const result = await runPrettier(text);
        expect(result).to.equal(expected);
    });

    it('should preserve header indentation', async () => {
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

        const result = await runPrettier(text);
        expect(result).to.equal(text);
    });

    it('should preserve inline syntax for lines not exceeding the length', async () => {
        const text = `{{#if condition}}{{#each items}}{{this}}{{/each}}{{/if}}`;

        const result = await runPrettier(text);
        expect(result).to.equal(text);
    });

    it('should handle subexpressions', async () => {
        const text = `{{helper (subhelper param1 param2)}}`;

        const result = await runPrettier(text);
        expect(result).to.equal(text);
    });

    it('should handle number literals', async () => {
        const text = `{{add 1 2.5}}`;
        const expected = `{{add 1 2.5}}`;

        const result = await runPrettier(text);
        expect(result).to.equal(expected);
    });

    it('should handle undefined and null literals', async () => {
        const text = `{{helper undefined null}}`;
        const expected = `{{helper undefined null}}`;

        const result = await runPrettier(text);
        expect(result).to.equal(expected);
    });

    it('should correctly format a real document', async () => {
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

        const result = await runPrettier(text);
        expect(result).to.equal(expected);
    });

    it('should preserve inline syntax inside an attribute', async () => {
        const text = '<a class="compareTable-removeProduct" data-comparison-remove href="{{#if remove_url}}{{remove_url}}{{else}}#{{/if}}">\n' +
            '    <svg class="icon">\n' +
            '        <use href="#icon-close"></use>\n' +
            '    </svg>\n' +
            '</a>';

        const expected = '<a\n' +
            '  class="compareTable-removeProduct"\n' +
            '  data-comparison-remove\n' +
            '  href="{{#if remove_url}}{{remove_url}}{{else}}#{{/if}}"\n' +
            '>\n' +
            '  <svg class="icon">\n' +
            '    <use href="#icon-close"></use>\n' +
            '  </svg>\n' +
            '</a>\n'

        const result = await runPrettier(text);
        expect(result).to.equal(expected);
    });
});
