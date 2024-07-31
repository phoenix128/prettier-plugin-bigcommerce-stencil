import { expect } from 'chai';
import prettier from "prettier"

const runPrettier = async (text) => {
    return await prettier.format(text, {
        parser: 'stencil-html',
        plugins: ['./index.js'],
    })
}

describe('prettier-plugin-bigcommerce-stencil', () => {
    it('should handle partials', async () => {
        const text = `{{> test}}\n`;

        const result = await runPrettier(text);
        expect(result).to.equal(text);
    });

    it('should handle partials with hash', async () => {
        const text = `{{> test key="value"}}\n`;

        const result = await runPrettier(text);
        expect(result).to.equal(text);
    });

    it('should indent correctly', async () => {
        const text = `{{#if true}}\n{{#if true}}\n<div>\n{{test}}\n</div>\n{{/if}}\n{{/if}}`;
        const expected = '{{#if true}}\n' +
            '    {{#if true}}\n' +
            '        <div>\n' +
            '            {{test}}\n' +
            '        </div>\n' +
            '    {{/if}}\n' +
            '{{/if}}\n';

        const result = await runPrettier(text);
        expect(result).to.equal(expected);
    });

    it ('should correctly handle indentation and newlines inside html tags', async () => {
        const text = '{{#partial "page"}}<div>\n' +
            '    <h1>\n' +
            '        {{#if true}}\n' +
            '            {{add a="1" b="2"}}\n' +
            '        {{/if}}\n' +
            '    </h1>\n' +
            '</div>{{/partial}}\n';

        const result = await runPrettier(text);
        expect(result).to.equal(text);
    });

    it('should correctly count columns for softwrap', async () => {
        const text = '{{test1 a=1}}\n'+
            '{{test2 a=1}}\n'+
            '{{test3 a=1}}\n'+
            '{{test4 a=1}}\n'+
            '{{test5 a=1}}\n'+
            '{{test6 a=1}}\n'+
            '{{test7 a=1}}\n'+
            '{{test8 a=1}}\n'+
            '{{test9 a=1}}\n'+
            '{{test10 a=1}}\n'+
            '{{test11 a=1}}\n'+
            '{{test12 a=1}}\n'+
            '{{test13 a=1}}\n'+
            '{{test14 a=1}}\n'+
            '{{test15 a=1}}\n';

        const result = await runPrettier(text);
        expect(result).to.equal(text);
    });

    it('should correctly count columns for softwrap inside a wrapping html', async () => {
        const text =
            '<div>\n'+
            '    {{test1 a=1}}\n'+
            '    {{test2 a=1}}\n'+
            '    {{test3 a=1}}\n'+
            '    {{test4 a=1}}\n'+
            '    {{test5 a=1}}\n'+
            '    {{test6 a=1}}\n'+
            '    {{test7 a=1}}\n'+
            '    {{test8 a=1}}\n'+
            '    {{test9 a=1}}\n'+
            '    {{test10 a=1}}\n'+
            '    {{test11 a=1}}\n'+
            '    {{test12 a=1}}\n'+
            '    {{test13 a=1}}\n'+
            '    {{test14 a=1}}\n'+
            '    {{test15 a=1}}\n'+
            '</div>\n';

        const result = await runPrettier(text);
        expect(result).to.equal(text);
    });

    it('should preserve inline blocks', async () => {
        const text = `{{#if true}}{{add 1 2}}{{/if}}\n`;

        const result = await runPrettier(text);
        expect(result).to.equal(text);
    });

    it ('should add a newline at the end of the file', async () => {
        const text = `{{#if true}}{{add 1 2}}{{/if}}`;
        const expected = `{{#if true}}{{add 1 2}}{{/if}}\n`;

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
            '{{/if}}\n';

        const result = await runPrettier(text);
        expect(result).to.equal(expected);
    });

    it('should handle comments with mustaches', async () => {
        const text = `{{!-- This comment may contain mustaches like }} --}}\n`;

        const result = await runPrettier(text);
        expect(result).to.equal(text);
    });

    it('should handle and format partials', async () => {
        const text = `{{>   "test"}}`;
        const expected = `{{> "test"}}\n`;

        const result = await runPrettier(text);
        expect(result).to.equal(expected);
    });

    it("should convert quotes to double quotes", async () => {
        const text = `{{> 'test'}}`;
        const expected = `{{> "test"}}\n`;

        const result = await runPrettier(text);
        expect(result).to.equal(expected);
    });

    it('should handle simple mustaches with path', async () => {
        const text = `{{test}}`;
        const expected = `{{test}}\n`;

        const result = await runPrettier(text);
        expect(result).to.equal(expected);
    });

    it('should handle simple mustaches with string', async () => {
        const text = `{{"test"}}`;
        const expected = `{{"test"}}\n`;

        const result = await runPrettier(text);
        expect(result).to.equal(expected);
    });

    it('should handle and format hash', async () => {
        const text = `{{test  key=value}}`;
        const expected = `{{test key=value}}\n`;

        const result = await runPrettier(text);
        expect(result).to.equal(expected);
    });

    it('should handle boolean literals', async () => {
        const text = `{{test true}}`;
        const expected = `{{test true}}\n`;

        const result = await runPrettier(text);
        expect(result).to.equal(expected);
    });

    it('should handle parameters', async () => {
        const text = `{{test "somevalue"}}`;
        const expected = `{{test "somevalue"}}\n`;

        const result = await runPrettier(text);
        expect(result).to.equal(expected);
    });

    it('should handle mustache with opening strip', async () => {
        const text = `{{~test}}`;
        const expected = `{{~test}}\n`;

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
          '}}\n';

        const result = await runPrettier(text);
        expect(result).to.equal(expected);
    });

    it('should inline wrongly indented short statements', async () => {
        const text = '{{test key1=value1 key2=value2\n' +
            'key3=value3}}';
        const expected = '{{test\n' +
            '    key1=value1\n' +
            '    key2=value2\n' +
            '    key3=value3}}\n';

        const result = await runPrettier(text);
        expect(result).to.equal(expected);
    });

    it('should collapse not necessary multiline hashes', async () => {
        const text = `{{test\nkey1=value1\nkey2=value2\nkey3=value3}}`;
        const expected = '{{test key1=value1 key2=value2 key3=value3}}\n';

        const result = await runPrettier(text);
        expect(result).to.equal(expected);
    });

    it('should handle escaped quotes in hash', async () => {
        const text = `{{test key="some\\"value"}}`;
        const expected = `{{test key='some"value'}}\n`;

        const result = await runPrettier(text);
        expect(result).to.equal(expected);
    });

    it("should remove extra spaces", async () => {
        const text = `{{test  "somevalue"  key=value}}\n`;
        const expected = `{{test "somevalue" key=value}}\n`;

        const result = await runPrettier(text);
        expect(result).to.equal(expected);
    });

    it("should handle triple mustaches", async () => {
        const text = `{{{test "somevalue"}}}`;
        const expected = `{{{test "somevalue"}}}\n`;

        const result = await runPrettier(text);
        expect(result).to.equal(expected);
    });

    it("should collapse empty block params", async () => {
        const text = `{{#if true key=value}}\n{{/if}}`;
        const expected = `{{#if true key=value}}{{/if}}\n`;

        const result = await runPrettier(text);
        expect(result).to.equal(expected);
    });

    it("should collapse triple newlines in a double newline", async () => {
        const text = `{{someval}}\n\n\n{{someval}}`;
        const expected = `{{someval}}\n\n{{someval}}\n`;

        const result = await runPrettier(text);
        expect(result).to.equal(expected);
    });

    it('should preserve header', async () => {
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
{{/partial}}
`;

        const result = await runPrettier(text);
        expect(result).to.equal(text);
    });

    it('should preserve inline syntax for lines not exceeding the length', async () => {
        const text = `{{#if condition}}{{#each items}}{{this}}{{/each}}{{/if}}\n`;

        const result = await runPrettier(text);
        expect(result).to.equal(text);
    });

    it('should handle subexpressions', async () => {
        const text = `{{helper (subhelper param1 param2)}}\n`;

        const result = await runPrettier(text);
        expect(result).to.equal(text);
    });

    it('should handle number literals', async () => {
        const text = `{{add 1 2.5}}`;
        const expected = `{{add 1 2.5}}\n`;

        const result = await runPrettier(text);
        expect(result).to.equal(expected);
    });

    it('should handle undefined and null literals', async () => {
        const text = `{{helper undefined null}}`;
        const expected = `{{helper undefined null}}\n`;

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

    it('should correctly format a real layout file', async () => {
        const text = '<!DOCTYPE html>\n' +
          '<html class="no-js" lang="{{ locale_name }}">\n' +
          '    <head>\n' +
          '        <title>{{ head.title }}</title>\n' +
          '        {{{ resourceHints }}}\n' +
          '        {{{ head.meta_tags }}}\n' +
          '        {{{ head.config }}}\n' +
          '        {{#block "head"}} {{/block}}\n' +
          '\n' +
          '        <link href="{{ head.favicon }}" rel="shortcut icon">\n' +
          '        <meta name="viewport" content="width=device-width, initial-scale=1">\n' +
          '\n' +
          '        <script>\n' +
          '            {{!-- Change document class from no-js to js so we can detect this in css --}}\n' +
          '            document.documentElement.className = document.documentElement.className.replace(\'no-js\', \'js\');\n' +
          '        </script>\n' +
          '\n' +
          '        {{> components/common/polyfill-script }}\n' +
          '        <script>window.consentManagerTranslations = `{{{langJson \'consent_manager\'}}}`;</script>\n' +
          '\n' +
          '        {{!-- Load Lazysizes script ASAP so images will appear --}}\n' +
          '        <script>\n' +
          '            {{!-- Only load visible elements until the onload event fires, after which preload nearby elements. --}}\n' +
          '            window.lazySizesConfig = window.lazySizesConfig || {};\n' +
          '            window.lazySizesConfig.loadMode = 1;\n' +
          '        </script>\n' +
          '        <script async src="{{cdn \'assets/dist/theme-bundle.head_async.js\' resourceHint=\'preload\' as=\'script\'}}"></script>\n' +
          '        \n' +
          '        {{getFontsCollection font-display=\'block\'}}\n' +
          '        \n' +
          '        <script async src="{{cdn \'assets/dist/theme-bundle.font.js\' resourceHint=\'preload\' as=\'script\'}}"></script>\n' +
          '\n' +
          '        {{{stylesheet \'/assets/css/theme.css\'}}}\n' +
          '\n' +
          '        {{{head.scripts}}}\n' +
          '\n' +
          '        {{~inject \'zoomSize\' theme_settings.zoom_size}}\n' +
          '        {{~inject \'productSize\' theme_settings.product_size}}\n' +
          '        {{~inject \'genericError\' (lang \'common.generic_error\')}}\n' +
          '        {{~inject \'urls\' urls}}\n' +
          '        {{~inject \'secureBaseUrl\' settings.secure_base_url}}\n' +
          '        {{~inject \'cartId\' cart_id}}\n' +
          '        {{~inject \'template\' template}}\n' +
          '        {{~inject \'validationDictionaryJSON\' (langJson \'validation_messages\')}}\n' +
          '        {{~inject \'validationFallbackDictionaryJSON\' (langJson \'validation_fallback_messages\')}}\n' +
          '        {{~inject \'validationDefaultDictionaryJSON\' (langJson \'validation_default_messages\')}}\n' +
          '        {{~inject \'carouselArrowAndDotAriaLabel\' (lang \'carousel.arrow_and_dot_aria_label\')}}\n' +
          '        {{~inject \'carouselActiveDotAriaLabel\' (lang \'carousel.active_dot_aria_label\')}}\n' +
          '        {{~inject \'carouselContentAnnounceMessage\' (lang \'carousel.content_announce_message\')}}\n' +
          '    </head>\n' +
          '    <body>\n' +
          '        <svg data-src="{{cdn \'img/icon-sprite.svg\'}}" class="icons-svg-sprite"></svg>\n' +
          '\n' +
          '        {{> components/common/header }}\n' +
          '        {{> components/common/body }}\n' +
          '        {{> components/common/footer }}\n' +
          '\n' +
          '        <script>window.__webpack_public_path__ = "{{cdn \'assets/dist/\'}}";</script>\n' +
          '        <script>\n' +
          '            {{!-- Exported in app.js --}}\n' +
          '            function onThemeBundleMain() {\n' +
          '                window.stencilBootstrap("{{page_type}}", {{jsContext}}).load();\n' +
          '            }\n' +
          '        </script>\n' +
          '        <script async defer src="{{cdn \'assets/dist/theme-bundle.main.js\' resourceHint=\'preload\' as=\'script\'}}" onload="onThemeBundleMain()"></script>\n' +
          '\n' +
          '        {{{footer.scripts}}}\n' +
          '    </body>\n' +
          '</html>\n'

        const expected = '';

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

    it ('should revert a messy document', async () => {
        const text = '---\n' +
          'products:\n' +
          '  new:\n' +
          '    limit: {{ theme_settings.homepage_new_products_count }}\n' +
          '  featured:\n' +
          '    limit: {{ theme_settings.homepage_featured_products_count }}\n' +
          '  top_sellers:\n' +
          '    limit: {{ theme_settings.homepage_top_products_count }}\n' +
          'carousel: {{ theme_settings.homepage_show_carousel }}\n' +
          'blog:\n' +
          '  recent_posts:\n' +
          '    limit: {{ theme_settings.homepage_blog_posts_count }}\n' +
          '---\n' +
          '\n' +
          '{{#partial "hero"}} {{{region name="home_below_menu"}}} {{#and carousel\n' +
          'carousel.slides.length}} {{> components/carousel\n' +
          'arrows=theme_settings.homepage_show_carousel_arrows\n' +
          'play_pause_button=theme_settings.homepage_show_carousel_play_pause_button}}\n' +
          '{{/and}} {{{region name="home_below_carousel"}}} {{/partial}} {{#partial\n' +
          '"page"}} {{#each shipping_messages}} {{> components/common/alert/alert-info\n' +
          'message}} {{/each}}\n' +
          '\n' +
          '<div class="main full"> \n' +
          '  {{#if products.featured}} {{> components/products/featured\n' +
          '  products=products.featured\n' +
          '  columns=theme_settings.homepage_featured_products_column_count}} {{/if}}\n' +
          '  {{{region name="home_below_featured_products"}}} {{#if products.top_sellers}}\n' +
          '  {{> components/products/top products=products.top_sellers\n' +
          '  columns=theme_settings.homepage_top_products_column_count}} {{/if}} {{{region\n' +
          '  name="home_below_top_products"}}} {{#if products.new}} {{>\n' +
          '  components/products/new products=products.new\n' +
          '  columns=theme_settings.homepage_new_products_column_count}} {{/if}} {{{region\n' +
          '  name="home_below_new_products"}}}\n' +
          '</div>\n' +
          '{{/partial}} {{> layout/base}}\n';

      const result = await runPrettier(text);
      expect(result).to.equal(text);
    })

    it('should not touch <script> tags', async () => {
        const text = '<script>\n' +
            '    console.log("{{message}}");\n' +
            '</script>\n';

        const result = await runPrettier(text);
        expect(result).to.equal(text);
    });
});
