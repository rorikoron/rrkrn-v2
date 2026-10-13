# rrkrn-v2

ろりころんの個人サイト [rorikoron.net](https://rorikoron.net) の第二版です。
ターミナル風のウィンドウとパステルピンクを軸にしたデザインで、自己紹介・VRChat の写真アーカイブ・Booth の商品一覧を載せています。

| ページ | 内容 |
| --- | --- |
| `/` | トップ。フレンドが撮ってくれた写真のプレイヤー |
| `/about` | 自己紹介と各種リンク |
| `/archive` | VRChat の写真を年ごとにマソンリーで表示 (`/archive#2025` で年を指定) |
| `/booth` | Booth の商品一覧 (`/booth#shader` のようにカテゴリを指定) |
| `/booth/[id]` | 商品の詳細 |
| `/api/items`, `/api/archive`, `/api/archive/:year` | 上のデータを JSON で返す API (Hono) |

## 技術スタック

- Next.js 16 (App Router) / React 19 / TypeScript
- Tailwind CSS v4 (設定は `src/app/styles/globals.css` の `@theme` に集約。`tailwind.config.js` は使わない)
- jotai (サイドバーの開閉、Booth の絞り込み状態)
- Hono (`src/app/api/[...route]/route.ts`)
- Cloudflare Workers にデプロイ ([OpenNext for Cloudflare](https://opennext.js.org/cloudflare))
  - D1 `BOOTH_ITEM_LIST`: Booth の商品とカテゴリ
  - R2 `ARCHIVE_BUCKET`: アーカイブ写真 (`archive.rorikoron.net` で公開)
  - R2 `NEXT_INC_CACHE_R2_BUCKET`: ISR のキャッシュ
  - Booth の商品画像は `booth.rorikoron.net` の R2 から直接配信

## 開発

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

`dev` / `build` / `test` の前に、次の2つが自動で走ります。

- `scripts/generate-picture-manifest.mjs`: `public/player` と `public/selfie` の一覧を `src/generated/pictureManifest.json` に書き出す (Workers にはファイルシステムがないため)
- `wrangler types`: バインディングの型 `cloudflare-env.d.ts` を生成

D1 と R2 は `wrangler.jsonc` で `remote: true` にしているので、ローカルでも本番のデータを読みます。Cloudflare にログインしておいてください (`pnpm exec wrangler login`)。

### コマンド

| コマンド | 内容 |
| --- | --- |
| `pnpm dev` | 開発サーバー (Turbopack) |
| `pnpm build` | Next.js の本番ビルド |
| `pnpm lint` | ESLint |
| `pnpm test` | Jest |
| `pnpm preview` | Workers のランタイムでビルドしてローカル確認 |
| `pnpm deploy` | ビルドして Cloudflare にデプロイ |

## キャッシュ

Workers Free の CPU 上限 (10ms / リクエスト) に収まるよう、なるべく Worker を通さない構成にしています。

- `/archive`, `/booth`, `/booth/[id]`: 1日ごとの ISR
- `/api/*`: 30日ごとの ISR (`dynamic = "force-static"`)
- `public/` の画像は圧縮済みの WebP を `unoptimized` でそのまま配信 (`/_next/image` を通さない)
- Booth 一覧のカードは `prefetch={false}` (一斉の先読みで CPU 上限を超えないように)

## ディレクトリ

```
src/
  app/                ルーティング。fonts.ts で書体をまとめて読み込む
    styles/           globals.css (カラートークン・テーマ) と部品ごとの scss
  components/
    client/           "use client" のコンポーネント
    ui/               サーバーでも描ける見た目だけの部品 (BashWindow, Icon など)
  data/               D1 / R2 / マニフェストからの取得 (サーバー専用)
  lib/                D1・R2 のクライアント、画像サイズの読み取り、テーマの初期化
  store/              jotai の atom と、それに付随する型・関数
  util.ts             クライアントからも使う純粋な関数
scripts/              ビルド前スクリプトと、アーカイブ画像の保守用スクリプト
public/               静的ファイル。svg/ の単色アイコンは <Icon> で currentColor に染める
```

## デザインのルール

- 色は `globals.css` のトークンだけを使う。ライト (`:root`) とダーク (`:root.dark`) で同じトークンを全部定義する
  - ピンクは `primary-wash` → `primary-soft` → `primary` → `primary-strong` の順に強くなる。いずれも塗り・線用で、上に載せる文字は `foreground`
  - ピンクや黄色の**文字**には `primary-ink` / `accent-ink` を使う (背景・面に対して WCAG AA の 4.5:1 以上)
- ダークモードは `<html>` の `.dark` クラスで切り替える。`<head>` のスクリプトが描画前に付けるので、読み込み時にちらつかない。保存がなければ OS の設定に従う
- 書体: 本文は M PLUS 1、ターミナル風の部分は Red Hat Mono (日本語は M PLUS 1 Code)。Tailwind の `font-sans` / `font-mono`
- 単色アイコンは `<Icon name="..." />` を使う (SVG をマスクにして `currentColor` で塗る)。色付きのロゴは `next/image`
- アイコンだけのボタン・リンクには `aria-label` を付け、アイコン自体は読み上げない
