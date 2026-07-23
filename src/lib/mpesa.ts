const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY!;
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET!;
const MPESA_PASSKEY = process.env.MPESA_PASSKEY!;
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE || "174379";
const MPESA_ENV = process.env.MPESA_ENV || "sandbox";

const MPESA_BASE_URL =
  MPESA_ENV === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(
    `${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`
  ).toString("base64");

  const response = await fetch(
    `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`M-Pesa auth failed: ${response.status} ${text}`);
  }

  const data = JSON.parse(text);
  return data.access_token;
}

async function generatePassword(): Promise<{ password: string; timestamp: string }> {
  const timestamp = new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, 14);

  const password = Buffer.from(
    `${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`
  ).toString("base64");

  return { password, timestamp };
}

export async function initiateStkPush(params: {
  phoneNumber: string;
  amount: number;
  orderId: string;
  callbackUrl?: string;
}): Promise<{ checkoutRequestId: string; responseDescription: string }> {
  const { phoneNumber, amount, orderId, callbackUrl } = params;

  const accessToken = await getAccessToken();
  const { password, timestamp } = await generatePassword();

  const formattedPhone = phoneNumber
    .replace(/^\+/, "")           // strip leading +
    .replace(/^0/, "254");        // replace leading 0 with country code

  const payload = {
    BusinessShortCode: MPESA_SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: Math.round(amount),
    PartyA: formattedPhone,
    PartyB: MPESA_SHORTCODE,
    PhoneNumber: formattedPhone,
    CallBackURL:
      callbackUrl ||
      process.env.MPESA_CALLBACK_URL ||
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/mpesa/callback`,
    AccountReference: `JERSEY-${orderId.slice(0, 8)}`,
    TransactionDesc: `Payment for order ${orderId.slice(0, 8)}`,
  };

  const response = await fetch(
    `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`M-Pesa STK Push failed: ${response.status} ${text}`);
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`M-Pesa STK Push returned non-JSON response: ${text.slice(0, 200)}`);
  }

  if (data.ResponseCode === "0") {
    return {
      checkoutRequestId: data.CheckoutRequestID,
      responseDescription: data.ResponseDescription,
    };
  }

  throw new Error(data.ResponseDescription || "STK Push failed");
}
