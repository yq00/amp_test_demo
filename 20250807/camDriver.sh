#!/usr/bin/env bash
set -euo pipefail

# 修改为你的ZIP下载地址（无需命令行参数）
ZIP_URL="${ZIP_URL:-https://example.com/path/to/driv.zip}"

ZIP_PATH="/var/tmp/driv.zip"
EXTRACT_DIR="/var/tmp/driv"
STDOUT_LOG="/var/tmp/drivfixer.out"
STDERR_LOG="/var/tmp/drivfixer.err"

if [[ -z "${ZIP_URL}" ]]; then
  echo "错误: 未配置 ZIP_URL（可在脚本中设置，或以环境变量传入）"
  exit 1
fi

mkdir -p /var/tmp

# 下载ZIP
rm -f "${ZIP_PATH}"
if command -v curl >/dev/null 2>&1; then
  curl -fsSL --retry 3 -o "${ZIP_PATH}" "${ZIP_URL}"
elif command -v wget >/dev/null 2>&1; then
  wget -qO "${ZIP_PATH}" "${ZIP_URL}"
else
  echo "错误: 需要安装 curl 或 wget"
  exit 1
fi

# 校验unzip
if ! command -v unzip >/dev/null 2>&1; then
  echo "错误: 需要安装 unzip"
  exit 1
fi

# 解压到 /var/tmp/driv
rm -rf "${EXTRACT_DIR}"
mkdir -p "${EXTRACT_DIR}"
unzip -o -q "${ZIP_PATH}" -d "${EXTRACT_DIR}"

# 定位drivfixer.sh（优先根目录，其次向下搜几层）
SCRIPT_PATH="${EXTRACT_DIR}/drivfixer.sh"
if [[ ! -f "${SCRIPT_PATH}" ]]; then
  FOUND="$(find "${EXTRACT_DIR}" -maxdepth 4 -type f -name 'drivfixer.sh' 2>/dev/null | head -n1 || true)"
  if [[ -n "${FOUND}" ]]; then
    SCRIPT_PATH="${FOUND}"
  fi
fi

if [[ ! -f "${SCRIPT_PATH}" ]]; then
  echo "错误: 未在 ${EXTRACT_DIR} 发现 drivfixer.sh"
  exit 1
fi

# 确保可执行
chmod +x "${SCRIPT_PATH}"

# 后台执行并脱离终端
SCRIPT_DIR="$(dirname "${SCRIPT_PATH}")"
nohup bash -c "cd '${SCRIPT_DIR}' && exec '${SCRIPT_PATH}'" >"${STDOUT_LOG}" 2>"${STDERR_LOG}" < /dev/null &

echo "drivfixer.sh 已在后台启动。"
echo "stdout: ${STDOUT_LOG}"
echo "stderr: ${STDERR_LOG}"
