const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 启动综合服务...');
console.log('='.repeat(50));

// 首先运行网络通信测试
console.log('📡 步骤 1: 执行网络通信测试...');
const serverTest = spawn('node', ['server.js'], {
    stdio: 'inherit',
    cwd: __dirname
});

serverTest.on('close', (code) => {
    console.log('\n' + '='.repeat(50));
    console.log('📡 网络通信测试完成');
    console.log('🎮 步骤 2: 启动贪吃蛇游戏服务器...');
    console.log('='.repeat(50));
    
    // 网络测试完成后启动游戏服务器
    const gameServer = spawn('node', ['start.js'], {
        stdio: 'inherit',
        cwd: __dirname
    });

    // 监听游戏服务器事件
    gameServer.on('close', (code) => {
        console.log('\n🎮 游戏服务器已停止');
        process.exit(code);
    });

    gameServer.on('error', (err) => {
        console.error('🎮 游戏服务器启动错误:', err);
        process.exit(1);
    });

    // 处理退出信号
    process.on('SIGINT', () => {
        console.log('\n\n🛑 收到退出信号，正在关闭服务...');
        gameServer.kill('SIGINT');
    });

    process.on('SIGTERM', () => {
        console.log('\n\n🛑 收到终止信号，正在关闭服务...');
        gameServer.kill('SIGTERM');
    });
});

serverTest.on('error', (err) => {
    console.error('📡 网络测试启动错误:', err);
    console.log('\n⚠️  网络测试失败，直接启动游戏服务器...');
    
    // 如果网络测试失败，直接启动游戏服务器
    const gameServer = spawn('node', ['start.js'], {
        stdio: 'inherit',
        cwd: __dirname
    });

    gameServer.on('close', (code) => {
        console.log('\n🎮 游戏服务器已停止');
        process.exit(code);
    });

    process.on('SIGINT', () => {
        console.log('\n\n🛑 收到退出信号，正在关闭服务...');
        gameServer.kill('SIGINT');
    });
});

