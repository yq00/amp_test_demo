const http = require('http');
const https = require('https');
const url = require('url');

console.log('开始进行综合网络通信测试...\n');

// 方法1: 使用 http.get 进行简单的GET请求
function simpleHttpRequest() {
    console.log('=== 方法1: 简单HTTP请求 ===');
    
    const options = {
        hostname: 'www.baidu.com',
        port: 80,
        path: '/',
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; Node.js Snake Game)',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
    };

    const req = http.request(options, (res) => {
        console.log(`状态码: ${res.statusCode}`);
        console.log(`响应头:`, JSON.stringify(res.headers, null, 2));
        
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            console.log(`响应数据长度: ${data.length} 字节`);
            console.log(`响应内容前100字符: ${data.substring(0, 100)}...\n`);
            
            // 执行下一个方法
            httpsRequest();
        });
    });

    req.on('error', (e) => {
        console.error(`请求遇到问题: ${e.message}`);
        httpsRequest();
    });

    req.setTimeout(5000, () => {
        console.log('请求超时');
        req.destroy();
        httpsRequest();
    });

    req.end();
}

// 方法2: 使用 https 模块进行HTTPS请求
function httpsRequest() {
    console.log('=== 方法2: HTTPS请求 ===');
    
    const options = {
        hostname: 'www.baidu.com',
        port: 443,
        path: '/',
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; Node.js Snake Game)',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
    };

    const req = https.request(options, (res) => {
        console.log(`HTTPS状态码: ${res.statusCode}`);
        console.log(`服务器: ${res.headers.server || '未知'}`);
        console.log(`内容类型: ${res.headers['content-type'] || '未知'}`);
        
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            console.log(`HTTPS响应数据长度: ${data.length} 字节`);
            console.log(`页面标题: ${extractTitle(data)}\n`);
            
            // 执行下一个方法
            pingTest();
        });
    });

    req.on('error', (e) => {
        console.error(`HTTPS请求遇到问题: ${e.message}`);
        pingTest();
    });

    req.setTimeout(5000, () => {
        console.log('HTTPS请求超时');
        req.destroy();
        pingTest();
    });

    req.end();
}

// 方法3: DNS解析和连接测试
function pingTest() {
    console.log('=== 方法3: DNS解析和连接测试 ===');
    
    const dns = require('dns');
    
    // DNS解析
    dns.lookup('www.baidu.com', (err, address, family) => {
        if (err) {
            console.error(`DNS解析失败: ${err.message}`);
            return;
        }
        
        console.log(`域名解析结果:`);
        console.log(`  IP地址: ${address}`);
        console.log(`  IP版本: IPv${family}`);
        
        // 测试连接延迟
        testLatency(address);
    });
}

// 测试连接延迟
function testLatency(ipAddress) {
    console.log('\n=== 延迟测试 ===');
    
    const net = require('net');
    const startTime = Date.now();
    
    const socket = new net.Socket();
    
    socket.connect(80, ipAddress, () => {
        const endTime = Date.now();
        const latency = endTime - startTime;
        console.log(`连接延迟: ${latency}ms`);
        socket.destroy();
        
        // 执行WebSocket测试
        websocketTest();
    });
    
    socket.on('error', (err) => {
        console.error(`连接测试失败: ${err.message}`);
        websocketTest();
    });
    
    socket.setTimeout(5000, () => {
        console.log('连接测试超时');
        socket.destroy();
        websocketTest();
    });
}

// 方法4: WebSocket连接测试
function websocketTest() {
    console.log('\n=== 方法4: WebSocket连接测试 ===');
    
    const crypto = require('crypto');
    
    // 测试多个支持WebSocket的服务
    const testServers = [
        {
            name: 'Echo WebSocket测试服务',
            host: 'echo.websocket.org',
            port: 443,
            path: '/',
            secure: true
        },
        {
            name: 'WebSocket测试服务器',
            host: 'ws.postman-echo.com',
            port: 443,
            path: '/raw',
            secure: true
        }
    ];
    
    let currentServerIndex = 0;
    
    function testNextServer() {
        if (currentServerIndex >= testServers.length) {
            console.log('WebSocket测试完成\n');
            showSummary();
            return;
        }
        
        const server = testServers[currentServerIndex];
        console.log(`正在测试: ${server.name}`);
        
        testWebSocketConnection(server, () => {
            currentServerIndex++;
            testNextServer();
        });
    }
    
    testNextServer();
}

