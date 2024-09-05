const token = window.location.search.slice(1)

export const getAuthorizationHeader = () => `Bearer ${token}`
