import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

const cpSchema = z.object({
  email: z.string().email(),
  purpose: z.string().min(2),
  customMessage: z.string().optional(),
});

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip");

  if (forwarded) return forwarded.split(",")[0].trim();
  if (realIP) return realIP;
  if (cfConnectingIP) return cfConnectingIP;

  return "unknown";
}

function checkRateLimit(clientIP: string): {
  allowed: boolean;
  remaining: number;
} {
  const now = Date.now();
  const clientData = rateLimitStore.get(clientIP);

  if (!clientData || now > clientData.resetTime) {
    rateLimitStore.set(clientIP, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
  }

  if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  clientData.count++;
  rateLimitStore.set(clientIP, clientData);

  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX_REQUESTS - clientData.count,
  };
}

function escapeTelegramMarkdown(text: string): string {
  if (!text) return "";
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
}

async function sendToTelegram(data: {
  email: string;
  purpose: string;
  customMessage?: string;
}): Promise<boolean> {
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
  const telegramChatId = process.env.TELEGRAM_CHAT_ID;

  if (!telegramToken || !telegramChatId) {
    console.error("Telegram credentials not configured");
    return false;
  }

  const message = `
🧑‍💻 *New Coding Profile Enquiry*

📧 *Email:* ${escapeTelegramMarkdown(data.email.trim())}
❓ *Reason:* ${escapeTelegramMarkdown(data.purpose)}
${data.customMessage ? `\n💬 *Details:* \n${escapeTelegramMarkdown(data.customMessage.trim())}` : ""}

⏰ *Submitted:* ${new Date().toISOString()}
  `.trim();

  try {
    const telegramUrl = `https://api.telegram.org/bot${telegramToken}/sendMessage`;

    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("Error sending to Telegram:", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(clientIP);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const { email, purpose, customMessage } = await request.json();

    const validatedData = cpSchema.parse({
      email,
      purpose,
      customMessage,
    });

    const sent = await sendToTelegram(validatedData);

    if (!sent) {
      return NextResponse.json(
        { error: "Failed to send message. Please try again later." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Enquiry sent successfully!", success: true },
      {
        status: 200,
        headers: {
          "X-RateLimit-Limit": RATE_LIMIT_MAX_REQUESTS.toString(),
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
        },
      },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid form data", details: error.errors },
        { status: 400 },
      );
    }

    console.error("CP API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
