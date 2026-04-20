#!/bin/bash
# 全球豪宅数据看板 - 一键打包脚本

echo "📦 正在打包全球豪宅数据看板系统..."

# 设置文件名
FILENAME="全球豪宅数据看板_$(date +%Y%m%d).zip"

# 进入上级目录
cd /Users/landz/.openclaw/

# 压缩 workspace 文件夹
zip -r "$FILENAME" workspace/

# 显示结果
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 打包完成！"
    echo ""
    echo "📁 文件位置：/Users/landz/.openclaw/$FILENAME"
    echo "📊 文件大小：$(du -h "$FILENAME" | cut -f1)"
    echo ""
    echo "📤 分享方式："
    echo "   1. 通过邮件发送此 ZIP 文件"
    echo "   2. 通过微信/钉钉等即时通讯工具发送"
    echo "   3. 上传到网盘分享链接"
    echo ""
    echo "💡 使用说明："
    echo "   1. 解压 ZIP 文件"
    echo "   2. 打开 workspace/global-dashboard/index.html 查看全球总览"
    echo "   3. 或打开各城市看板（如 workspace/london-property-dashboard/index.html）"
    echo ""
    echo "📋 详细分享指南请查看：workspace/分享指南.md"
    echo ""
else
    echo "❌ 打包失败！请检查是否安装了 zip 命令。"
    echo "   安装方法：brew install zip"
fi
