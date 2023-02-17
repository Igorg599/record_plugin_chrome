const get = (key) => {
  return localStorage.getItem(key)
}

const set = (key, value) => {
  localStorage.setItem(key, value)
}

export default {
  set,
  get,
}
