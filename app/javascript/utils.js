export default {
  parseQueryString
}

function parseQueryString() {
  const qs = decodeURIComponent(window.location.search.substring(1)).split('&');
  const result = {};
  for (let i in qs) {
    if (qs.hasOwnProperty(i)) {
      const keyValue = qs[i].split('=');
      result[keyValue[0]] = keyValue[1];
    }
  }
  return result;
}