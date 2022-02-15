import { API } from 'config';
import { IncomingHttpHeaders } from 'http';

const getUriFromReqHeaders = (headers: IncomingHttpHeaders) => {
  const { referer } = headers;
  const matched = referer?.match(/http(s)?:\/\/([^\/])+/g);
  const uri = matched ? matched[0] : API;
  // console.log(uri);
  return uri;
};

export default getUriFromReqHeaders;
