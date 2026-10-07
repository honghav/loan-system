export default function formatCurrency(val?: number): string {
    if (val === undefined || val === null) return "$0.00";
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    }).format(val);
}