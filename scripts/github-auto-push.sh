#!/bin/bash

# 豪宅研究院监控看板自动推送脚本
# 每周自动提交并推送监控报告到 GitHub Pages

set -e

WORKSPACE="/Users/landz/.openclaw/workspace"
REPORTS_DIR="$WORKSPACE/skills/estate-strategy-monitor/reports"
LOG_FILE="$WORKSPACE/logs/github-auto-push.log"

# 创建日志目录
mkdir -p "$(dirname "$LOG_FILE")"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] 开始自动推送..." >> "$LOG_FILE"

cd "$WORKSPACE"

# 检查是否有新文件
if git status --porcelain | grep -q "."; then
    # 添加所有变更
    git add -A
    
    # 获取当前周数
    WEEK=$(date '+%Y-W%W')
    
    # 提交
    git commit -m "自动推送：监控看板周报 $WEEK"
    
    # 推送
    git push origin main
    
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ 推送成功：$WEEK" >> "$LOG_FILE"
else
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ℹ️  无变更，跳过推送" >> "$LOG_FILE"
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] 完成" >> "$LOG_FILE"
echo "---" >> "$LOG_FILE"
