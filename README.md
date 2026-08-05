# 撒欢地图 FamilySpots 🏞️

**全球亲子户外地点地图**——解决"周末带孩子去哪玩、安不安全"的痛点。社区共建的 UGC 地图，覆盖 **玩水 / 爬山 / 公园 / 乐园** 四类亲子户外地点，以家长视角提供结构化安全信息（风险等级、水深、流速、亲子友好度、设施等）。

> 定位：开源、免费、社区共有。数据归社区，服务可商业化（数据授权 / 资助捐赠），不对用户收费。

## ✨ 功能特性

- 🗺️ **全球地图**：Leaflet + OpenStreetMap，国内自动切换高德瓦片（GCJ-02 坐标自动转换），海外用 WGS-84
- 🌱 **永不空城**：加载即从 Overpass API 拉取视野内的公园/乐园/水域/山峰作为种子数据，平移防抖重载
- 🏷️ **多类别标注**：玩水 / 爬山 / 公园 / 乐园，含安全字段体系（风险等级、水深、流速、设施、亲子友好度）
- 🔍 **全球搜索**：Nominatim 地名检索 + 逆地理编码，打点自动识别地址
- 👥 **账号与 UGC**：邮箱注册登录（可选 Google/GitHub OAuth），登录后云端共享标注；游客只读
- 🛡️ **审核体系**：举报 + 版主审核页（`/moderate`），状态守卫触发器 + 写入限流（每小时 20 条）
- 🌐 **多语言**：中 / 英双语（vue-i18n），枚举以中性 code 存储、展示时翻译
- 📴 **PWA 离线**：安装到主屏，瓦片/OSM API/Supabase 数据三级缓存，户外无信号可回看
- 💾 **降级模式**：未配置 Supabase 时自动使用 localStorage，本地即可运行

## 🧱 技术栈

Vue 3 · Vite 5 · Vue Router 4 · Leaflet + OpenStreetMap · Supabase (PostgreSQL + RLS + Auth) · vue-i18n · vite-plugin-pwa

## 🚀 本地运行

```bash
npm install
npm run dev       # 开发
npm run build     # 生产构建（含 PWA）
npm run preview   # 预览构建产物
```

## 🔧 环境变量

复制 `.env.example` 为 `.env`（本地）或在部署平台配置：

| 变量 | 说明 | 必填 |
|------|------|------|
| `VITE_SUPABASE_URL` | Supabase 项目 URL | 要启用全球共享 UGC 时必填 |
| `VITE_SUPABASE_ANON_KEY` | Supabase 公开密钥（publishable/anon） | 同上 |
| `VITE_AMAP_TILE_URL` | 高德瓦片地址（国内显示用） | 否，留空走默认公共地址 |

未配置 Supabase 时应用自动降级为 localStorage 本地模式。

## 🗄️ 数据库

在 Supabase → SQL Editor 执行 [`supabase/schema.sql`](supabase/schema.sql) 完成建表与权限配置：
- `spots`：地点（RLS：任何人可读可见，登录用户可写，作者/版主可改删）
- `moderators`：版主白名单（客户端不可访问，仅 `is_moderator()` 内部函数判定）
- `reports`：举报（登录用户可提交）
- `write_log`：写入限流（每小时 20 条）
- 触发器：状态守卫（仅版主可下架）、写入限流

## 🤝 参与贡献

欢迎提交 PR 与 issue。本项目的差异化在于**家长验证过的安全数据**——任何一条带安全信息的标注都是宝贵贡献。

## ⚠️ 免责声明

地点信息由社区提供并经人工整理，可能存在偏差。户外活动安全第一，请以实地情况为准，家长需全程看护。本项目不对信息准确性负责。

## 📄 License

[MIT](LICENSE)
