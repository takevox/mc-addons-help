// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import { remarkKroki } from "remark-kroki";

// 図表のレンダリングに使う Kroki サーバー。既定はローカルの Docker コンテナ
const KROKI_SERVER = process.env.KROKI_SERVER ?? "http://localhost:8000";

// GitHub Pages（プロジェクトサイト）で公開するため、サイトはサブパス配下に置く
const BASE = "/mc-addons-help";

// 本文中の "/bookmark/" のようなルート相対リンクに BASE を付ける
function remarkBaseLinks() {
  const walk = (node) => {
    if (node.type === "link" && node.url.startsWith("/") && !node.url.startsWith("//")) {
      node.url = BASE + node.url;
    }
    node.children?.forEach(walk);
  };
  return walk;
}

export default defineConfig({
  site: "https://takevox.github.io",
  base: BASE,
  markdown: {
    remarkPlugins: [
      remarkBaseLinks,
      [
        remarkKroki,
        {
          server: KROKI_SERVER,
          // ```plantuml / ```graphviz のコードブロックを図として扱う
          alias: ["plantuml", "graphviz"],
          // <img class="kroki-image"> として埋め込む（ダークモード用の CSS を当てるため）
          output: "img-html-base64",
        },
      ],
    ],
  },
  integrations: [
    starlight({
      title: "mc-addons ヘルプ",
      description: "Minecraft 統合版アドオン群（mc-addons）の使い方ガイド",
      defaultLocale: "root",
      locales: {
        root: { label: "日本語", lang: "ja" },
      },
      customCss: ["./src/styles/custom.css"],
      sidebar: [
        { label: "はじめに", items: [{ autogenerate: { directory: "getting-started" } }] },
        { label: "ブックマーク", items: [{ autogenerate: { directory: "bookmark" } }] },
        { label: "拡張経験値システム", items: [{ autogenerate: { directory: "eeps" } }] },
        { label: "ソートスティック", items: [{ autogenerate: { directory: "sortstick" } }] },
        { label: "Enhanced Recipes", items: [{ autogenerate: { directory: "enhancedrecipes" } }] },
      ],
    }),
  ],
});
