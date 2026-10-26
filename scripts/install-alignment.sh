#!/usr/bin/env bash
set -euo pipefail
# CPU-only and version-matched: an unconstrained torchaudio may pull a CUDA build.
python -m pip install 'torch==2.8.0' 'torchaudio==2.8.0' --index-url https://download.pytorch.org/whl/cpu
python -m pip install 'stable-ts==2.19.1' 'faster-whisper==1.2.1' pillow
python -c 'import torch, torchaudio, stable_whisper, faster_whisper; assert torch.__version__.split("+")[0] == torchaudio.__version__.split("+")[0]; print("CPU alignment imports verified")'
mkdir -p public/fonts
curl --fail --location --retry 2 'https://raw.githubusercontent.com/google/fonts/main/ofl/inter/Inter%5Bopsz%2Cwght%5D.ttf' -o public/fonts/Inter.ttf
python -m pip freeze > alignment-environment.txt
# The font is a rendering dependency only; do not include font binaries in delivery artifacts.
