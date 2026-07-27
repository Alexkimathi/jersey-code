"use client";

import ProductForm from "@/app/admin/products/[id]/edit/page";

export default function NewProductPage() {
  return <ProductForm params={Promise.resolve({})} />;
}
