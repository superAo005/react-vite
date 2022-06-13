const getIntelliSense = (word) => {
  // debugger
  return fetch(`/api/intellisense?word=${encodeURIComponent(word)}`, {
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
