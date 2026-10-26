#!/usr/bin/env bash
set -euo pipefail
if command -v ffmpeg >/dev/null && command -v ffprobe >/dev/null; then
  echo 'Using existing FFmpeg and ffprobe.'
else
  timeout 150 sudo apt-get -o Acquire::http::Timeout=30 -o Acquire::https::Timeout=30 -o Acquire::Retries=2 update -qq
  timeout 150 sudo apt-get -o Acquire::http::Timeout=30 -o Acquire::Retries=2 install -y -qq ffmpeg
fi
ffmpeg -version | head -n 1
ffprobe -version | head -n 1
