import Storage from './storage';

import { IAuthUser } from '@/models';

const userStorage = new Storage<IAuthUser>('user');

export default userStorage;
