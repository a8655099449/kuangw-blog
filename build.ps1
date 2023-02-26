npm run build

scp -o "StrictHostKeyChecking=no" -r ./.vitepress/dist/* root@47.107.81.99:/www/wwwroot/blog/
