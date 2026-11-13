import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

export function RatingStars({
  rating,
  max = 5,
  size = "md",
  showValue = true,
  className,
}: RatingStarsProps) {
  const sizeClasses = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5 text-amber-400">
        {Array.from({ length: max }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              sizeClasses[size],
              i < Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "text-slate-300 dark:text-slate-700"
            )}
          />
        ))}
      </div>
      {showValue && (
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
          {rating ? Number(rating).toFixed(1) : "New"}
        </span>
      )}
    </div>
  );
}
