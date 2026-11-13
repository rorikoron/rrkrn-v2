"use client";

import clsx from "clsx";
import { useActionState } from "react";
import { sendContact, type ContactState } from "@/app/contact/actions";
import { CONTACT_LIMITS, HONEYPOT_FIELD } from "@/lib/contact";

const initialState: ContactState = { status: "idle" };

const inputClass = clsx(
    "w-full bg-background border-2 border-foreground px-3 py-2 text-foreground",
    "focus:outline-none focus:border-primary-ink transition-colors",
    "aria-invalid:border-primary-ink"
);

export default function ContactForm() {
    const [state, formAction, pending] = useActionState(sendContact, initialState);

    if (state.status === "success") {
        return (
            <div role="status" className="py-4">
                <p>&gt; 送信しました！ありがとうございます。</p>
                <p>&gt; お返事はメールでお送りします。</p>
            </div>
        );
    }

    return (
        <form action={formAction} className="min-h-0 flex-1 flex flex-col gap-3 pt-3 pb-1" noValidate>
            <div className="grid gap-3 md:grid-cols-2">
                <Field
                    id="name"
                    label="name"
                    hint="お名前"
                    error={state.errors?.name}
                >
                    <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        maxLength={CONTACT_LIMITS.name}
                        defaultValue={state.values?.name}
                        aria-invalid={!!state.errors?.name}
                        aria-describedby={state.errors?.name ? "name-error" : undefined}
                        className={inputClass}
                    />
                </Field>

                <Field
                    id="email"
                    label="email"
                    hint="返信先のメールアドレス"
                    error={state.errors?.email}
                >
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        maxLength={CONTACT_LIMITS.email}
                        defaultValue={state.values?.email}
                        aria-invalid={!!state.errors?.email}
                        aria-describedby={state.errors?.email ? "email-error" : undefined}
                        className={inputClass}
                    />
                </Field>
            </div>

            <Field
                id="message"
                grow
                label="message"
                hint={`本文 (${CONTACT_LIMITS.message}文字まで)`}
                error={state.errors?.message}
            >
                <textarea
                    id="message"
                    name="message"
                    required
                    maxLength={CONTACT_LIMITS.message}
                    defaultValue={state.values?.message}
                    aria-invalid={!!state.errors?.message}
                    aria-describedby={state.errors?.message ? "message-error" : undefined}
                    className={clsx(inputClass, "flex-1 min-h-24 resize-none")}
                />
            </Field>

            {/* bot よけ。人には見えず、Tab でも入らない */}
            <div aria-hidden className="absolute -left-[9999px] size-px overflow-hidden">
                <label htmlFor={HONEYPOT_FIELD}>空のままにしてください</label>
                <input
                    id={HONEYPOT_FIELD}
                    name={HONEYPOT_FIELD}
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                />
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <button
                    type="submit"
                    disabled={pending}
                    className={clsx(
                        "bg-primary px-8 py-3 cursor-pointer transition-all",
                        "hover:bg-foreground hover:text-surface",
                        "disabled:opacity-60 disabled:cursor-wait"
                    )}
                >
                    {pending ? "送信中..." : "送信する"}
                </button>
                <p aria-live="polite" className="text-primary-ink font-bold">
                    {state.status === "error" && state.message}
                </p>
                <p className="text-sm text-muted">
                    &gt; メールアドレスはお返事以外には使いません。
                </p>
            </div>
        </form>
    );
}

function Field({
    id,
    label,
    hint,
    error,
    grow,
    children,
}: {
    id: string;
    label: string;
    hint: string;
    error?: string;
    /** 残りの高さを埋める (本文欄用) */
    grow?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div className={clsx("flex flex-col gap-1", grow && "min-h-0 flex-1")}>
            <label htmlFor={id}>
                &gt; {label}: <span className="text-sm text-muted">{hint}</span>
            </label>
            {children}
            {error && (
                <p id={`${id}-error`} className="text-sm text-primary-ink font-bold">
                    ! {error}
                </p>
            )}
        </div>
    );
}
