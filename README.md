# 阅读笔记博客

基于 [Hexo](https://hexo.io/) 框架搭建的个人读书笔记博客，使用 [NexT](https://theme-next.js.org/) 主题。

## 快速开始

### 环境要求

- Node.js >= 20
- npm >= 10

### 安装依赖

```bash
npm install
```

### 本地预览

```bash
npx hexo server
```

访问 http://localhost:4000 查看博客。

### 新建读书笔记

```bash
npx hexo new reading-note "书名-读书笔记"
```

这将使用 `scaffolds/reading-note.md` 模板创建一篇新的读书笔记。

### 新建普通文章

```bash
npx hexo new "文章标题"
```

### 生成静态文件

```bash
npx hexo generate
```

### 清理缓存

```bash
npx hexo clean
```

## 目录结构

```
.
├── _config.yml          # 站点配置
├── _config.next.yml     # NexT 主题配置
├── scaffolds/           # 文章模板
│   ├── draft.md
│   ├── page.md
│   ├── post.md
│   └── reading-note.md  # 读书笔记模板
├── source/
│   ├── _posts/          # 文章目录
│   ├── about/           # 关于页面
│   ├── categories/      # 分类页面
│   ├── tags/            # 标签页面
│   └── images/          # 图片资源
└── themes/              # 主题目录
```

## 分类体系

- **文学** — 小说、散文、诗歌
- **技术** — 计算机科学、软件工程
- **哲学** — 东西方哲学思想
- **历史** — 文明史、人物传记
- **科普** — 自然科学、社会科学

## 部署

### GitHub Pages

1. 安装部署插件：
   ```bash
   npm install hexo-deployer-git --save
   ```

2. 在 `_config.yml` 中配置：
   ```yaml
   deploy:
     type: git
     repo: https://github.com/username/username.github.io
     branch: main
   ```

3. 执行部署：
   ```bash
   npx hexo deploy
   ```

## License

内容采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 许可协议。
