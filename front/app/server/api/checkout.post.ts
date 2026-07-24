// 1. Explicitly import h3 utilities to safeguard the custom server directory layout
import { defineEventHandler, readBody, createError } from "h3";
import crypto from "crypto";

// 2. Import the Bakong core elements
// @ts-ignore
import { BakongKHQR, khqrData } from "bakong-khqr";

interface CheckoutBody {
  orderId: string;
  amount: number;
  currencyType: "USD" | "KHR";
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<CheckoutBody>(event);

    if (!body || !body.orderId || !body.amount || !body.currencyType) {
      throw createError({
        statusCode: 400,
        statusMessage:
          "Missing required checkout values (orderId, amount, currencyType)",
      });
    }

    // 3. Setup merchant values mapping to official schema definitions
    // currency code mapping: USD = 840, KHR = 116
    const chosenCurrency = body.currencyType === "USD" ? 840 : 116;
    const tenMinutesFromNow = Date.now() + 10 * 60 * 1000;
    const individualInfo = {
      // Chantha Choeurn
      bakongAccountID: "leang_honghav@bkrt",
      merchantName: "PAPA FOOD",
      merchantCity: "Phnom Penh",
      amount: parseFloat(body.amount.toString()),
      currency: chosenCurrency,
      expirationTimestamp: tenMinutesFromNow,
    };

    // 4. INSTANTIATE the class cleanly inside the event runtime environment
    const khqr = new BakongKHQR();
    const khqrResult: any = khqr.generateIndividual(individualInfo);

    // Check if generation returned an expected outcome structure
    if (!khqrResult || !khqrResult.data || !khqrResult.data.qr) {
      throw createError({
        statusCode: 500,
        statusMessage:
          khqrResult?.status?.message ||
          "Bakong string compilation sequence failed",
      });
    }

    const qrString = khqrResult.data.qr;

    // 5. Generate the lookup MD5 hash securely out of the EMVCo string code
    const md5Hash = crypto.createHash("md5").update(qrString).digest("hex");

    // Optional: Save your 'PENDING' state to your DB platform here...

    return {
      success: true,
      md5: md5Hash,
      qrString: qrString,
    };
  } catch (error: any) {
    // Forward the error smoothly to prevent a complete gateway node failure
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage || error.message || "Internal Server Exception",
    });
  }
});
