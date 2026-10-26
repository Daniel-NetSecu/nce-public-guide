# 新概念 · 学习花园（非官方）

无依赖、手机友好的静态学习辅助站；不是教材镜像。

## 实际覆盖
- 三册目录共 204 课：第二册 96、第三册 60、第四册 48。
- 原创基础包 **12 课**：每册第 1–4 课；36 条词汇讲解及原创例句，24 道原创练习及折叠答案。
- 其余 **192 课明确标记待编**；已完成只指基础包，不代表全课精讲。
- 原创词汇含相关拓展，并非逐课完整生词表。通用三步法不计入完成数。

## 本地验证
需要 Node.js 22 或以上，无 npm 依赖。

    node scripts/test.mjs
    node scripts/serve.mjs

然后访问终端给出的本地预览地址。不能直接双击 HTML（JSON 需要 HTTP）。

## 文件与发布边界
Pages 产物 allowlist：public/index.html、public/style.css、public/app.js、public/catalog.json、public/content.json、public/link-evidence.json。测试拒绝 public 内额外文件、目录、符号链接和常见隐私标记。
新公开仓库提交 allowlist：以上 6 文件，加 README.md、AGENTS.md、.gitignore、scripts/test.mjs、scripts/serve.mjs、scripts/prepare.mjs、.github/workflows/pages.yml。不要复制其他目录或既有 Git 历史。

## 外链核验
从用户指定的 https://www.bubeijuzi.com/nce/3 读取目录，发现实际导航中的第二册、第四册目录，再读取这两个目录。三个目录均 HTTP 200；从其实际 href 提取 204 条对应课文链接。没有请求逐课正文；不能把“目录发现链接”称作“逐课原文验证通过”。记录及 UTC 时间在 public/link-evidence.json。第三方授权状态未经确认，本站不托管、缓存或代理其正文。

## 原创与版权
课号及标题仅为识别教材课程而保留。讲解、例句、题目、答案均为本次独立创作，不来自教材原句或讲义释义；不提供全文、全文改写、译文、媒体或下载包。网站页脚有非官方及权利声明。自动扫描不能证明版权安全：发布前必须人工审阅 public/content.json、public/catalog.json、public/index.html 和外链记录。不要把自动测试称为法律审查。

## 设计与复用评估
检查了既有静态页面的目录/主面板布局，可复用这种无依赖交互模式，但未复制其脚本、样式、课文或媒体。原生 HTML details、CSS 响应式布局和 DOM API 足够，不引入外部主题、CDN、分析或依赖。

## GitHub Pages 部署（由主会话执行）
1. 人工审阅上述文件；确认只在全新公开仓库初始化新的历史。
2. 按提交 allowlist 添加文件，默认分支 main；不要关联或修改其他仓库。
3. Repository Settings → Pages → Source 选择 GitHub Actions。
4. 推送后 pages.yml 先执行测试，仅打包 public，独立 deploy job 使用 pages:write / id-token:write。
5. 检查 Actions 成功及 Pages URL；在真实手机和桌面验证搜索、切册、前后课、答案展开、外链。相对资源路径兼容项目子路径。

此目录没有创建远端或推送。维护联系可通过新仓库 Issues；公开前应启用 Issues。
