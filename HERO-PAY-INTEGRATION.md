# EMPEROR FOODS → HERO PAY PromptPay Integration

## Customer flow

1. Customer submits an EMPEROR FOODS order.
2. EMPEROR FOODS receives the order number and public order token.
3. The Cloudflare worker verifies the order server-side against `/api/orders/status`.
4. The verified subtotal is used and the fixed THB 200 chilled-delivery fee is added.
5. EMPEROR FOODS calls HERO PAY server-to-server to create a signed PromptPay checkout session.
6. The customer sees `ชำระด้วย PromptPay QR ผ่าน HERO PAY` and opens the HERO PAY checkout.
7. HERO PAY requests the provider-issued PromptPay QR from NovelPay.

The browser cannot choose or lower the payment amount used to create the HERO PAY session.

## EMPEROR FOODS Cloudflare settings

Under Workers & Pages → emperor-foods → Settings → Variables and Secrets:

- Encrypted secret: `HERO_PAY_INTERNAL_API_KEY`
- Optional plaintext variable: `HERO_PAY_BASE_URL`
  - Default: `https://hero-pay-website.pages.dev`

The same internal API key must be configured on HERO PAY.

## HERO PAY provider activation

HERO PAY itself still requires the protected NovelPay production/sandbox settings and official API contract confirmation before a real provider-issued PromptPay QR can be shown.

See the HERO PAY repository production payment documentation for the NovelPay settings and go-live requirements.

## Safe status endpoint

`GET /api/hero-pay/health`

This reports whether the EMPEROR FOODS merchant bridge is configured and relays the safe HERO PAY readiness status. It never exposes secret values.
