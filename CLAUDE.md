# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目性质

Hexo 8 静态博客（读书笔记站），NexT 8 主题。仓库内容主要是 Markdown 文章 + YAML 配置，自定义代码只有 `scripts/` 下的 Hexo 插件和 `source/_data/` 下的主题定制文件。没有测试、没有 lint、没有构建脚本以外的工具链。

## 常用命令

```bash
npm install                              # 安装依赖（含主题）
npx hexo server                          # 本地预览 http://localhost:4000
npm run build                            # = hexo generate，输出到 public/
npm run clean                            # = hexo clean，清 db.json 和 public/
npx hexo new reading-note "书名-读书笔记"  # 用 scaffolds/reading-note.md 建笔记
npx hexo new "标题"                       # 普通文章（scaffolds/post.md）
```

改配置或换主题后若预览异常，先 `npm run clean` 再 server —— Hexo 的 `db.json` 缓存不会自动失效。

本机访问 `registry.npmjs.org` 会 ECONNRESET，装新包需要走镜像：`npm install <pkg> --registry=https://registry.npmmirror.com`。**装完必须把 `package-lock.json` 里的 `registry.npmmirror.com` 全量替换回 `registry.npmjs.org`**，否则 GitHub Actions 的 CI 会依赖国内镜像。tarball 内容一致，integrity 哈希不变，替换是安全的。

## 关键结构与约定

**主题通过 npm 安装，不在 `themes/` 下。** `themes/` 只有 `.gitkeep`；`hexo-theme-next` 是 package.json 依赖。因此主题配置写在仓库根的 `_config.next.yml`（Hexo 的 alternate theme config 机制，文件名必须是 `_config.<theme>.yml`），**不要**去改 `node_modules/hexo-theme-next/` 里的任何文件——那些改动不会被提交，且 `npm install` 会覆盖。

**NexT 的页面类型用 `type:`，不是 `layout:`。** `source/categories/index.md` 是 `type: "categories"`，tags 页是 `type: "tags"`，about 页是 `type: "about"`。这三个 md 的正文是空的，页面内容全靠主题按 `type` 生成——换主题时这里必然要改（如 Icarus 用的是 `layout:`），写错不会报错，只会渲染出空白正文。

**头像**：`source/images/avatar.jpg`，由 `_config.next.yml` 的 `avatar.url: /images/avatar.jpg` 引用。侧栏受 `sidebar.display: post` 控制。注意 NexT 模板里的 class 是 `site-author-image`，grep `avatar` 找不到 img 标签。

**读书笔记的自定义 front-matter。** `scaffolds/reading-note.md` 定义了 `book:`（title/author/publisher/year/isbn）、`rating`、`excerpt` 这些非 Hexo/NexT 标准字段。当前没有模板消费它们，它们只是结构化元数据。要渲染它们需要用 NexT 的 injector 机制或把主题 clone 进 `themes/next/`。

**打赏**：`_config.next.yml` 的 `reward_settings`/`reward` 控制文章底部的内置打赏块（位置写死在主题模板里，提示语来自 `source/_data/languages.yml` 覆盖的语言包，`reward_settings.comment` 只被下面的自定义标签使用）。需要在正文中间放打赏时写 `{% reward %}`（`scripts/reward.js`，样式在 `source/_data/styles.styl`，经 `custom_file_path.style` 引入）。该标签用 `<details>` 展开，因为 NexT 的 JS 只绑定页面上第一个 `.reward-container button`——不要把它改成 button。「法古矜今」书单的笔记约定在 `## 三、原文与译文` 前放一个 `{% reward %}`。

**阅读量**：`busuanzi_count` 负责渲染占位元素，计数脚本由 `vendors.busuanzi` 换成了 Vercount（events.vercount.one，兼容不蒜子元素 ID）。不蒜子官方接口 2026-10 实测超时/502，数字取不到时 NexT 会把整块隐藏，表现为"看不到阅读量"。

**SEO**：主题的 `open_graph` 已关闭，改由 `source/_data/head.njk`（`custom_file_path.head` 注入）按页面输出 description / keywords / OG / JSON-LD（文章是 BlogPosting + `about: Book`，取自 `book:` 字段）。每篇用 front-matter 的 `seo_description`（80~150 字）和 `keywords` 控制；**不要用 `description` 字段**——NexT 会把它显示在标题下并替换首页摘要。`updated:` 显式写上，否则 `updated_option: mtime` 在 CI 里每次部署都会变。该模板开头的 `{% if open_graph %}` 守卫不能删：Hexo 的 data 处理器会在没有 helper 的上下文里预渲染 `_data/*.njk`，删了会报 `Unable to call full_url_for`。sitemap 由 `hexo-generator-sitemap` 生成（`/reading/sitemap.xml`），`pretty_urls.trailing_index: false` 是为了让 sitemap/og:url 与 canonical 一致。

**「法古矜今」每日一卷**：第二期起按卷/篇拆书，每天一篇。计划与进度表在 `source/booklists/fagu-jinjin/plan/index.md`（目录形式是为了得到 `/plan/` 而非 `plan.html`），笔记放 `source/_posts/法古矜今/<书名>/<书名>-<单元>-读书笔记.md`，用 `scaffolds/daily-note.md`（`npx hexo new daily-note ...`）。三段固定：金字塔总结 → 分篇详解与古今故事 → 原文与译文；原文取维基文库 `action=raw` 再繁转简。写完要同步改计划表那一行和书单首页的进度。

**文章正文用 `<!-- more -->` 截断首页摘要**（见 `source/_posts/sapiens-reading-note.md`）。

**分类体系是固定的五类**：文学 / 技术 / 哲学 / 历史 / 科普。新笔记的 `categories` 应从中选，不要新造。

**`post_asset_folder: true`**：每篇文章可以有同名资源目录存放图片，用相对路径引用。

## 部署

存在两条路径，**以 GitHub Actions 为准**：

- `.github/workflows/pages.yml` — push 到 `main` 触发，`npm install && npm run build`，用 `upload-pages-artifact` + `deploy-pages` 部署 `public/`。日常只需要提交推送 main。
- `_config.yml` 的 `deploy:` 段（`hexo-deployer-git` → `gh-pages` 分支）是遗留的手动路径，`npm run deploy` 才会走。两者同时使用会互相覆盖。

站点是 **project site**，线上地址 https://susntones.github.io/reading/ 。`_config.yml` 未显式设置 `root`，但 Hexo 会从 `url` 的路径部分推导出 `root: /reading/`，生成的资源和文章链接都带该前缀（已实测）。**因此本地预览要访问 http://localhost:4000/reading/ ，不是 http://localhost:4000/** （后者会 302）。改动 `url` 时注意这个连带影响。

`public/`、`db.json`、`node_modules/` 均已 gitignore，不要提交产物。
