"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toggleProductVisibility } from "@/app/admin/products/actions";
import { Button } from "@/components/ui/Button";

interface ToggleVisibilityButtonProps {
  productId: string;
  isHidden: boolean;
}

export function ToggleVisibilityButton({
  productId,
  isHidden,
}: ToggleVisibilityButtonProps) {
  const [pending, setPending] = useState(false);

  async function handleClick() {
    setPending(true);
    try {
      await toggleProductVisibility(productId, isHidden);
    } finally {
      setPending(false);
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={pending}
      title={isHidden ? "Unhide product" : "Hide product"}
    >
      {isHidden ? (
        <EyeOff className="w-4 h-4 text-gray-400" />
      ) : (
        <Eye className="w-4 h-4 text-gray-600" />
      )}
    </Button>
  );
}
