const STATUS_EMOJI: Record<string, string> = {
  processing: "⏳",
  ready: "✅",
  out_for_delivery: "🚚",
  completed: "🎉",
  cancelled: "❌",
  pending: "🕐",
  paid: "💰",
  failed: "⚠️",
};

export async function sendTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
    });
  } catch (err) {
    console.error("Telegram notification failed:", err);
  }
}

export function buildNewOrderMessage(
  orderId: string,
  customerName: string,
  customerPhone: string,
  customerEmail: string | null | undefined,
  fulfillmentMethod: string,
  paymentMethod: string,
  total: number,
  deliveryAddress: { street: string; area: string; city: string } | null | undefined,
  items: Array<{
    name: string;
    size?: string | null;
    quantity: number;
    price: number;
    customization?: {
      printName?: string | null;
      printNumber?: string | null;
      addOnPrice?: number;
    } | null;
  }>
): string {
  const itemLines = items
    .map((i) => {
      const unitPrice = i.price + (i.customization?.addOnPrice ?? 0);
      const lines = [
        `  • ${i.name} (${i.size ?? "—"}) ×${i.quantity} — KES ${Math.round(unitPrice * i.quantity).toLocaleString()}`,
      ];
      if (i.customization?.printName || i.customization?.printNumber) {
        lines.push(
          `    ${[i.customization.printName, i.customization.printNumber ? `#${i.customization.printNumber}` : null].filter(Boolean).join(" ")}`
        );
      }
      return lines.join("\n");
    })
    .join("\n");

  const fulfillmentLabel = fulfillmentMethod === "delivery" ? "🚚 Delivery" : "🏪 Store Pickup";
  const paymentLabel = "M-Pesa STK Push";
  const address = deliveryAddress
    ? `${deliveryAddress.street}, ${deliveryAddress.area}, ${deliveryAddress.city}`
    : null;

  return [
    `🛒 *New Order — #${orderId.slice(0, 8).toUpperCase()}*`,
    ``,
    `👤 *Customer*`,
    `  Name: ${customerName}`,
    `  Phone: ${customerPhone}`,
    customerEmail ? `  Email: ${customerEmail}` : null,
    ``,
    `📦 *Items*`,
    itemLines,
    ``,
    `💰 *Total: KES ${Math.round(total).toLocaleString()}*`,
    ``,
    fulfillmentLabel,
    address ? `  📍 ${address}` : null,
    `💳 Payment: ${paymentLabel}`,
  ]
    .filter((l) => l !== null)
    .join("\n");
}

export function buildOrderUpdateMessage(
  orderId: string,
  changes: { order_status?: string; payment_status?: string }
): string {
  const lines = [`📋 *Order #${orderId.slice(0, 8).toUpperCase()} Updated*`, ``];

  if (changes.order_status) {
    const emoji = STATUS_EMOJI[changes.order_status] ?? "🔄";
    lines.push(`Order Status: ${emoji} ${changes.order_status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}`);
  }
  if (changes.payment_status) {
    const emoji = STATUS_EMOJI[changes.payment_status] ?? "🔄";
    lines.push(`Payment: ${emoji} ${changes.payment_status.replace(/\b\w/g, (c) => c.toUpperCase())}`);
  }

  return lines.join("\n");
}
