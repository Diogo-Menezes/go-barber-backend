import { container } from 'tsyringe';
import RedisCacheProvider from '@shared/container/providers/CacheProvider/Implementations/RedisCacheProvider';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

const providers = {
  redis: RedisCacheProvider,
};

container.registerSingleton<ICacheProvider>('CacheProvider', providers.redis);
