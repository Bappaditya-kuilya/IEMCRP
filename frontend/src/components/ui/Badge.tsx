import { cn } from "@/lib/utils";

const variants = {
  pass: "bg-green-100 text-green-800",
  fail: "bg-red-100 text-red-800",
  pending: "bg-amber-100 text-amber-800",
  active: "bg-blue-100 text-blue-800",
  present: "bg-green-100 text-green-800",
  absent: "bg-red-100 text-red-800",
  late: "bg-amber-100 text-amber-800",
};

export function Badge({ variant = "active", children, className }: { variant?: keyof typeof variants; children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", variants[variant], className)}>
      {children}
    </span>
  );
}
