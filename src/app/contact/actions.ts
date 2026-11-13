"use server";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
    buildDiscordPayload,
    parseContactForm,
    type ContactErrors,
    type ContactValues,
} from "@/lib/contact";

export interface ContactState {
    status: "idle" | "success" | "error";
    message?: string;
    errors?: ContactErrors;
    // 送信後に React がフォームをリセットするので、失敗したときは入力を返して戻す
    values?: ContactValues;
}

export async function sendContact(
    _prev: ContactState,
    formData: FormData
): Promise<ContactState> {
    const parsed = parseContactForm(formData);
    if (parsed.ok === "spam") return { status: "success" };
    if (!parsed.ok) {
        return {
            status: "error",
            message: "入力を確認してください",
            errors: parsed.errors,
            values: parsed.values,
        };
    }

    // Webhook の URL は秘密なので wrangler.jsonc には書かず、secret (ローカルは .dev.vars) で渡す
    const { env } = await getCloudflareContext({ async: true });
    const webhookUrl = (env as CloudflareEnv & { DISCORD_WEBHOOK_URL?: string })
        .DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
        console.error("DISCORD_WEBHOOK_URL is not set");
        return failed(parsed.values);
    }

    try {
        const res = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(buildDiscordPayload(parsed.values)),
        });
        if (!res.ok) {
            console.error(`Discord webhook failed: ${res.status} ${await res.text()}`);
            return failed(parsed.values);
        }
    } catch (err) {
        console.error("Discord webhook failed:", err);
        return failed(parsed.values);
    }

    return { status: "success" };
}

function failed(values: ContactValues): ContactState {
    return {
        status: "error",
        message: "送信に失敗しました。時間をおいてもう一度試してください",
        values,
    };
}
