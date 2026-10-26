#!/usr/bin/env bash
set -euo pipefail
export PIP_DEFAULT_TIMEOUT=30
export PIP_RETRIES=2
export PIP_PROGRESS_BAR=off
export PIP_DISABLE_PIP_VERSION_CHECK=1
# Matching CPU builds prevent an unconstrained torchaudio from pulling CUDA binaries.
timeout 480 python -m pip install 'torch==2.8.0' 'torchaudio==2.8.0' --index-url https://download.pytorch.org/whl/cpu
timeout 480 python -m pip install 'stable-ts==2.19.1' 'faster-whisper==1.2.1' pillow
python -c 'import torch, torchaudio, stable_whisper, faster_whisper; assert torch.__version__.split("+")[0] == torchaudio.__version__.split("+")[0]; print("CPU alignment imports verified")'
mkdir -p public/fonts
curl --fail --location --connect-timeout 20 --max-time 120 --retry 2 'https://raw.githubusercontent.com/google/fonts/main/ofl/inter/Inter%5Bopsz%2Cwght%5D.ttf' -o public/fonts/Inter.ttf
python -m pip freeze > alignment-environment.txt
# Fonts are runtime dependencies only, never part of a user delivery artifact.
