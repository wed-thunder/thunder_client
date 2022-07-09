import Storage from './storage';

import { IAuth } from '@/models/Auth';

const authStorage = new Storage<IAuth>('auth');

export default authStorage;