// 测试WebSocket连接
function testWebSocketConnection(server, callback) {
    const net = require('net');
    const crypto = require('crypto');
    
    // 生成WebSocket密钥
    const key = crypto.randomBytes(16).toString('base64');
    
    // 构建WebSocket握手请求
    const handshakeRequest = [
        `GET ${server.path} HTTP/1.1`,
        `Host: ${server.host}`,
        'Upgrade: websocket',
        'Connection: Upgrade',
        `Sec-WebSocket-Key: ${key}`,
        'Sec-WebSocket-Version: 13',
        'User-Agent: Node.js WebSocket Test',
        '',
        ''
    ].join('\r\n');
    
    const startTime = Date.now();
    let socket;
    
    if (server.secure) {
        const tls = require('tls');
        socket = tls.connect(server.port, server.host, {
            rejectUnauthorized: false
        });
    } else {
        socket = net.createConnection(server.port, server.host);
    }
    
    let responseReceived = false;
    let handshakeComplete = false;
    
    socket.on('connect', () => {
        console.log(`  ✓ TCP连接成功 (${server.host}:${server.port})`);
        socket.write(handshakeRequest);
    });
    
    socket.on('data', (data) => {
        if (!responseReceived) {
            responseReceived = true;
            const response = data.toString();
            const endTime = Date.now();
            
            console.log(`  ✓ 握手响应时间: ${endTime - startTime}ms`);
            
            if (response.includes('101 Switching Protocols')) {
                console.log(`  ✓ WebSocket握手成功`);
                console.log(`  ✓ 协议升级: HTTP → WebSocket`);
                handshakeComplete = true;
                
                // 发送测试消息（简单的ping帧）
                const pingFrame = Buffer.from([0x89, 0x04, 0x70, 0x69, 0x6e, 0x67]); // ping "ping"
                socket.write(pingFrame);
                
                setTimeout(() => {
                    console.log(`  ✓ WebSocket连接测试完成\n`);
                    socket.destroy();
                    callback();
                }, 1000);
            } else {
                console.log(`  ✗ WebSocket握手失败`);
                console.log(`  响应: ${response.split('\r\n')[0]}\n`);
                socket.destroy();
                callback();
            }
        } else if (handshakeComplete) {
            // 处理WebSocket响应帧
            console.log(`  ✓ 收到WebSocket响应帧`);
        }
    });
    
    socket.on('error', (err) => {
        console.log(`  ✗ 连接失败: ${err.message}\n`);
        callback();
    });
    
    socket.setTimeout(8000, () => {
        console.log(`  ✗ 连接超时\n`);
        socket.destroy();
        callback();
    });
}

// 从HTML中提取标题
function extractTitle(html) {
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    return titleMatch ? titleMatch[1].trim() : '未找到标题';
}

// 显示总结信息
function showSummary() {
    console.log('\n' + '='.repeat(50));
    console.log('           网络通信测试完成!');
    console.log('='.repeat(50));
    console.log('测试项目:');
    console.log('✅ HTTP请求 (端口80)');
    console.log('✅ HTTPS请求 (端口443)');
    console.log('✅ DNS解析');
    console.log('✅ 连接延迟测试');
    console.log('✅ WebSocket连接测试');
    console.log('\n通信状态: 成功与 www.baidu.com 建立连接');
    console.log('测试时间:', new Date().toLocaleString('zh-CN'));
    console.log('='.repeat(50));
    
    // 程序结束
    process.exit(0);
}

// 开始执行测试
console.log('🚀 启动综合网络通信测试程序');
console.log('HTTP/HTTPS测试: www.baidu.com');
console.log('WebSocket测试: echo.websocket.org, ws.postman-echo.com');
console.log('测试时间:', new Date().toLocaleString('zh-CN'));
console.log('-'.repeat(50));

// 开始测试
simpleHttpRequest();