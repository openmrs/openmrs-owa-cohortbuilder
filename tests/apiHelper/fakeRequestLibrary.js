import Response from 'http-response-object';

export const fakeRequestLibrary = (requestUrl, requestOptions, shouldPass = true, responseData = null) => {
  return new Promise((resolve, reject) => {
    if (shouldPass) {
      resolve(new Response(200, {}, { message: `You called ${requestUrl}` }, requestUrl));
    } else {
      reject(new Response(404, {}, responseData || { message: `The page at  ${requestUrl} was not found` }, requestUrl));
    }
  });
};
