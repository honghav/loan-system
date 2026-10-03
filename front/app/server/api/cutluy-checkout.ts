export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();

    try {
        const { id } = getQuery(event);

        const res = await fetch(`${config.public.cutluyUrl}/${id}`, {
            headers: {
                Authorization: `Bearer ${config.public.cutluyToken || ""}`,
                "Content-Type": "application/json",
            },
        });

        const payment = await res.json();
        return payment;
    } catch (error: any) {
        console.error("Cutluy connection issue:", error?.message || error);
        throw createError({
            statusCode: 500,
            statusMessage: error?.message || "Cutluy gateway connection error",
        });
    }
});
