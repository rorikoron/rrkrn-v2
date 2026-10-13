import { M_PLUS_1, M_PLUS_1_Code, Red_Hat_Mono } from "next/font/google";

// 書体はここで一度だけ読み込み、CSS 変数として globals.css の --font-sans / --font-mono に渡す。
// subsets は preload する範囲。日本語のグリフも unicode-range 付きで自前配信されるので、表示には使える

/** 本文。和欧とも M PLUS 1 */
export const mplus1 = M_PLUS_1({
    subsets: ["latin"],
    variable: "--font-mplus-1",
});

/** ターミナル風のところの英数字 */
export const redHatMono = Red_Hat_Mono({
    subsets: ["latin"],
    variable: "--font-red-hat-mono",
});

/** Red Hat Mono に無い日本語を、同じ M PLUS 系の等幅で受ける */
export const mplus1Code = M_PLUS_1_Code({
    subsets: ["latin"],
    variable: "--font-mplus-1-code",
    preload: false,
});

export const fontVariables = [
    mplus1.variable,
    redHatMono.variable,
    mplus1Code.variable,
].join(" ");
