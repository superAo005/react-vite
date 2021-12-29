const getIntelliSense = () => {
  return fetch('/api/intellisense', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    credentials: 'include',
    mode: 'cors',
  })
    .then((res) => res.json())
    .then((res) => {
      return res.data || null
    })
    .catch(() => null)
}
export default getIntelliSense
