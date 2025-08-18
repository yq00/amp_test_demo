#!/usr/bin/env node
/**
 * 百度连接模拟脚本
 * 模拟恶意代码的网络连接行为，仅用于教育目的
 */

const net = require('net');
const http = require('http');
const https = require('https');
const fs = require('fs');

class BaiduConnectionSimulator {
    constructor() {
        this.connectionLog = [];
        this.targets = [
            { host: 'baidu.com', port: 80, protocol: 'HTTP' },
            { host: 'www.baidu.com', port: 443, protocol: 'HTTPS' },
            { host: 'baidu.com', port: 443, protocol: 'HTTPS' }
        ];
    }

    logConnection(action, description, data = null) {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = {
            timestamp,
            action,
            description,
            data
        };
        
        this.connectionLog.push(logEntry);
        console.log(`[${timestamp}] ${action}: ${description}`);
        if (data) {
            console.log(`    数据: ${JSON.stringify(data, null, 2)}`);
        }
        console.log();
    }

    async testConnection(host, port, protocol) {
        return new Promise((resolve) => {
            try {
                this.logConnection(
                    '连接测试',
                    `尝试连接到 ${host}:${port} (${protocol})`,
                    { host, port, protocol }
                );

                const socket = new net.Socket();
                socket.setTimeout(5000);

                socket.on('connect', () => {
                    socket.destroy();
                    this.logConnection(
                        '连接成功',
                        `成功连接到 ${host}:${port}`,
                        { host, port, status: 'connected' }
                    );
                    resolve('success');
                });

                socket.on('timeout', () => {
                    socket.destroy();
                    this.logConnection(
                        '连接超时',
                        `连接 ${host}:${port} 超时`,
                        { host, port, status: 'timeout' }
                    );
                    resolve('timeout');
                });

                socket.on('error', (error) => {
                    this.logConnection(
                        '连接错误',
                        `连接 ${host}:${port} 时出现错误: ${error.message}`,
                        { host, port, status: 'error', error: error.message }
                    );
                    resolve('error');
                });

                socket.connect(port, host);

            } catch (error) {
                this.logConnection(
                    '连接异常',
                    `连接 ${host}:${port} 时出现异常: ${error.message}`,
                    { host, port, status: 'exception', error: error.message }
                );
                resolve('exception');
            }
        });
    }

    async simulateDataUpload() {
        this.logConnection('数据发送', '模拟向百度发送数据包');

        const dataTypes = [
            '浏览器扩展信息',
            '钱包数据',
            '系统信息',
            '用户配置文件'
        ];

        for (let i = 0; i < dataTypes.length; i++) {
            const dataType = dataTypes[i];
            await this.sleep(500);
            
            this.logConnection(
                `数据包 ${i + 1}`,
                `模拟发送: ${dataType}`,
                { type: dataType, size: '模拟数据', target: 'baidu.com' }
            );
        }
    }

    async simulatePersistentConnection() {
        this.logConnection('持久连接', '尝试建立持久的命令控制通道');

        // 模拟连接状态监控
        for (let i = 0; i < 3; i++) {
            await this.sleep(1000);
            this.logConnection(
                '连接监控',
                `监控连接状态 #${i + 1}`,
                { status: 'active', duration: `${i + 1}s` }
            );
        }
    }

    async simulateMalwareConnectionFlow() {
        console.log('🚀 开始模拟恶意代码的网络连接流程...');
        console.log('='.repeat(60));

        // 1. 初始连接测试
        this.logConnection('流程开始', '恶意代码开始建立网络连接');

        // 2. 测试所有目标连接
        const connectionResults = [];
        for (const target of this.targets) {
            const status = await this.testConnection(target.host, target.port, target.protocol);
            connectionResults.push({
                host: target.host,
                port: target.port,
                protocol: target.protocol,
                status
            });
            await this.sleep(1000); // 模拟连接间隔
        }

        // 3. 模拟数据发送
        await this.simulateDataUpload();

        // 4. 模拟建立持久连接
        await this.simulatePersistentConnection();

        // 5. 生成连接报告
        this.generateConnectionReport(connectionResults);

        console.log('='.repeat(60));
        console.log('✅ 网络连接模拟完成！');
        console.log(`📊 总共测试了 ${this.targets.length} 个连接目标`);
        console.log('📄 详细报告已保存到: baidu_connection_report.json');

        return connectionResults;
    }

    generateConnectionReport(results) {
        const report = {
            simulationInfo: {
                title: '百度连接模拟报告',
                timestamp: new Date().toISOString(),
                description: '模拟恶意代码的网络连接行为',
                note: '仅用于教育目的，不会发送恶意数据'
            },
            connectionTargets: this.targets,
            connectionResults: results,
            connectionLog: this.connectionLog,
            summary: {
                totalTargets: this.targets.length,
                successfulConnections: results.filter(r => r.status === 'success').length,
                failedConnections: results.filter(r => r.status === 'failed').length,
                errorConnections: results.filter(r => r.status === 'error').length,
                timeoutConnections: results.filter(r => r.status === 'timeout').length
            }
        };

        // 保存报告到文件
        fs.writeFileSync(
            'baidu_connection_report.json', 
            JSON.stringify(report, null, 2), 
            'utf8'
        );

        this.logConnection(
            '报告生成',
            '连接模拟报告已保存',
            { filename: 'baidu_connection_report.json' }
        );

        return report;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

async function main() {
    console.log('🌐 百度连接模拟器 (Node.js版本)');
    console.log('⚠️  警告：此程序仅用于教育目的，模拟恶意代码的网络连接行为');
    console.log('='.repeat(60));

    // 创建模拟器实例
    const simulator = new BaiduConnectionSimulator();

    try {
        // 运行连接模拟
        await simulator.simulateMalwareConnectionFlow();
    } catch (error) {
        console.error('❌ 模拟过程中出现错误:', error.message);
    }
}

// 如果直接运行此文件，则执行主函数
if (require.main === module) {
    main();
}

module.exports = BaiduConnectionSimulator;
