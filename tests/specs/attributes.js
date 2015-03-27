describe("Patching Attributes", function() {
  it("exists on the global object", function() {
    expect(window.htmlPatch).to.be.ok();
  });

  it("adds an attribute", function() {
    var el = createTestNode('Hello World!', { id: 'content' });
    htmlPatch(el, '<?div =id +data-updated>Goodbye World!</div>');

    expect(serializeNode(el)).to.be('<div data-updated="" id="content">Goodbye World!</div>');
  });

  it("adds an attribute in quotes", function() {
    var el = createTestNode('Hello World!', { id: 'content' });
    htmlPatch(el, '<?div =id +foo="bar" +baz=\'blip\'>Goodbye World!</div>');

    expect(serializeNode(el)).to.be('<div baz="blip" foo="bar" id="content">Goodbye World!</div>');
  });

  it("throws when attribute values not quoted", function() {
    var el = createTestNode('Hello World!', { id: 'content' });
    expect(htmlPatch).withArgs(el, '<?div =id +foo=bar>Goodbye World!</div>').to.throwError();
  });

  it("throws when attribute quotes not balanced", function() {
    var el = createTestNode('Hello World!', { id: 'content' });
    expect(htmlPatch).withArgs(el, '<?div =id +foo="bar\'>Goodbye World!</div>').to.throwError();
  });
});
