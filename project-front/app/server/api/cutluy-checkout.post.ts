import { defineEventHandler, readBody, createError } from "h3";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();

    try {
        const body = await readBody(event);

        const res = await fetch(config.public.cutluyUrl, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${config.public.cutluyToken || ""}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
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