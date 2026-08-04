/**
 * WhatsApp sender via Fonnte (https://fonnte.com)
 *
 * Required env var (server-only):
 *   FONNTE_API_TOKEN  — your device token from fonnte.com dashboard
 *
 * Setup (one-time, ~5 minutes):
 *   1. Sign up at https://fonnte.com
 *   2. Add Device → scan QR with WhatsApp on the business phone (254708353465)
 *   3. Copy the token from your device dashboard → paste into .env.local + Vercel env vars
 */

const BUSINESS_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "254708353465";

/** Normalise any Kenyan number to digits only, e.g. 0712345678 → 254712345678 */
function normalisePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("254")) return digits;
  if (digits.startsWith("0")) return "254" + digits.slice(1);
  return "254" + digits;
}

/** Send a WhatsApp message via Fonnte. Silently skips if token is not configured. */
export async function sendWhatsApp(phone: string, message: string): Promise<void> {
  const token = process.env.FONNTE_API_TOKEN;

  if (!token) {
    console.warn("[WhatsApp] Skipped — FONNTE_API_TOKEN not set");
    return;
  }

  const res = await fetch("https://api.fonnte.com/send", {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      target: normalisePhone(phone),
      message,
      countryCode: "254",
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`[WhatsApp] Fonnte error ${res.status}:`, text);
  }
}

/** Business phone number (normalised) */
export const BUSINESS_WHATSAPP = normalisePhone(BUSINESS_PHONE);
