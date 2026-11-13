import BashWindow from "@/components/ui/BashWindow";
import ContactForm from "@/components/client/ContactForm";

export default function Contact() {
    return (
        <div className="h-full pl-6 md:pl-10 overflow-y-hidden">
            <main className="h-full">
                {/* ページ内スクロールを出さないよう、ウィンドウを画面の高さに収めて本文欄で余りを埋める。
                    それでも入らない低い画面のときだけ、送信ボタンが隠れないようスクロールさせる */}
                <BashWindow
                    className="h-full max-h-full!"
                    command="mail"
                    title={<h1 className="pl-4">&gt; お問い合わせはこちら</h1>}
                >
                    <div className="min-h-0 flex-1 flex flex-col pt-4 pr-2 max-w-3xl overflow-y-auto">
                        <p>&gt; ご連絡はこちらからどうぞ。すぐ返します。</p>
                        <ContactForm />
                    </div>
                </BashWindow>
            </main>
        </div>
    );
}
