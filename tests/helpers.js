/* jshint unused:false */

function createTestNode(html, attrs) {
  var el = document.createElement('div');
  el.innerHTML = html;
  for(var attr in attrs) {
    if(attrs.hasOwnProperty(attr)) {
      el.setAttribute(attr, attrs[attr]);
    }
  }
  return el;
}

function serializeNode(node) {
  var s = '';

  function escapeText(text) {
    return text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;');
  }

  function escapeAttrText(text) {
    return escapeText(text).replace('"', '&quot;').replace("'", '&#34;');
  }

  switch(node.nodeType) {
    case 1:
      var nodeName = node.nodeName.toLowerCase();
      s += '<' + nodeName;
      var attrs = {};
      for(var j = 0; j < node.attributes.length; j++) {
        attrs[node.attributes[j].name] = node.attributes[j].value;
      }

      var attrNames = Object.keys(attrs);
      attrNames.sort();
      attrNames.forEach(function(name) {
        s += ' ' + name + '="' + escapeAttrText(attrs[name]) + '"';
      });

      s += '>';

      for(var i = 0; i < node.childNodes.length; i++) {
        s += serializeNode(node.childNodes.item(i));
      }

      s += '</' + nodeName + '>';
      break;
    case 3:
      s += escapeText(node.data);
  }

  return s;
}
