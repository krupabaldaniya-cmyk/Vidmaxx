#!/bin/bash
echo "🚀 Nuclear Build Reset Starting..."

# 1. Kill all node/next processes
echo "Killing node processes..."
pkill -9 node || true
pkill -9 next || true
pkill -9 remotion || true

# 2. Delete cache
echo "Deleting .next cache..."
rm -rf .next

# 3. Clean up /tmp
echo "Cleaning /tmp/vidmaxx-*..."
rm -rf /tmp/vidmaxx-*

echo "✅ Cleaned! Please run: npm run dev"
