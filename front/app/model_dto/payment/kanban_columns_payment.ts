import { PaymentStatus } from "./enum_payment";
export const statusTabs = [
    { label: "All Schedules", value: "ALL" },
    { label: "Pending", value: "PENDING" },
    { label: "Paid", value: "PAID" },
    { label: "Overdue", value: "OVERDUE" },
    { label: "Cancelled", value: "CANCELLED" },
];

export const kanbanColumns = [
    {
        status: PaymentStatus.PENDING,
        title: "Pending",
        headerClass: "bg-amber-50/60 dark:bg-amber-950/20 border-t-amber-500",
        badgeClass:
            "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800",
        icon: "i-lucide-clock",
        iconColor: "text-amber-500",
    },
    {
        status: PaymentStatus.PAID,
        title: "Paid / Settled",
        headerClass: "bg-emerald-50/60 dark:bg-emerald-950/20 border-t-emerald-500",
        badgeClass:
            "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800",
        icon: "i-lucide-check-circle-2",
        iconColor: "text-emerald-500",
    },
    {
        status: PaymentStatus.OVERDUE,
        title: "Overdue",
        headerClass: "bg-rose-50/60 dark:bg-rose-950/20 border-t-rose-500",
        badgeClass:
            "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800",
        icon: "i-lucide-alert-triangle",
        iconColor: "text-rose-500",
    },
    {
        status: PaymentStatus.CANCELLED,
        title: "Cancelled",
        headerClass:
            "bg-neutral-100/60 dark:bg-neutral-800/40 border-t-neutral-400",
        badgeClass:
            "bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700",
        icon: "i-lucide-ban",
        iconColor: "text-neutral-400",
    },
];