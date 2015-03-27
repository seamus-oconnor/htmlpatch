describe("Patching Elements", function() {
  it.skip("adds elements", function() {
    var el = createTestNode('Hello <b>World!</b>');
    // TODO: Doesn't remove the first child "World!" text node.
    htmlPatch(el, '<=div>Hello <b><+i>World!</i></b></div>');

    expect(el.outerHTML).to.be('<div>Hello <b><i>World!</i></b></div>');
  });

  it("removes elements", function() {
    var el = createTestNode('Hello <b>World!</b>');
    htmlPatch(el, '<=div>Hello<-b/></div>');

    expect(el.outerHTML).to.be('<div>Hello</div>');
  });

  it("throws when there is no ending '>'", function() {
    var el = createTestNode('Hello <b>World!</b>');

    expect(htmlPatch).withArgs(el, '<=div').to.throwError();
  });

  it("throws when ending tag doesn't match", function() {
    var el = createTestNode('Hello <b>World!</b>');

    expect(htmlPatch).withArgs(el, '<=div></banana>').to.throwError();
  });

  it("throws when selector doesn't match", function() {
    expect(htmlPatch).withArgs('body .does-not-exist', '').to.throwError();
  });
});
