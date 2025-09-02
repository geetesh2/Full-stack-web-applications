
using Microsoft.Extensions.Caching.Distributed;

namespace ExpenseTrackerAPI.Services.Caching
{
    public class RedisCacheService : IRedisCacheService
    {
        private readonly IDistributedCache _distributedCache;

        public RedisCacheService(IDistributedCache distributedCache)
        {
            _distributedCache = distributedCache;
        }

        public T? GetData<T>(string key)
        {
            var data = _distributedCache.GetString(key);

            if (data == null)
            {
                return default;
            }

            return System.Text.Json.JsonSerializer.Deserialize<T>(data);
        }

        public void SetData<T>(string key, T value, TimeSpan? expiry = null)
        {
            var options = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = expiry ?? TimeSpan.FromMinutes(5)
            };

            var data = System.Text.Json.JsonSerializer.Serialize(value);
            _distributedCache.SetString(key, data, options);
        }
    }
}
