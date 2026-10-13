// ダークモードの保存先。値は "true" (ダーク) / "false" (ライト)。未保存なら OS の設定に従う
export const THEME_STORAGE_KEY = "rorikoron-toggle";

// 同じタブで保存先を書き換えたことを知らせるイベント ("storage" は他のタブでしか発火しないため)
export const THEME_CHANGE_EVENT = "rorikoron-theme-change";

export function prefersDark(): boolean {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved !== null) return saved === "true";
    return matchMedia("(prefers-color-scheme: dark)").matches;
}

/**
 * <head> で描画前に同期実行して、最初のペイントからテーマを合わせる。
 * React のハイドレーション後に .dark を付けると、一瞬ライトで描かれてちらつくため
 */
export const themeInitScript = `(function(){try{var s=localStorage.getItem(${JSON.stringify(
    THEME_STORAGE_KEY
)});var d=s===null?matchMedia("(prefers-color-scheme: dark)").matches:s==="true";document.documentElement.classList.toggle("dark",d)}catch(e){}})()`;
