// As soon as the <head> element exists, add the presentation polyfill as a
// <script> element.
let observer = null;
observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(addedNode => {
      if (addedNode.localName == 'head') {
        // Stop observing as soon as we've found the element we're interested
        // it.
        if (observer) {
          observer.disconnect();
          observer = null;
        }
        // Create the <script> element.  It must be an inline script (i.e. not
        // using a src attribute) to guarantee that the polyfill runs before
        // anything else on the page.
        const script = document.createElement('script');
        const xhr = new XMLHttpRequest();
        // Yep, that's a synchronous XHR :-(
        xhr.open(
            'GET', chrome.runtime.getURL('presentation_polyfill.js'), false);
        xhr.send();
        script.textContent = xhr.responseText;
        addedNode.insertBefore(script, addedNode.firstChild);
      }
    });
  });
});
observer.observe(document, {childList: true, subtree: true});
