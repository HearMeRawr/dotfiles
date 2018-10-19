const MESSAGE_EVENT_TYPE = 'message';
const CHECKLOAD_REQUEST = 'checkload';
const ALLOWED_ORIGIN = 'chrome-extension://' + chrome.runtime.id;
/** Comment required by lint. */
const handleCheckLoadRequest = () => {
  event['source'].postMessage({
    'loaded': true
  }, '*');
};
/** @param {*} event */
const handleApiRequest = event => {
  const request = event['data']['request'];
  const callback = (response, rawResponse) => {
    event['source'].postMessage({
      'id': event['data']['id'],  // Pass back the ID.
      'response': response,
      'rawResponse': rawResponse
    }, '*');
  };
  gapi.client.request(request).execute(callback);
};
/** Comment required by lint. */
window.handleClientScriptLoaded = () => {
  window.addEventListener(MESSAGE_EVENT_TYPE, event => {
    if (event.origin != ALLOWED_ORIGIN) {
      // Ignore messages from unknown sources.
      return;
    }
    try {
      const data = event['data'];
      // Handle the check for the script being loaded.
      if (data['request'] == CHECKLOAD_REQUEST) {
        handleCheckLoadRequest();
      } else if (data['type'] == 'feedback') {
        // TODO(alyssad): Remove this once Chrome 44 hits stable (2014-07-21).
        castv2.sandbox.handleFeedbackRequest(event);
      } else {
        // Handle requests to the gapi client.
        handleApiRequest(event);
      }
    } catch (e) {
      event['source'].postMessage({
        'error': e
      }, '*');
    }
  });
};
