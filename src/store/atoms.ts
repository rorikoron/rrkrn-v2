import { atom } from "jotai";
type ExistLink = "home" | "about" | "archive" | "booth" | "contact"


const isHeaderOpenAtom = atom<boolean>(false);

export { type ExistLink, isHeaderOpenAtom};