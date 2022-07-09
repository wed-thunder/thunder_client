import axios from 'axios';

import { apiConfig } from './api';

const publicApi = axios.create(apiConfig);

export default publicApi;
