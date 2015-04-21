(function(){
  var shaMatcher  = /[0-9a-f]{40}/,
      urlTemplate = document.location.href.replace(/blame\/[^\/]+\//, 'blame/<SHA>/'),
      links       = document.querySelectorAll('a.blame-sha');

  var show, blame, blameParent, sha;

  function normalizeClickEvent(node) {
    node.addEventListener('click', function(e){
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
  }

  for(var i=0;i<links.length;i++){
    show        = links[i];
    blame       = links[i].cloneNode(true);
    blameParent = links[i].cloneNode(true);

    show.classList.add('bp-show-commit');
    blame.classList.add('bp-blame-commit');
    blameParent.classList.add('bp-blame-parent');

    sha = shaMatcher.exec( blame.getAttribute('href') )[0];

    blame.setAttribute('href', urlTemplate.replace('<SHA>', sha));
    blameParent.setAttribute('href', urlTemplate.replace('<SHA>', sha + '%5E'));

    blameParent.innerText = "^";

    normalizeClickEvent(blame);
    normalizeClickEvent(blameParent);

    show.parentNode.insertBefore(blameParent, show);
    show.parentNode.insertBefore(blame, show);
  }

  var style = document.createElement('style');

  style.setAttribute('type', 'text/css');
  document.head.appendChild(style);

  var enable = function(){
    style.textContent = '.bp-show-commit { display: none; }\n.bp-blame-commit, .bp-blame-parent { display: inline; font-weight: bold; margin-left: 5px; }'
  };

  var disable = function(){
    style.textContent = '.bp-show-commit { display: inline; }\n.bp-blame-commit, .bp-blame-parent { display: none; }'
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
