// @ts-ignore
export default function auth (router, next) {
  const token = localStorage.getItem('qrpass_token')
  
  if (!token) {
    return router.push({ name: 'login' })
  }
  
  return next()
}
