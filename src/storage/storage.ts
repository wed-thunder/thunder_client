import AsyncStorage from '@react-native-async-storage/async-storage';

class Storage<T> {
  private pIdentifier: string;

  public constructor(identifier: string) {
    this.pIdentifier = identifier;
  }

  public async read(): Promise<T> {
    try {
      const data = await AsyncStorage.getItem(this.pIdentifier);
      return (data ? JSON.parse(data) : null) as T;
    } catch (error) {
      return null;
    }
  }

  public async store(data: T): Promise<boolean> {
    try {
      await AsyncStorage.setItem(this.pIdentifier, JSON.stringify(data));
      return true;
    } catch (error) {
      return false;
    }
  }

  public async clear(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(this.pIdentifier);
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default Storage;
