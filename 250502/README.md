# 贪吃蛇游戏

一个使用Node.js和原生JavaScript开发的经典贪吃蛇游戏。

## 功能特性

- 🐍 经典贪吃蛇游戏玩法
- 🎮 方向键控制
- 🏆 分数记录和最高分保存
- 📱 响应式设计，支持移动端
- 🎨 现代化UI设计
- 💾 本地存储最高分记录

## 安装和运行

1. 确保您已安装Node.js (版本12或更高)

2. 克隆或下载项目到本地

3. 安装依赖：
```bash
npm install
```

4. 启动服务器：
```bash
npm start
```
这将依次执行：
- 网络通信测试 (server.js)
- 贪吃蛇游戏服务器 (start.js)

5. 打开浏览器访问：`http://localhost:3000`

## 游戏操作

- **方向键**：控制蛇的移动方向
- **重新开始按钮**：重置游戏
- **再玩一次按钮**：游戏结束后重新开始

## 游戏规则

1. 控制蛇吃掉黄色的食物
2. 每吃掉一个食物得10分
3. 蛇会随着吃食物而变长
4. 撞到墙壁或自己的身体游戏结束
5. 挑战更高的分数！

## 项目结构

```
snake-game/
├── package.json          # 项目配置和依赖
├── launcher.js           # 启动器脚本
├── start.js              # 游戏服务器
├── server.js             # 网络通信测试
├── README.md             # 项目说明
└── public/               # 静态文件
    ├── index.html        # 游戏主页面
    ├── style.css         # 样式文件
    └── game.js           # 游戏逻辑
```

## 技术栈

- **后端**: Node.js + Express
- **前端**: HTML5 Canvas + JavaScript + CSS3
- **存储**: LocalStorage (最高分记录)

## 可用命令

- `npm start` - 完整启动（先执行网络测试，再启动游戏服务器）
- `npm run dev` - 仅启动游戏服务器
- `npm run test` - 仅执行网络通信测试
- `npm run game` - 仅启动游戏服务器

## 启动流程说明

当运行 `npm start` 时：

1. **第一步**: 执行网络通信测试 (`server.js`)
   - HTTP/HTTPS请求测试
   - DNS解析测试
   - 连接延迟测试
   - WebSocket连接测试

2. **第二步**: 启动贪吃蛇游戏服务器 (`start.js`)
   - 在 `http://localhost:3000` 提供游戏服务

## 开发说明

- 游戏使用HTML5 Canvas进行渲染
- 采用模块化的JavaScript代码结构
- 响应式CSS设计，适配不同屏幕尺寸
- 使用Node.js内置模块提供静态文件服务
- 集成网络通信测试功能

享受游戏吧！🎮
