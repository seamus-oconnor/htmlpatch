(function(global) {
  "use strict";

  if(global.htmlPatch) {
    return;
  }

  // Patch attributes, nodes (perserving existing node order), comments, and
  // text nodes.

  function repeatStr(s, times) {
    return new Array(times).join(s);
  }

  function diffErrorMessage(msg, diff, pos) {
    var snip = diff.substring(pos - 20, 40);
    return 'HTMLPatch parse error:\n' + snip + '\n' + repeatStr(Math.min(pos, 20)) + '^ ' + msg + ' at char: ' + pos;
  }

  function htmlPatch(nodeOrSelector, diff) {
    var rootNode = nodeOrSelector;
    if(typeof nodeOrSelector === 'string') {
      rootNode = document.querySelector(nodeOrSelector);
      if(!rootNode) { throw new TypeError('No node matches ' + nodeOrSelector); }
    }

    // <?div id="test-1" +data-updated>Goodbye World!</div>
    if(rootNode.nodeType !== 1) { throw new TypeError('First argument must be a HTML element.'); }
    if(typeof diff !== 'string') { throw new TypeError('Second argument must be a string.'); }

    var node = rootNode;
    var parentNode = node.parentNode;
    var pos = 0;
    var diffLen = diff.length;

    do {
      var char = diff.charAt(pos);

      switch(char) {
        case '<':
          var modChar = diff.charAt(pos + 1);
          var closeTagPos = diff.indexOf('>', pos);
          if(closeTagPos === -1) {
            throw new Error(diffErrorMessage('No closing tag ">" found', diff, pos));
          }

          var endOfNodeName = diff.indexOf(' ', pos + 1);

          if(endOfNodeName === -1) {
            endOfNodeName = closeTagPos;
          }

          endOfNodeName = Math.min(endOfNodeName, closeTagPos);

          var name = diff.substring(pos + 2, endOfNodeName);

          switch(modChar) {
            case '/': // closing tag
              if(parentNode.nodeName !== name.toUpperCase()) {
                throw new Error('Node name doesn\'t match. Expected "' + name + '" found "' + node.nodeName + '"');
              }

              if(rootNode === parentNode) { return true; } // done
              node = node.parentNode;
              parentNode = node.parentNode;
              pos = closeTagPos;
              continue;
            case '-': // remove node then keep going
              var prevNode = node.previousSibling;
              parentNode.removeChild(node);
              node = prevNode;
              break;
            case '=': // Nothing changed - goto end of tag. E.g. <=div/>
              // self closing tag - ignore children
              if(diff.charAt(closeTagPos - 1) === '/') {
                if(node.nextSibling) {
                  node = node.nextSibling;
                }
              }
              break;
            case '+':
                var newNode = node.ownerDocument.createElement(name);
                parentNode.insertBefore(newNode, node.nextSibling);
                node = newNode;

                var newAttributes = diff.substring(endOfNodeName, closeTagPos);

                if(newAttributes) {
                  newAttributes = newAttributes.split(' ');
                  for (var j = newAttributes.length - 1; j >= 0; j--) {
                    var parts = newAttributes[j].split('=');
                    node.setAttribute(parts[0], parts.length === 2 ? parts[1] : '');
                  }
                }

                // TODO: Crap diff parsing for ending block - improve.
                var endingTagPos = diff.indexOf('</' + name + '>', closeTagPos);

                // New node means all children are new too - just innerHTML.
                node.innerHTML = diff.substring(closeTagPos + 1, endingTagPos);

                break;
            case '?':
              if(node.nodeName !== name.toUpperCase()) {
                throw new Error('Node name doesn\'t match. Expected "' + name + '" found "' + node.nodeName + '"');
              }

              var attributesDiff = diff.substring(endOfNodeName, closeTagPos);

              if(attributesDiff) {
                parseAttributes(node, attributesDiff);
              }

              break;
            case '!': // comment?
              break;
            default:
              throw new Error('Missing modification character. Char "' + modChar + '" invalid.');
          }

          pos = closeTagPos;

          if(node.nodeType === 1) {
            parentNode = node;
            node = node.firstChild;
          }
          // TODO: throw on `null` node

          break;
        default: // text node
          var nextOpenTag = diff.indexOf('<', pos);
          var text = diff.substring(pos, nextOpenTag);

          if(text !== '[\u2026]') {
            if(!node) {
              node = parentNode.ownerDocument.createTextNode(text);
              parentNode.appendChild(node);
            } else {
              node.data = text;
            }
          } else if(text === '\\[\u2026\\]') {
            node.data = '[\u2026]';
          }

          if(node.nextSibling) {
            node = node.nextSibling;
          }

          pos = nextOpenTag - 1;
      }

      pos++;
    } while(pos < diffLen);

    return node;
  }

  function parseAttributes(node, attrsDiff) {
    var changedAttrs = attrsDiff.trim().split(/[ ]+/g);
    var nodeName = node.nodeName.toLowerCase();

    for(var i = changedAttrs.length - 1; i >= 0; i--) {
      var mod = changedAttrs[i].charAt(0);
      var parts = changedAttrs[i].substr(1).split('=');

      var name = parts[0], value = parts[1];
      switch(mod) {
        case '=':
          // Do nothing
          break;
        case '+':
          if(parts.length === 1) {
            value = '';
          } else {
            var quote = value.charAt(0);
            if(quote !== '"' && quote !== "'") {
              throw new Error('Node ' + nodeName + '\'s attribute ' + name + ' not wrapped in double or single quotes.');
            }
            if(quote !== value.charAt(value.length - 1)) {
              throw new Error('Node ' + nodeName + '\'s attribute ' + name + ' quotes not balanced.');
            }

            value = value.substr(1, value.length - 2);
          }

          node.setAttribute(name, value);
          break;
        case '-':
          node.removeAttribute(name);
          break;
        default:
          throw new Error('Unhandled attribute modification character "' + mod + '"');
      }
    }
  }

  global.htmlPatch = htmlPatch;
})(this);
