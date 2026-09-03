import { cn } from "@/lib/utils";

const variants = {
  pass: "bg-emerald-100 text-emerald-700",
  fail: "bg-red-100 text-red-700",
  pending: "bg-amber-100 text-amber-700",
  active: "bg-primary-100 text-primary-700",
  present: "bg-emerald-100 text-emerald-700",
  absent: "bg-red-100 text-red-700",
  late: "bg-amber-100 text-amber-700",
  enrolled: "bg-primary-100 text-primary-700",
  dropped: "bg-surface-100 text-surface-600",
  paid: "bg-emerald-100 text-emerald-700",
  partial: "bg-amber-100 text-amber-700",
  open: "bg-emerald-100 text-emerald-700",
  closed: "bg-surface-100 text-surface-600",
};

export function Badge({ variant = "active", children, className }: { variant?: keyof typeof variants; children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("badge-modern", variants[variant], className)}>
      {children}
    </span>
  );
}
