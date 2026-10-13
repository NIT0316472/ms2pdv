import axios from 'axios';
export const api=axios.create({baseURL:import.meta.env.VITE_API_URL??'http://localhost:3333/api'});
api.interceptors.request.use(c=>{const t=localStorage.getItem('ms2_token');if(t)c.headers.Authorization=`Bearer ${t}`;return c;});
