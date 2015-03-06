describe("Patching Text", function() {
  it("updates text nodes", function() {
    var date = new Date() + '';
    var el = createTestNode('Hello World! Current Time: <b></b>');
    htmlPatch(el, '<=div>Hello World! Current Time: <=b>' + date + '</b></div>');

    expect(el.outerHTML).to.be('<div>Hello World! Current Time: <b>' + date + '</b></div>');
  });

  it("can skip text nodes", function() {
    var el = createTestNode('Hello <b>World!</b>');
    htmlPatch(el, '<=div>[…]<=b>Banana!</b></div>');

    expect(el.outerHTML).to.be('<div>Hello <b>Banana!</b></div>');
  });
});
