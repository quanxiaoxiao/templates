import qs from 'qs';

const get = (path, data = {}) =>
  fetch(`${path}?${qs.stringify({
    ...data,
  })}`, {
    credentials: 'include',
  }).then(a => a.json());

const post = (path, data) =>
  fetch(path, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(data),
  }).then(a => a.json());

export default {
  get,
  post,
};
