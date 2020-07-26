import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";

interface ICacheData {
  [key: string]: string;

}

export default class FakeCacheRepository implements ICacheProvider {
  private cacheProvider: ICacheData = {};

  public async invalidate(key: string): Promise<void> {
    delete this.cacheProvider[key]
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    const keys = Object.keys(this.cacheProvider).filter(key =>
      key.startsWith(`${prefix}:`)
    )

    keys.forEach(key => delete this.cacheProvider[key])

  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = this.cacheProvider[key]

    if (!data) return null;

    return JSON.parse(data) as T;
  }

  public async save(key: string, value: any): Promise<void> {
    this.cacheProvider[key] = JSON.stringify(value)
  }

}
