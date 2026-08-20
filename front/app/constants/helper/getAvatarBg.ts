// Helper to assign stable background colors based on name
export default function getAvatarBg(name: string) {
    if (!name) return "bg-neutral-500 text-white";
    const colors = [
        "bg-red-500 text-white",
        "bg-orange-500 text-white",
        "bg-amber-500 text-white",
        "bg-emerald-500 text-white",
        "bg-teal-500 text-white",
        "bg-blue-500 text-white",
        "bg-indigo-500 text-white",
        "bg-violet-500 text-white",
        "bg-pink-500 text-white",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
}