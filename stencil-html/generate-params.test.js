import generateParams from "./generate-params.js";
import { expect } from 'chai';

describe('generateParams', () => {
  it('should generate simple params', () => {
    const params = 'foo=bar baz="qux"';
    const result = generateParams(params);
    expect(result).to.equal('_foo="bar" __baz="qux"');
  });

  it('should generate escaped params', () => {
    const params = 'foo=\'b"a"r\'';
    const result = generateParams(params);
    expect(result).to.equal('__foo="b&quot;a&quot;r"');
  });

  it('should generate params with spaces', () => {
    const params = 'foo="b a r"';
    const result = generateParams(params);
    expect(result).to.equal('__foo="b a r"');
  });

  it('should generate params with quotes', () => {
    const params = 'foo="b\'a\'r"';
    const result = generateParams(params);
    expect(result).to.equal('__foo="b\'a\'r"');
  });

  it('should generate params with equals', () => {
    const params = 'foo="b=a=r"';
    const result = generateParams(params);
    expect(result).to.equal('__foo="b=a=r"');
  });

  it('should parse params with no values embedding in quotes', () => {
    const params = 'foo bar baz';
    const result = generateParams(params);
    expect(result).to.equal('_0="foo" _1="bar" _2="baz"');
  });

  it('should parse params with special chars', () => {
    const params = 'foo/foo bar.bar';
    const result = generateParams(params);
    expect(result).to.equal('_0="foo/foo" _1="bar.bar"');
  });

  it('should parse params with quotes', () => {
    const params = '"foo" \'bar\'';
    const result = generateParams(params);
    expect(result).to.equal('__0="foo" __1="bar"');
  });
});
