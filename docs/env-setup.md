# Environment Setup — cb2026-web

## Gereken değişkenler

### Upstash Redis (zorunlu — /api/subscribe için)

**Amaç:** Lansman e-posta listesi + rate limiting.

**Kurulum:**
1. Vercel Dashboard → Storage → Marketplace → **Upstash Redis**
2. "Create Database" → cb2026-web projesine bağla
3. Vercel otomatik olarak aşağıdaki env değişkenlerini ekler:

```
KV_REST_API_URL=https://<region>.upstash.io
KV_REST_API_TOKEN=<token>
```

**Local development:**
```bash
vercel env pull .env.local
```

### Veri şeması

- **Set**: `subscribers` → tüm abone email'leri (deduplicated)
- **Hash**: `subscriber:<email>` → `{ source, ip, ts }`
- **Rate limit key**: `cb:subscribe:rl:<ip>` → 10 dakika/5 istek

### Veri export (lansman için)

```bash
# Upstash CLI
upstash redis smembers subscribers > subscribers.txt
# veya Redis CLI
redis-cli SMEMBERS subscribers
```
