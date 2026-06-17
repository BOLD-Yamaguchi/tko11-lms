import ky from 'ky'
import { API_BASE_URL } from '../constants/api'

export const httpClient = ky.create({
  prefixUrl: API_BASE_URL,
  timeout: 10_000,
  retry: {
    limit: 1,
    methods: ['get'],
  },
})
