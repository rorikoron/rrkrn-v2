export const CONTACT_LIMITS = {
    name: 50,
    email: 254,
    // Discord の embed description は 4096 文字まで
    message: 2000,
} as const;

export interface ContactValues {
    name: string;
    email: string;
    message: string;
}

export type ContactErrors = Partial<Record<keyof ContactValues, string>>;

export type ContactParseResult =
    | { ok: true; values: ContactValues }
    | { ok: false; values: ContactValues; errors: ContactErrors }
    // botが隠し欄を埋めてきた。送ったふりをして捨てる
    | { ok: "spam" };

/** bot よけの隠し欄。人には見えないので、ここに何か入っていたら bot */
export const HONEYPOT_FIELD = "website";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(formData: FormData, key: string) {
    const value = formData.get(key);
    return typeof value === "string" ? value.trim() : "";
}

export function parseContactForm(formData: FormData): ContactParseResult {
    if (text(formData, HONEYPOT_FIELD)) return { ok: "spam" };

    const values: ContactValues = {
        name: text(formData, "name"),
        email: text(formData, "email"),
        message: text(formData, "message"),
    };

    const errors: ContactErrors = {};
    if (!values.name) errors.name = "お名前を入れてください";
    else if (values.name.length > CONTACT_LIMITS.name)
        errors.name = `お名前は${CONTACT_LIMITS.name}文字までです`;

    if (!values.email) errors.email = "返信先のメールアドレスを入れてください";
    else if (values.email.length > CONTACT_LIMITS.email || !EMAIL_PATTERN.test(values.email))
        errors.email = "メールアドレスの形が正しくないみたいです";

    if (!values.message) errors.message = "本文を入れてください";
    else if (values.message.length > CONTACT_LIMITS.message)
        errors.message = `本文は${CONTACT_LIMITS.message}文字までです`;

    return Object.keys(errors).length ? { ok: false, values, errors } : { ok: true, values };
}

/** Discord Webhook に送る中身。本文に @everyone などが入っていてもメンションが飛ばないようにする */
export function buildDiscordPayload({ name, email, message }: ContactValues) {
    return {
        username: "rrkrn contact",
        allowed_mentions: { parse: [] },
        embeds: [
            {
                title: "お問い合わせが届きました",
                description: message,
                color: 0xff8181,
                fields: [
                    { name: "お名前", value: name, inline: true },
                    { name: "メール", value: email, inline: true },
                ],
                timestamp: new Date().toISOString(),
            },
        ],
    };
}
