import { defineEventHandler, getQuery, createError } from "h3";
import axios from "axios";

export default defineEventHandler(async (event) => {
  const { md5 } = getQuery(event);

  if (!md5 || typeof md5 !== "string") {
    throw createError({
      statusCode: 400,
      statusMessage: "MD5 hash query required",
    });
  }

  const BAKONG_API_URL = "https://api-bakong.nbc.gov.kh";
  const BEARER_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiMTI4YTAxNTM3N2FlNDE5ZiJ9LCJpYXQiOjE3ODQxODU0ODQsImV4cCI6MTc5MTk2MTQ4NH0.h-xQSEPNow0lc04MP--jImsjNhe6hWIGrCswCUeSUAw";

  try {
    const response = await axios.post(
      `${BAKONG_API_URL}/v1/check_transaction_by_md5`,
      { md5: md5 },
      {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
          "Content-Type": "application/json",
        },
        timeout: 5000, // 5-second connection limit
      },
    );

    const apiData = response.data;

    if (apiData.responseCode === 0) {
      return {
        data: apiData,
        status: "PAID",
        message: "Payment secured successfully",
      };
    }

    return {
      data: apiData,
      status: "PENDING",
      message: "Awaiting user verification",
    };
  } catch (error: any) {
    // --- FIX: Never log or throw the raw "error" object.
    // We only log the simple error message string to prevent circular references!
    console.error("Bakong connection issue:", error.message);

    // Safely structure our error response rather than forwarding the full Axios object
    return {
      status: "GATEWAY_DOWN",
      message:
        "Bakong sandbox is currently offline or returning an error. Retrying...",
    };
  }
});
