// src/lib/request.tsx

import axios from 'axios';
import config from './config.tsx';

let _csrf = '';

interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  data?: any;
}

const getFullUrl = (apiSite: string, fullUrl: string): string => {
  return config.publicRuntimeConfig.backend.apiFormat.replace(/\{0\}/g, apiSite).replace(/\{1\}/g, fullUrl);
}

const getBaseUrl = (): string => {
  return config.publicRuntimeConfig.backend.baseUrl;
}

const getUrlWithProxy = (url: string): string => {
  if (config.publicRuntimeConfig.backend.proxyEnabled) {
    return '/api/proxy?url=' + encodeURIComponent(url);
  }
  return url;
}

const request = async ({ method, url, data }: RequestOptions): Promise<any> => {
  const isBrowser = typeof window !== 'undefined';
  try {
    let headers: any = {
      'x-csrf-token': _csrf,
    };
    if (!isBrowser) {
      const authHeaderValue = config.serverRuntimeConfig.backend.authorization;
      if (typeof authHeaderValue === 'string') {
        headers[config.serverRuntimeConfig.backend.authorization || 'authorization'] = authHeaderValue;
      }
      headers['user-agent'] = 'Roblox2016/1.0';
    }
    
    const result = await axios.request({
      method,
      url: getUrlWithProxy(url),
      data,
      headers,
      maxRedirects: 0,
    });
    return result;
  } catch (e) {
    if (e.response) {
      let resp = e.response;
      if (resp.status === 403 && resp.headers['x-csrf-token']) {
        _csrf = resp.headers['x-csrf-token'];
        return await request({ method, url, data });
      }
    }
    if (isBrowser) {
      if (e.response) {
        if (e.response.data && e.response.data.errors && e.response.data.errors.length) {
          let err = e.response.data.errors[0];
          e.message = e.message + ': ' + (err.code + ': ' + err.message);
        }
      }
      throw e;
    } else {
      throw new Error(e.message);
    }
  }
}

export default request;
export { getFullUrl, getBaseUrl, getUrlWithProxy };
