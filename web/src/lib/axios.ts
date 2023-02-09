import axios, { AxiosRequestConfig } from 'axios'

export const api = axios.create({
  baseURL: "https://apihabit.onrender.com",
})

api.interceptors.request.use((request: AxiosRequestConfig) => {
  request.headers.set(
    'Authorization',
    `Bearer ${JSON.parse(localStorage['recoil-persist'] || '{}')?.authState}`
  )

  return request
})
