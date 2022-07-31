import Storage from './storage';

const sendbirdStorage = new Storage<{
  sendbirdId: string;
  nickname: string;
}>('sendbirdId');

export default sendbirdStorage;
