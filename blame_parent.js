(function(){
  var nodes = document.querySelectorAll('.commitinfo > code > a:nth-child(2)');

  var node, cloned, href;

  for(var i=0;i<nodes.length;i++){
    node = nodes[i];
    href = node.getAttribute('href');

    cloned = node.cloneNode(true);
    cloned.textContent = '^';
    cloned.setAttribute('href', href.replace(/blame\/([0-9a-f]+)\//, 'blame/$1%5E/'));
    cloned.classList.add('blame-parent');

    cloned.addEventListener('click', function(e){
      var _e;

      // Dispatch the event again without the alt key
      if(e.altKey){
        e.preventDefault();
        e.stopPropagation();

        e.target.dispatchEvent(new MouseEvent('click', {
          screenX: e.screenX,
          screenY: e.screenY,
          ctrlKey: e.ctrlKey,
          shiftKey: e.shiftKey,
          altKey: false,
          metaKey: e.metaKey,
          button: e.button,
          buttons: e.buttons,
          relatedTarget: e.relatedTarget
        }));
      }
    });

    node.classList.add('blame-commit');

    node.parentNode.insertBefore(cloned, node);
  }

  var style = document.createElement('style');

  style.setAttribute('type', 'text/css');
  document.head.appendChild(style);
  
  var enable = function(){
    style.textContent = '.blame-parent { display: inline; }\n.blame-commit { display: none; }'
  };

  var disable = function(){
    style.textContent = '.blame-commit { display: inline; }\n.blame-parent { display: none; }'
  };

  disable();

  document.body.addEventListener('keydown', function(e){
    if(e.keyCode === 18 /* Alt (option) key */){ enable(); }
    return true;
  }, false);

  document.body.addEventListener('keyup', function(e){
    if(e.keyCode === 18 /* Alt (option) key */){ disable(); }
    return true;
  }, false);
})();