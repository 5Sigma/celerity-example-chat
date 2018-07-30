
import axios from 'axios';

export const bareQuery = (url, options) => axios({
  url,
  ...options,
});

export const apiQuery = (method, path, data, options = { }) => {
    const opts = {
        method,
        data,
        ...options,
    };
    const url = `http://localhost:5050${path}`;
    return bareQuery(url, opts);
};

export const authQuery = (method, url, data, options = {}) => {
  const opts = {
    ...options,
    method,
    data,
    headers: { Authorization: localStorage.getItem('token') },
  };

  return apiQuery(method, url, data, opts);
};
