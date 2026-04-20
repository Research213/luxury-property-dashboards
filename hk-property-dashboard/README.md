# 🇭🇰 香港房产数据看板 - 使用说明

## 📦 打包分享指南

### 问题说明
如果直接将单个 HTML 文件分享给别人，**页面跳转功能会失效**（如"全球总览"按钮无法打开）。这是因为：
- 相对路径 (`../global-dashboard/index.html`) 在单独文件中无法解析
- 文件协议 (`file://`) 下浏览器安全限制

### ✅ 正确的打包方式

**必须将整个 workspace 文件夹一起打包**，保持目录结构：

```
workspace/
├── hk-property-dashboard/
│   ├── index.html          ← 香港看板
│   └── README.md
├── global-dashboard/
│   └── index.html          ← 全球总览看板
├── london-property-dashboard/
│   └── index.html
├── sf-bay-property-dashboard/
│   └── index.html
├── new-york-property-dashboard/
│   └── index.html
├── la-property-dashboard/
│   └── index.html
└── tokyo-property-dashboard/
    └── index.html
```

### 📋 打包步骤

1. **完整打包**（推荐）
   ```bash
   cd /Users/landz/.openclaw
   zip -r property-dashboards.zip workspace/
   ```

2. **仅打包香港 + 全球**（最小可用）
   ```bash
   cd /Users/landz/.openclaw/workspace
   zip -r hk-global.zip hk-property-dashboard/ global-dashboard/
   ```

3. **打包全部城市**
   ```bash
   cd /Users/landz/.openclaw/workspace
   zip -r all-cities.zip */index.html */README.md
   ```

### ⚠️ 注意事项

| ❌ 错误做法 | ✅ 正确做法 |
|------------|------------|
| 只发送单个 index.html | 发送完整文件夹 |
| 修改文件名 | 保持原有目录结构 |
| 通过微信直接发送 HTML | 打包成 zip 后发送 |

### 🔧 如果已经单独发送了文件

接收方需要：
1. 下载所有城市的看板文件
2. 放在同一父文件夹下
3. 保持 `城市名-property-dashboard/` 的文件夹命名

---

## 📊 汇率数据说明

### 数据源
- **来源**: CFETS 中国外汇交易中心 (www.chinamoney.com.cn)
- **类型**: 月末最后一个交易日中间价
- **更新频率**: 每月更新

### 当前汇率
- **2026 年 3 月末**: 1 HKD = 0.878 CNY
- **2026 年 4 月最新**: 1 HKD ≈ 0.872 CNY (4 月 14 日低点)

### 历史对比
| 时间 | HKD/CNY | 说明 |
|------|---------|------|
| 2023 年 | 0.99 | 基准年 |
| 2025 年 4 月 | 0.947 | 高点 |
| 2025 年 12 月 | 0.899 | 低点 |
| 2026 年 3 月 | 0.878 | 当前 |

---

## 🌐 使用方式

### 方式 1：本地打开（推荐）
```bash
open hk-property-dashboard/index.html
```

### 方式 2：HTTP 服务器
```bash
cd hk-property-dashboard
python3 -m http.server 8080
# 浏览器访问 http://localhost:8080
```

### 方式 3：VS Code Live Server
1. 安装 Live Server 插件
2. 右键 index.html → Open with Live Server

---

## 📞 技术支持

如有问题，联系豪宅研究院技术团队。
