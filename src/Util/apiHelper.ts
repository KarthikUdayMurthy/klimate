import OneCallMockResponse from './MockResponses/OneCall';

interface Obj {
  [key: string]: any;
}

export interface FetchDataParams {
  endPoint: string;
  cacheKey: string;
  queryParams?: Obj;
  isMock?: boolean;
}

export const EndPoints = {
  OneCall: {
    url: 'https://api.openweathermap.org/data/2.5/onecall',
    mockResponse: OneCallMockResponse
  }
};

let cacheResponses: Obj = {};

const resolvePromiseInSomeTime = <T>(val: T, timeInMilliSeconds: number) => {
  let tempPromise = new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      resolve(val);
    }, timeInMilliSeconds);
  });
  return tempPromise;
};

const apiHelper = {
  fetchData: <T>({
    endPoint,
    cacheKey,
    queryParams,
    isMock = false
  }: FetchDataParams): Promise<T> => {
    if (!EndPoints.hasOwnProperty(endPoint)) {
      return Promise.reject('Endpoint not found');
    } else if (isMock) {
      console.log('Mock response');
      return resolvePromiseInSomeTime(EndPoints[endPoint].mockResponse, 1000);
    } else if (cacheResponses.hasOwnProperty(cacheKey)) {
      console.log('Cached response');
      return resolvePromiseInSomeTime(cacheResponses[cacheKey], 0);
    } else {
      let url = EndPoints[endPoint].url;
      let hasQueryParams = Object.keys(queryParams).length > 0;
      if (hasQueryParams) {
        url += '?';
      }
      for (let k in queryParams) {
        url += k.toString() + '=' + queryParams[k].toString() + '&';
      }
      if (hasQueryParams) {
        url = url.substr(0, url.length - 1);
      }

      return fetch(url)
        .then(res => {
          if (res.ok) {
            return res.json().then(res => {
              cacheResponses[cacheKey] = res;
              return res;
            });
          }
          throw new Error(
            'Response returned status - ' + res.status + ':' + res.statusText
          );
        })
        .catch(e => {
          if (
            e &&
            e.message &&
            e.message.indexOf('Response returned status') >= 0
          ) {
            throw new Error(e.message);
          } else {
            throw new Error('Network error');
          }
        });
    }
  },

  clearCache: (endPoint = '') => {
    if (!endPoint) {
      cacheResponses = {};
    } else {
      for (let k in cacheResponses) {
        if (k.startsWith(endPoint)) {
          delete cacheResponses[k];
        }
      }
    }
  }
};

export default apiHelper;
