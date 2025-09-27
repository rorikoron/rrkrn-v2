import HeaderTitle from "./HeaderTitle";
import BashWindow from "../ui/BashWindow";
import HeaderList, { LinksInterface } from "./HeaderList";

export default function Header() {
    const links: LinksInterface[] = [
        { name: "home", href: "/" },
        { name: "about", href: "/about" },
        { name: "archive", href: "/archive" },
        { name: "booth", href: "/booth" },
    ];

    return (
        <header
            className={`h-lvh px-2 py-12 bg-foreground text-accent tracking-widest flex flex-col gap-20`}
        >
            <BashWindow
                className={"mx-4"}
                command="pwd"
                title={<HeaderTitle />}
                isUserActive
            />

            <HeaderList links={links} />
            <div className="flex flex-col "></div>
        </header>
    );
}
