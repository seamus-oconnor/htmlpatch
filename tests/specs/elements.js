describe("Patching Elements", function() {
  it("changes element type", function() {
    var el = createTestNode('Hello <b>World!</b>');
    htmlPatch(el, '<=div>Hello <-b/><+i>World!</i></div>');

    expect(el.outerHTML).to.be('<div>Hello <i>World!</i></div>');
  });
});
