describe("Patching Attributes", function() {
  it("exists on the global object", function() {
    expect(window.htmlPatch).to.be.ok();
  });

  it("adds an attribute", function() {
    var el = createTestNode('Hello World!', { id: 'content' });
    htmlPatch(el, '<?div =id +data-updated>Goodbye World!</div>');

    expect(serializeNode(el)).to.be('<div data-updated="" id="content">Goodbye World!</div>');
  });

  it("adds an attribute in double quotes", function() {
    var el = createTestNode('Hello World!', { id: 'content' });
    htmlPatch(el, '<?div =id +foo="bar">Goodbye World!</div>');

    expect(serializeNode(el)).to.be('<div foo="bar" id="content">Goodbye World!</div>');
  });
});
