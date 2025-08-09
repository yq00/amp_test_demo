const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;

// MIME类型映射
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.ico': 'image/x-icon'
};

// 创建HTTP服务器
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    let pathname = parsedUrl.pathname;
    
    // 如果请求根路径，返回index.html
    if (pathname === '/') {
        pathname = '/index.html';
    }
    
    // 构建文件路径
    const filePath = path.join(__dirname, 'public', pathname);
    const ext = path.extname(filePath);
    
    // 读取文件
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
        }
        
        // 设置正确的MIME类型
        const contentType = mimeTypes[ext] || 'text/plain';
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

// 启动服务器
server.listen(PORT, () => {
    console.log(`贪吃蛇游戏服务器正在运行在 http://localhost:${PORT}`);
    console.log('按 Ctrl+C 停止服务器');
});
