import { expect } from "chai";
import sanitizeDom from "./sanitize-dom.js";

describe('placeholders', () => {
  it('should replace script tags with placeholders', () => {
    const html = '<script>alert("hello")</script>';
    const { dom, placeholders } = sanitizeDom(html);

    expect(dom).to.equal('<script>___PLACEHOLDER_0__</script>');
    expect(placeholders).to.deep.equal(['alert("hello")']);
  });

  it('should preserve text nodes', () => {
    const html = '<div>foo</div>';
    const { dom, placeholders } = sanitizeDom(html);

    expect(dom).to.equal('<div>foo</div>');
    expect(placeholders).to.deep.equal([]);
  });

  it ('should replace attributes with placeholders if including mustaches', () => {
    const html = '<div foo="bar" baz="{{test}}"/>';
    const { dom, placeholders } = sanitizeDom(html);

    expect(dom).to.equal('<div foo="bar" baz="___PLACEHOLDER_0__"/>');
    expect(placeholders).to.deep.equal(['{{test}}']);
  });

  it ('should replace mustaches inside tags', () => {
    const html = '<div {{#if something}}id="pippo"{{/if}}>hello</div>';
    const { dom, placeholders } = sanitizeDom(html);

    expect(dom).to.equal('<div ___PLACEHOLDER_0__>hello</div>');
    expect(placeholders).to.deep.equal(["{{#if something}}id=\"pippo\"{{/if}}"]);
  });
});
