import { buildDiscordPayload, CONTACT_LIMITS, HONEYPOT_FIELD, parseContactForm } from "@/lib/contact";

function form(fields: Record<string, string>) {
    const data = new FormData();
    for (const [key, value] of Object.entries(fields)) data.set(key, value);
    return data;
}

const valid = { name: "ころん", email: "koron@example.com", message: "こんにちは" };

describe("parseContactForm", () => {
    it("accepts a filled-in form and trims whitespace", () => {
        expect(parseContactForm(form({ ...valid, name: "  ころん  " }))).toEqual({
            ok: true,
            values: valid,
        });
    });

    it("treats a filled honeypot as spam", () => {
        expect(parseContactForm(form({ ...valid, [HONEYPOT_FIELD]: "https://spam" }))).toEqual({
            ok: "spam",
        });
    });

    it("reports every missing field and returns what was typed", () => {
        const result = parseContactForm(form({ name: "ころん" }));
        expect(result.ok).toBe(false);
        if (result.ok !== false) return;
        expect(Object.keys(result.errors).sort()).toEqual(["email", "message"]);
        expect(result.values.name).toBe("ころん");
    });

    it("rejects a malformed email", () => {
        const result = parseContactForm(form({ ...valid, email: "koron@example" }));
        expect(result.ok === false && result.errors.email).toBeTruthy();
    });

    it("rejects a message over the limit", () => {
        const result = parseContactForm(
            form({ ...valid, message: "あ".repeat(CONTACT_LIMITS.message + 1) })
        );
        expect(result.ok === false && result.errors.message).toBeTruthy();
    });
});

describe("buildDiscordPayload", () => {
    it("disables all mentions so the message cannot ping anyone", () => {
        const payload = buildDiscordPayload({ ...valid, message: "@everyone" });
        expect(payload.allowed_mentions).toEqual({ parse: [] });
        expect(payload.embeds[0].description).toBe("@everyone");
    });
});
