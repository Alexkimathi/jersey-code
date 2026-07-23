import { createServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { OrderConfirmationClient } from "./OrderConfirmationClient";

interface OrderConfirmationPageProps {
  params: Promise<{ id: string }>;
}

async function getOrder(id: string) {
  const supabase = createServerClient() as any;
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) notFound();

  return <OrderConfirmationClient order={order} />;
}
