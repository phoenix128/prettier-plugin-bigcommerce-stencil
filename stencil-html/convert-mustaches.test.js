import { expect } from 'chai';
import convertMustaches from './convert-mustaches.js';

describe('convertMustaches', () => {
  it ('should escape params and hashes', () => {
    const text = '{{ test/test foo=\'b"a"r\' baz="qux" }}';
    const result = convertMustaches(text);
    expect(result).to.equal('<hbs:mustache _0="test/test" __foo="b&quot;a&quot;r" __baz="qux" />');
  })

  it('should convert nested if statements', () => {
    const text = '{{#if condition}}{{#if nested}}true{{/if}}{{/if}}';
    const result = convertMustaches(text);
    expect(result).to.equal('<hbs:block:if _0="condition"><hbs:block:if _0="nested">true</hbs:block:if></hbs:block:if>');
  });

  it("should convert two non nested blocks", () => {
    const text = "{{#if condition}}true{{/if}}{{#if nested}}true{{/if}}";
    const result = convertMustaches(text);
    expect(result).to.equal('<hbs:block:if _0="condition">true</hbs:block:if><hbs:block:if _0="nested">true</hbs:block:if>');
  });

  it('should handle empty blocks', () => {
    const text = '{{#if condition}}{{/if}}';
    const result = convertMustaches(text);
    expect(result).to.equal('<hbs:block:if _0="condition"></hbs:block:if>');
  });

  it('should convert if-else statements', () => {
    const text = '{{#if condition}}true{{else}}false{{/if}}';
    const result = convertMustaches(text);
    expect(result).to.equal('<hbs:block:if _0="condition">true<hbs:else>false</hbs:else></hbs:block:if>');
  });

  it('should convert if-else-if statements with newlines', () => {
    const text = '{{#if condition}}\ntrue\n{{else}}\nfalse\n{{/if}}';
    const result = convertMustaches(text);
    expect(result).to.equal('<hbs:block:if _0="condition">\n' +
      'true\n' +
      '<hbs:else>\n' +
      'false\n' +
      '</hbs:else></hbs:block:if>');
  });

  it('should handle nested block helpers', () => {
    const text = '{{#if condition}}{{#each items}}item{{/each}}{{/if}}';
    const result = convertMustaches(text);
    expect(result).to.equal('<hbs:block:if _0="condition">' +
      '<hbs:block:each _0="items">item</hbs:block:each>' +
      '</hbs:block:if>'
    );
  });

  it('should handle multiple block helpers in complex structures', () => {
    const text = '{{#partial "page"}}\n' +
      '\n' +
      '{{> components/common/breadcrumbs breadcrumbs=breadcrumbs}}\n' +
      '\n' +
      '<section class="page">\n' +
      '    {{#unless theme_settings.hide_contact_us_page_heading }}\n' +
      '        <h1 class="page-heading">{{page.title}}</h1>\n' +
      '    {{/unless}}\n' +
      '</section>\n' +
      '\n' +
      '{{/partial}}\n';

    const result = convertMustaches(text);
    expect(result).to.equal('<hbs:block:partial __0="page">\n' +
      '\n' +
      '<hbs:partial _0="components/common/breadcrumbs" _breadcrumbs="breadcrumbs" />\n' +
      '\n' +
      '<section class="page">\n' +
      '    <hbs:block:unless _0="theme_settings.hide_contact_us_page_heading">\n' +
      '        <h1 class="page-heading"><hbs:mustache _0="page.title" /></h1>\n' +
      '    </hbs:block:unless>\n' +
      '</section>\n' +
      '\n' +
      '</hbs:block:partial>\n');
  });

  it("should convert a simple if statement", () => {
    const text = "{{#if condition}}true{{/if}}";
    const result = convertMustaches(text);
    expect(result).to.equal('<hbs:block:if _0="condition">true</hbs:block:if>');
  });

  it('should convert block helpers', () => {
    const text = '{{#each items}}item{{/each}}';
    const result = convertMustaches(text);
    expect(result).to.equal('<hbs:block:each _0="items">item</hbs:block:each>');
  });

  it ('should convert a real life block helper', () => {
    const text = '{{#unless theme_settings.hide_contact_us_page_heading }}\n' +
      '    <h1 class="page-heading">{{page.title}}</h1>\n' +
      '{{/unless}}\n';

    const result = convertMustaches(text);
    expect(result).to.equal('<hbs:block:unless _0="theme_settings.hide_contact_us_page_heading">\n' +
      '    <h1 class="page-heading"><hbs:mustache _0="page.title" /></h1>\n' +
      '</hbs:block:unless>\n');
  });

  it('should convert partials', () => {
    const text = '{{> partialName param="value"}}';
    const result = convertMustaches(text);
    expect(result).to.equal('<hbs:partial _0="partialName" __param="value" />');
  });

  it('should convert strip whitespace', () => {
    const text = '{{~ stripMe }}';
    const result = convertMustaches(text);
    expect(result).to.equal('<hbs:strip _0="stripMe" />');
  });

  it('should convert comments', () => {
    const text = '{{!-- This is a comment --}}';
    const result = convertMustaches(text);
    expect(result).to.equal('<hbs:comment>This is a comment</hbs:comment>');
  });

  it('should convert short comments', () => {
    const text = '{{! This is a short comment }}';
    const result = convertMustaches(text);
    expect(result).to.equal('<hbs:comment>This is a short comment</hbs:comment>');
  });

  it("should convert a simple raw mustaches", () => {
    const text = '{{{ rawMustache }}}';
    const result = convertMustaches(text);
    expect(result).to.equal('<hbs:raw _0="rawMustache" />');
  });

  it('should convert raw mustaches', () => {
    const text = '{{{ rawMustache param="value" }}}';
    const result = convertMustaches(text);
    expect(result).to.equal('<hbs:raw _0="rawMustache" __param="value" />');
  });

  it('should convert mustaches', () => {
    const text = '{{ mustache param="value" }}';
    const result = convertMustaches(text);
    expect(result).to.equal('<hbs:mustache _0="mustache" __param="value" />');
  });
});
