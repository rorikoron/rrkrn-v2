import { Red_Hat_Display } from "next/font/google";
import HeaderListitem from "./HeaderListItem";
import HeaderTitle from "./HeaderTitle";
import BashWindow from "./BashWindow";
import { ExistLink } from "@/store/atoms";
import HeaderExplain from "./HeaderExplain";

const redHatDisplay = Red_Hat_Display({
    subsets: ["latin"],
});

interface LinksInterface {
    name: ExistLink;
    href: string;
}
export default function Header() {
    const links: LinksInterface[] = [
        { name: "home", href: "/" },
        { name: "about", href: "/about" },
        { name: "archive", href: "/archive" },
        { name: "booth", href: "/booth" },
        { name: "contact", href: "/contact" },
    ];

    return (
        <header
            className={`h-lvh px-6 py-12 bg-foreground text-accent tracking-widest flex flex-col gap-20 ${redHatDisplay.className} `}
        >
            <BashWindow
                className={"mx-12"}
                command="pwd"
                title={<HeaderTitle />}
                isUserActive
            />
            <div className="flex flex-col ">
                <BashWindow
                    command="cd"
                    className="ml-8 "
                    output={
                        <ul className="flex flex-col text-xl text-inactive py-4 overflow-hidden">
                            {links.map((link) => (
                                <HeaderListitem
                                    key={link.href}
                                    name={link.name}
                                    link={link.href}
                                />
                            ))}
                        </ul>
                    }
                />
                <BashWindow
                    className="ml-16 -mt-4 -mr-4 "
                    command="cat"
                    title={<span>&gt; Explain:</span>}
                    output={<HeaderExplain />}
                    isUserActive
                />
            </div>
        </header>
    );
}
