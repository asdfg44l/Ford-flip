#!/usr/bin/env sh

# 發生錯誤時執行終止指令
set -e

# 確保在 master 分支上並且工作目錄是乾淨的
git checkout master
if [ -n "$(git status --porcelain)" ]; then
  echo "Working directory is not clean. Please commit or stash your changes first."
  exit 1
fi

# 獲取當前版本號
VERSION=$(node -p "require('./package.json').version")
# 獲取最後一位版本號並加1
LAST_NUM=$(echo $VERSION | cut -d'.' -f3)
NEW_NUM=$((LAST_NUM + 1))
NEW_VERSION=$(echo $VERSION | sed "s/\.[0-9]*$/.$NEW_NUM/")

# 更新 package.json 中的版本號
sed -i '' "s/\"version\": \"$VERSION\"/\"version\": \"$NEW_VERSION\"/" package.json

# 提交版本更新
git add package.json
git commit -m "chore: bump version to $NEW_VERSION"

# 打包編譯
pnpm run build

# 切換到 gh-pages 分支
git checkout -B gh-pages

# 添加構建文件
git add -f docs/
git commit -m "chore: deploy version $NEW_VERSION"

# 強制推送到 gh-pages
git push -f origin gh-pages

# 切回 master 分支並推送版本更新
git checkout master
git push origin master

# 移動到打包資料夾下，若你有調整的話打包後的資料夾請務必調整
cd docs

# 清理舊的 git 倉庫
rm -rf .git

# 部署到自定義網域
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m "deploy: version $NEW_VERSION"

# 部署到 https://<USERNAME>.github.io/<REPO>