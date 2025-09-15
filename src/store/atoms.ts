import { atom } from "jotai";
type ExistLink = "home" | "about" | "archive" | "booth" | "contact"


const pathnameAtom = atom<string>("/");
const hoveredLinkAtom = atom<ExistLink | "">("");




export { type ExistLink, pathnameAtom, hoveredLinkAtom};
