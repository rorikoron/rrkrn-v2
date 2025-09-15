import BashWindow from "@/components/BashWindow";
import { unstable_ViewTransition as ViewTransition } from "react";
import Image from "next/image";

export default function Home() {
    return (
        <div className="h-full">
            <main className="h-full grid grid-rows-[4fr_6fr]">
                <div className="flex flex-col justify-center">
                    <h1 className="text-[128px] leading-none">Rorikoron</h1>

                    <h4 className="leading-none pl-2 mb-10">
                        創作が好きです。
                    </h4>
                </div>

                <div className="pl-2 w-[70%]">
                    <ViewTransition name="IntroduceWindow">
                        <BashWindow
                            command="whoami"
                            output={<div>hello?</div>}
                        />
                    </ViewTransition>{" "}
                </div>
            </main>
        </div>
    );
}
