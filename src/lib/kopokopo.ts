const KOPOKOPO_CLIENT_ID = process.env.KOPOKOPO_CLIENT_ID!;
const KOPOKOPO_CLIENT_SECRET = process.env.KOPOKOPO_CLIENT_SECRET!;
const KOPOKOPO_TILL_NUMBER = process.env.KOPOKOPO_TILL_NUMBER || "8951054";
const KOPOKOPO_ENV = process.env.KOPOKOPO_ENV || "sandbox";

const KOPOKOPO_BASE_URL =
  KOPOKOPO_ENV === "production"
    ? "https://api.kopokopo.com"
    : "https://sandbox.kopokopo.com";

async function getAccessToken(): Promise<string> {
  const response = await fetch(`${KOPOKOPO_BASE_URL}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: KOPOKOPO_CLIENT_ID,
      client_secret: KOPOKOPO_CLIENT_SECRET,
    }),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Kopo Kopo auth failed: ${response.status} ${text}`);
  }

  const data = JSON.parse(text);
  return data.access_token;
}

function formatPhone(phone: string): string {
  // Normalize to E.164 format: +254XXXXXXXXX
  const digits = phone.replace(/^\+/, "").replace(/^0/, "254");
  return `+${digits}`;
}

export async function initiateSTKPush(params: {
  phoneNumber: string;
  amount: number;
  orderId: string;
  callbackUrl?: string;
}): Promise<{ paymentId: string }> {
  const { phoneNumber, amount, orderId, callbackUrl } = params;

  const accessToken = await getAccessToken();

  const callbackURL =
    callbackUrl ||
    process.env.KOPOKOPO_CALLBACK_URL ||
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/kopokopo/callback`;

  const payload = {
    payment_channel: "M-PESA STK Push",
    till_number: KOPOKOPO_TILL_NUMBER,
    subscriber: {
      phone_number: formatPhone(phoneNumber),
    },
    amount: {
      currency: "KES",
      value: Math.round(amount),
    },
    metadata: {
      order_id: orderId,
    },
    _links: {
      callback_url: callbackURL,
    },
  };

  const response = await fetch(
    `${KOPOKOPO_BASE_URL}/api/v1/incoming-payments`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Kopo Kopo STK Push failed: ${response.status} ${text}`);
  }

  // Kopo Kopo returns 201 with a Location header containing the payment resource URL
  const location = response.headers.get("location") || "";
  const paymentId = location.split("/").pop() || "";

  if (!paymentId) {
    throw new Error("Kopo Kopo STK Push: missing payment ID in Location header");
  }

  return { paymentId };
}
