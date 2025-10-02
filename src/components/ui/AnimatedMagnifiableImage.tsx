import { unstable_ViewTransition as ViewTransition } from "react";
import Image from "next/image";
import clsx from "clsx";

interface AnimatedMagnifiableImageInterface {
    src: string;
}
export default function AnimatedMagnifiableImage({
    src,
}: AnimatedMagnifiableImageInterface) {
    const filename = src.split("/").at(-1) ?? "Fetched image";

    return (
        <ViewTransition name={"picture-animated-" + filename}>
            <div
                key={src}
                className="group h-fit relative rounded overflow-hidden"
            >
                <Image
                    src={src}
                    alt={filename}
                    objectFit="cover"
                    placeholder="blur"
                    className="group-hover:brightness-60 transition-all w-full h-auto "
                    blurDataURL="/loading.png"
                    width={0}
                    height={0}
                    sizes="100%"
                    style={{
                        width: "100%",
                        height: "auto",
                    }}
                />
                <div
                    className={clsx(
                        "absolute bottom-0 right-0 py-0.5 px-2 text-accent invisible opacity-0 transition-all",
                        "group-hover:visible group-hover:opacity-100"
                    )}
                >
                    {filename.split("_")[1].replaceAll("-", "/")}
                </div>
            </div>
        </ViewTransition>
    );
}
