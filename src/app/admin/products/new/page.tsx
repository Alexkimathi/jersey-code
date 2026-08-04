"use client";

import { Suspense } from "react";
import ProductForm from "@/app/admin/products/[id]/edit/page";

export default function NewProductPage() {
  return (
    <Suspense>
      <ProductForm params={Promise.resolve({})} />
    </Suspense>
  );
}
