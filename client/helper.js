/* Takes in an error message. Sets the error message up in html, and
   displays it to the user. Will be hidden by other events that could
   end in an error.
*/
const handleError = (message) => {
  document.getElementById('errorMessage').textContent = message;
  document.getElementById('domoMessage').classList.remove('hidden');
};

/* Sends post requests to the server using fetch. Will look for various
   entries in the response JSON object, and will handle them appropriately.
*/
const sendPost = async (url, data, handler, requestMethod = 'POST') => {
  const response = await fetch(url, {
    method: requestMethod,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (response.status != 204) {
    const result = await response.json();
    document.getElementById('domoMessage').classList.add('hidden');


    if (result.error) {
      handleError(result.error);
    }

    if (result.redirect) {
      window.location = result.redirect;
    }

    if (handler) {
      handler(result);
    }
  } else {
    if (handler) {
      handler();
    }
  }

};

const hideError = () => {
  document.getElementById('domoMessage').classList.add('hidden');
}

module.exports = {
  handleError,
  sendPost,
  hideError,
}