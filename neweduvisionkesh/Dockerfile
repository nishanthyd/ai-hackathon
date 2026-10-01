# ============================================================
# EduVision — neweduvisionkesh backend
# Production Docker image for Render deployment.
#
# Stack:
#   - Node.js 22 (LTS) for the Express server
#   - Python 3.11 + Manim Community Edition (v0.19+)
#   - FFmpeg + FFprobe (full build with libx264, aac)
#   - Google TTS (no additional install required — pure HTTP)
#
# Base: node:22-bookworm-slim (Debian 12)
# ============================================================

FROM node:22-bookworm-slim

# ── System dependencies ──────────────────────────────────────
# Debian Bookworm ships Python 3.11 as the system Python.
#
# CRITICAL: Use `python3-full` (NOT python3 + python3-venv separately).
# On slim images, python3-venv alone cannot bootstrap a virtual
# environment because ensurepip is stripped out. python3-full
# includes ensurepip and the complete standard library.
#
# python3-dev provides Python.h headers needed to compile C
# extensions (pycairo, manimpango, numpy).
RUN apt-get update && apt-get install -y --no-install-recommends \
    # Python — python3-full includes venv + ensurepip
    python3-full \
    python3-dev \
    # Cairo & Pango (required by Manim for vector rendering)
    libcairo2-dev \
    libpango1.0-dev \
    libpangocairo-1.0-0 \
    # Additional Manim rendering deps
    libgdk-pixbuf2.0-dev \
    libffi-dev \
    # FFmpeg (full build with libx264, aac codecs)
    ffmpeg \
    # LaTeX (required by Manim for mathematical text rendering)
    texlive-latex-base \
    texlive-latex-extra \
    texlive-fonts-recommended \
    texlive-science \
    dvipng \
    # Build tools (gcc, g++, make — needed to compile C extensions)
    build-essential \
    pkg-config \
    # curl is used by the HEALTHCHECK instruction
    curl \
    # Clean up apt cache to reduce image size
    && rm -rf /var/lib/apt/lists/*

# ── Install Manim Community Edition ─────────────────────────
# 1. Create virtual environment (python3-full guarantees this works)
# 2. Upgrade pip + install setuptools/wheel first (build backends)
# 3. Install pycairo and manimpango separately (they need C compilation)
# 4. Install manim last (all heavy deps already satisfied)
RUN python3 -m venv /opt/manim-venv && \
    /opt/manim-venv/bin/pip install --no-cache-dir --upgrade pip setuptools wheel && \
    /opt/manim-venv/bin/pip install --no-cache-dir pycairo manimpango && \
    /opt/manim-venv/bin/pip install --no-cache-dir \
        "manim>=0.19.0" \
        "numpy>=1.26.0" \
        "pillow>=10.0.0"

# Add the venv to PATH so 'manim' CLI is found by Node child_process.execFile
ENV PATH="/opt/manim-venv/bin:$PATH"

# Verify the critical tools are available (fail the build early if not)
RUN manim --version && ffmpeg -version && python3 --version

# ── Application setup ────────────────────────────────────────
WORKDIR /app

# Copy package files first for layer-cached npm install
COPY package.json package-lock.json ./

# Install Node.js dependencies (production + dev for tsx transpiler)
RUN npm ci

# Copy the rest of the source
COPY tsconfig.json ./
COPY src/ ./src/

# Create output directories that the server writes to at runtime
RUN mkdir -p output/videos output/audio output/temporary

# ── Runtime configuration ────────────────────────────────────
# PORT is set by Render at runtime; default to 4000 for local testing
ENV PORT=4000
ENV NODE_ENV=production

# Expose the port Render will route to
EXPOSE 4000

# ── Health & startup ─────────────────────────────────────────
# Render sends HTTP GET /health before marking the service as live.
# The server already handles this route (added in server.ts).
HEALTHCHECK --interval=30s --timeout=10s --start-period=90s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

# Start the backend using tsx (TypeScript executor, no build step required)
CMD ["node", "node_modules/.bin/tsx", "src/server/server.ts"]
