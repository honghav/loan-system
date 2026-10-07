export default function getLoanStatusBadge(status?: string) {
    switch (status?.toLowerCase()) {
        case "completed":
        case "paid":
            return "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
        case "in_payment":
        case "in payment":
        case "active":
            return "bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800";
        default:
            return "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700";
    }
}