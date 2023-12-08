import axios from 'axios';

/* Possui 4 urls:
* 1 - Produção
* 2 - IP Localhost
* 3 - Localhost
* 4 - Dev
*/ 
const api = axios.create({  
  baseURL: 'https://witty-sandals-fish.cyclic.app'
});

export default api
