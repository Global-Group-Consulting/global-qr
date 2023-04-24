import axios, { AxiosError } from 'axios'
import { useToast } from 'primevue/usetoast'

export default function useApi () {
  const toast = useToast()
  
  async function login (username: string, password: string) {
    const resp = await axios.post(import.meta.env.VITE_API_URL + 'login', null, {
      auth: {
        username: username,
        password: password
      }
    })
    
    localStorage.setItem('qrpass_token', resp.data.token)
    
    return resp.data
  }
  
  async function call (method: string, url: string, data?: any) {
    const resp = await axios({
      method: method,
      url: import.meta.env.VITE_API_URL + url,
      data: data,
      headers: {
        Authorization: "Bearer " + localStorage.getItem('qrpass_token')
      }
    })
    
    return resp.data
  }
  
  function handleError (er: Error) {
    let message = er.message
    
    if (er instanceof AxiosError) {
      message = er.response?.data?.message
    }
    
    toast.add({ severity: 'error', summary: 'Qualcosa è andato storto', detail: message, life: 3000 })
  }
  
  return {
    login,
    call,
    handleError
  }
}
