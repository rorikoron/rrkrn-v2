"use client";
import { useEffect } from "react";

/**
 * Reactは「rootや一部の名前付き要素を隠す」ために、
 * `::view-transition-group(...)` / `::view-transition` に duration:0 / fill:forwards のアニメーション
 * (opacity:0 等) を付けるが、遷移が終わっても document に残り続ける。
 * 残ったままだと、以降のView Transitionでroot(サイドバー・h1など)が opacity:0 のままになり、
 * 名前付きの要素以外が丸ごと表示されなくなる。ので、遷移の前後で取り除く。
 */
function cancelStaleTransitionAnimations() {
    for (const animation of document.getAnimations()) {
        const effect = animation.effect as KeyframeEffect | null;
        if (
            effect?.pseudoElement?.startsWith("::view-transition") &&
            animation.playState === "finished" &&
            effect.getTiming().duration === 0
        ) {
            animation.cancel();
        }
    }
}

export default function ViewTransitionCleanup() {
    useEffect(() => {
        if (typeof document.startViewTransition !== "function") return;

        const original = document.startViewTransition;
        document.startViewTransition = function (
            this: Document,
            ...args: Parameters<Document["startViewTransition"]>
        ) {
            cancelStaleTransitionAnimations();
            const transition = original.apply(this, args);
            transition.finished.then(
                cancelStaleTransitionAnimations,
                cancelStaleTransitionAnimations
            );
            return transition;
        };
        return () => {
            document.startViewTransition = original;
        };
    }, []);

    return null;
}
