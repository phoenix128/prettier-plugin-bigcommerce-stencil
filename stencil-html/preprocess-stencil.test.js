import { expect } from 'chai';
import preprocessStencil from "./preprocess-stencil.js";

describe('preprocessStencil', () => {
    it('should correctly process nested blocks', () => {
        const text = `{{#if true}}\n{{#if true}}\n<div>\n{{test}}\n</div>\n{{/if}}\n{{/if}}`;
        const expected = '<hbs:block:if _0="true">\n' +
          '<hbs:block:if _0="true">\n' +
          '<div>\n' +
          '<hbs:mustache _0="test" />\n' +
          '</div>\n' +
          '</hbs:block:if>\n' +
          '</hbs:block:if>';

        const result = preprocessStencil(text);
        expect(result).to.equal(expected);

    });

    it('should process a stencil document', () => {
        const text = '{{#partial "page"}}\n' +
          '\n' +
          '{{> components/common/breadcrumbs breadcrumbs=breadcrumbs}}\n' +
          '\n' +
          '<section class="page">\n' +
          '    {{#unless theme_settings.hide_contact_us_page_heading }}\n' +
          '        <h1 class="page-heading">{{page.title}}</h1>\n' +
          '    {{/unless}}\n' +
          '\n' +
          '    {{#if page.sub_pages}}\n' +
          '        <nav class="navBar navBar--sub">\n' +
          '            <ul class="navBar-section account-navigation">\n' +
          '                {{#each page.sub_pages}}\n' +
          '                    <li class="navBar-item"><a class="navBar-action" href="{{url}}">{{title}}</a></li>\n' +
          '                {{/each}}\n' +
          '            </ul>\n' +
          '        </nav>\n' +
          '    {{/if}}\n' +
          '\n' +
          '    <div id="contact-us-page" class="page-content page-content--centered">\n' +
          '        {{#if forms.contact.success}}\n' +
          '            <div id="contact-us-success">{{{lang \'forms.contact_us.successful\' shopPath=urls.home}}}</div>\n' +
          '        {{else}}\n' +
          '            <p>{{{page.content}}}</p>\n' +
          '            {{> components/page/contact-us-form}}\n' +
          '        {{/if}}\n' +
          '\n' +
          '    </div>\n' +
          '\n' +
          '</section>\n' +
          '\n' +
          '{{/partial}}\n' +
          '\n' +
          '{{> layout/base}}\n';

        const result = preprocessStencil(text);
        expect(result).to.equal('<hbs:block:partial __0="page">\n' +
          '\n' +
          '<hbs:partial _0="components/common/breadcrumbs" _breadcrumbs="breadcrumbs" />\n' +
          '\n' +
          '<section class="page">\n' +
          '    <hbs:block:unless _0="theme_settings.hide_contact_us_page_heading">\n' +
          '        <h1 class="page-heading"><hbs:mustache _0="page.title" /></h1>\n' +
          '    </hbs:block:unless>\n' +
          '\n' +
          '    <hbs:block:if _0="page.sub_pages">\n' +
          '        <nav class="navBar navBar--sub">\n' +
          '            <ul class="navBar-section account-navigation">\n' +
          '                <hbs:block:each _0="page.sub_pages">\n' +
          '                    <li class="navBar-item"><a class="navBar-action" href="{{url}}"><hbs:mustache _0="title" /></a></li>\n' +
          '                </hbs:block:each>\n' +
          '            </ul>\n' +
          '        </nav>\n' +
          '    </hbs:block:if>\n' +
          '\n' +
          '    <div id="contact-us-page" class="page-content page-content--centered">\n' +
          '        <hbs:block:if _0="forms.contact.success">\n' +
          '            <div id="contact-us-success"><hbs:raw _0="lang" __1="forms.contact_us.successful" _shopPath="urls.home" /></div>\n' +
          '        <hbs:else>\n' +
          '            <p><hbs:raw _0="page.content" /></p>\n' +
          '            <hbs:partial _0="components/page/contact-us-form" />\n' +
          '        </hbs:else></hbs:block:if>\n' +
          '\n' +
          '    </div>\n' +
          '\n' +
          '</section>\n' +
          '\n' +
          '</hbs:block:partial>\n' +
          '\n' +
          '<hbs:partial _0="layout/base" />\n');
    });

    it("should process a stencil layout", () => {
        const text = '<!DOCTYPE html>\n' +
          '<html lang="{{ locale_name }}">\n' +
          '<head>\n' +
          '    <title>{{ head.title }}</title>\n' +
          '    {{{ head.meta_tags }}}\n' +
          '    {{{ head.config }}}\n' +
          '\n' +
          '    <link href="{{ head.favicon }}" rel="shortcut icon">\n' +
          '    {{#block "head"}}{{/block}}\n' +
          '</head>\n' +
          '<body>\n' +
          '    {{#block "page"}}{{/block}}\n' +
          '</body>\n' +
          '</html>\n';

        const result = preprocessStencil(text);
        expect(result).to.equal('<!DOCTYPE html>\n' +
          '<html lang="{{ locale_name }}">\n' +
          '<head>\n' +
          '    <title><hbs:mustache _0="head.title" /></title>\n' +
          '    <hbs:raw _0="head.meta_tags" />\n' +
          '    <hbs:raw _0="head.config" />\n' +
          '\n' +
          '    <link href="{{ head.favicon }}" rel="shortcut icon">\n' +
          '    <hbs:block:block __0="head"></hbs:block:block>\n' +
          '</head>\n' +
          '<body>\n' +
          '    <hbs:block:block __0="page"></hbs:block:block>\n' +
          '</body>\n' +
          '</html>\n');
    });

    it ('should process complex documents', () => {
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
          '</html>\n';

        const result = preprocessStencil(text);

        expect(result).to.equal('<!DOCTYPE html>\n' +
          '<html class="no-js" lang="{{ locale_name }}">\n' +
          '    <head>\n' +
          '        <title><hbs:mustache _0="head.title" /></title>\n' +
          '        <hbs:raw _0="resourceHints" />\n' +
          '        <hbs:raw _0="head.meta_tags" />\n' +
          '        <hbs:raw _0="head.config" />\n' +
          '        <hbs:block:block __0="head"> </hbs:block:block>\n' +
          '\n' +
          '        <link href="{{ head.favicon }}" rel="shortcut icon">\n' +
          '        <meta name="viewport" content="width=device-width, initial-scale=1">\n' +
          '\n' +
          '        <script>\n' +
          '            {{!-- Change document class from no-js to js so we can detect this in css --}}\n' +
          '            document.documentElement.className = document.documentElement.className.replace(\'no-js\', \'js\');\n' +
          '        </script>\n' +
          '\n' +
          '        <hbs:partial _0="components/common/polyfill-script" />\n' +
          '        <script>window.consentManagerTranslations = `{{{langJson \'consent_manager\'}}}`;</script>\n' +
          '\n' +
          '        <hbs:comment>Load Lazysizes script ASAP so images will appear</hbs:comment>\n' +
          '        <script>\n' +
          '            {{!-- Only load visible elements until the onload event fires, after which preload nearby elements. --}}\n' +
          '            window.lazySizesConfig = window.lazySizesConfig || {};\n' +
          '            window.lazySizesConfig.loadMode = 1;\n' +
          '        </script>\n' +
          '        <script async src="{{cdn \'assets/dist/theme-bundle.head_async.js\' resourceHint=\'preload\' as=\'script\'}}"></script>\n' +
          '        \n' +
          '        <hbs:mustache _0="getFontsCollection" __font-display="block" />\n' +
          '        \n' +
          '        <script async src="{{cdn \'assets/dist/theme-bundle.font.js\' resourceHint=\'preload\' as=\'script\'}}"></script>\n' +
          '\n' +
          '        <hbs:raw _0="stylesheet" __1="/assets/css/theme.css" />\n' +
          '\n' +
          '        <hbs:raw _0="head.scripts" />\n' +
          '\n' +
          '        <hbs:strip _0="inject" __1="zoomSize" _2="theme_settings.zoom_size" />\n' +
          '        <hbs:strip _0="inject" __1="productSize" _2="theme_settings.product_size" />\n' +
          '        <hbs:strip _0="inject" __1="genericError" _2="(lang" __3="common.generic_error" _4=")" />\n' +
          '        <hbs:strip _0="inject" __1="urls" _2="urls" />\n' +
          '        <hbs:strip _0="inject" __1="secureBaseUrl" _2="settings.secure_base_url" />\n' +
          '        <hbs:strip _0="inject" __1="cartId" _2="cart_id" />\n' +
          '        <hbs:strip _0="inject" __1="template" _2="template" />\n' +
          '        <hbs:strip _0="inject" __1="validationDictionaryJSON" _2="(langJson" __3="validation_messages" _4=")" />\n' +
          '        <hbs:strip _0="inject" __1="validationFallbackDictionaryJSON" _2="(langJson" __3="validation_fallback_messages" _4=")" />\n' +
          '        <hbs:strip _0="inject" __1="validationDefaultDictionaryJSON" _2="(langJson" __3="validation_default_messages" _4=")" />\n' +
          '        <hbs:strip _0="inject" __1="carouselArrowAndDotAriaLabel" _2="(lang" __3="carousel.arrow_and_dot_aria_label" _4=")" />\n' +
          '        <hbs:strip _0="inject" __1="carouselActiveDotAriaLabel" _2="(lang" __3="carousel.active_dot_aria_label" _4=")" />\n' +
          '        <hbs:strip _0="inject" __1="carouselContentAnnounceMessage" _2="(lang" __3="carousel.content_announce_message" _4=")" />\n' +
          '    </head>\n' +
          '    <body>\n' +
          '        <svg data-src="{{cdn \'img/icon-sprite.svg\'}}" class="icons-svg-sprite"></svg>\n' +
          '\n' +
          '        <hbs:partial _0="components/common/header" />\n' +
          '        <hbs:partial _0="components/common/body" />\n' +
          '        <hbs:partial _0="components/common/footer" />\n' +
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
          '        <hbs:raw _0="footer.scripts" />\n' +
          '    </body>\n' +
          '</html>\n');
    });
});
