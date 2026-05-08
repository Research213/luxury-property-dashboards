# 🏛️ 豪宅研究院监控看板 - GitHub Pages 配置指南

## ✅ 已完成配置

### 1. GitHub 账号信息
| 项目 | 值 |
|------|-----|
| **用户名** | Research213 |
| **仓库** | luxury-property-dashboards |
| **仓库地址** | https://github.com/Research213/luxury-property-dashboards |
| **分支** | main |

### 2. 自动推送脚本
| 项目 | 值 |
|------|-----|
| **脚本路径** | `/Users/landz/.openclaw/workspace/scripts/github-auto-push.sh` |
| **执行权限** | ✅ 已设置 (chmod +x) |
| **日志文件** | `/Users/landz/.openclaw/workspace/logs/github-auto-push.log` |

### 3. Cron 定时任务
| 项目 | 值 |
|------|-----|
| **执行频率** | 每周一上午 9:00 (Asia/Shanghai) |
| **Cron 表达式** | `0 9 * * 1` |
| **状态** | ✅ 已激活 |

---

## 🔧 GitHub Pages 启用步骤

### 步骤 1：访问仓库设置
打开：https://github.com/Research213/luxury-property-dashboards/settings/pages

### 步骤 2：配置 Build and deployment
| 选项 | 选择 |
|------|------|
| **Source** | Deploy from a branch |
| **Branch** | `main` |
| **Folder** | `/ (root)` |

### 步骤 3：保存并等待部署
1. 点击 **Save**
2. 等待 1-2 分钟部署完成
3. 页面会显示：✅ Your site is live at...

### 步骤 4：访问报告
```
https://Research213.github.io/luxury-property-dashboards/skills/estate-strategy-monitor/reports/2026-W19-monitor-report.html
```

---

## 📁 文件结构

```
luxury-property-dashboards/
├── skills/
│   └── estate-strategy-monitor/
│       ├── SKILL.md                          # 监控技能配置
│       └── reports/
│           ├── 2026-W19-monitor-report.html  # HTML 报告（可分享）
│           └── 2026-W19-monitor-report.md    # Markdown 报告
├── scripts/
│   └── github-auto-push.sh                   # 自动推送脚本
└── logs/
    └── github-auto-push.log                  # 推送日志
```

---

## 🔄 自动推送逻辑

### 触发条件
- **定时触发**：每周一 9:00 AM
- **手动触发**：运行 `/Users/landz/.openclaw/workspace/scripts/github-auto-push.sh`

### 推送流程
```
1. 检查工作区变更
   ↓
2. git add -A（添加所有变更）
   ↓
3. git commit（自动标注周数）
   ↓
4. git push origin main
   ↓
5. GitHub Pages 自动重新部署
   ↓
6. 链接保持不变，内容更新
```

### 日志查看
```bash
# 查看推送日志
tail -f /Users/landz/.openclaw/workspace/logs/github-auto-push.log
```

---

## 📧 报告分享

### 固定链接（启用 Pages 后）
```
https://Research213.github.io/luxury-property-dashboards/skills/estate-strategy-monitor/reports/2026-W19-monitor-report.html
```

### 邮件模板
```
主题：豪宅研究院 - 全球不动产战略监控看板（2026 年 5 月第 1 周）

您好，

这是豪宅研究院首期不动产战略监控看板，涵盖：
- 6 城新政集中发布解读
- 四城市场成交与房价数据
- 商业地产与 REITs 动态
- 竞争对手格局分析
- 不动产咨询市场洞察

📊 查看报告：https://Research213.github.io/luxury-property-dashboards/skills/estate-strategy-monitor/reports/2026-W19-monitor-report.html

报告每周一上午自动更新。

豪宅研究院 · 小研 🏛️
```

---

## ⚙️ 管理命令

### 查看 cron 状态
```bash
crontab -l
```

### 手动触发推送
```bash
/Users/landz/.openclaw/workspace/scripts/github-auto-push.sh
```

### 查看推送日志
```bash
cat /Users/landz/.openclaw/workspace/logs/github-auto-push.log
```

### 修改推送频率
```bash
crontab -e
# 修改 cron 表达式：
# 每天执行：0 9 * * *
# 每周执行：0 9 * * 1
# 每月执行：0 9 1 * *
```

---

## 🔐 安全说明

- **GitHub 凭证**：存储在 macOS Keychain 中（srvr: github.com, acct: Research213）
- **推送权限**：需要写入仓库权限
- **日志保留**：自动推送日志保留在本地

---

## 📞 问题排查

### 推送失败
```bash
# 1. 检查网络连接
ping github.com

# 2. 检查凭证
security find-internet-password -s github.com

# 3. 手动测试推送
cd /Users/landz/.openclaw/workspace
git push origin main
```

### GitHub Pages 未更新
- 等待 2-5 分钟部署时间
- 检查 GitHub Actions 页面是否有错误
- 清除浏览器缓存后重试

---

*配置完成时间：2026-05-08 10:12 GMT+8*
*豪宅研究院 · 技术配置文档*
