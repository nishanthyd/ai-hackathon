# ============================================================
# EduVision — neweduvisionkesh backend
# Production Docker image for Render deployment.
#
# Stack:
#   - Node.js 22 (LTS) for the Express server
#   - Python 3.12 + Manim Community Edition (v0.19+)
#   - FFmpeg + FFprobe (full build with libx264, aac)
#   - Google TTS (no additional install required — pure HTTP)
# ============================================================

FROM node:22-bookworm-slim

# ── System dependencies ──────────────────────────────────────
# manim needs: python3, pip, cairo, pango, latex (texlive), ffmpeg
# We use bookworm (Debian 12) for up-to-date packages.
RUN apt-get update && apt-get install -y --no-install-recommends \
    # Python
    python3 \
    python3-pip \
    python3-venv \
    # Cairo & Pango (required by Manim for vector rendering)
    libcairo2-dev \
    libpango1.0-dev \
    libpangocairo-1.0-0 \
    # FFmpeg (full build with libx264, aac codecs)
    ffmpeg \
    # LaTeX (required by Manim for mathematical text rendering)
    texlive-latex-base \
    texlive-latex-extra \
    texlive-fonts-recommended \
    texlive-science \
    dvipng \
    # Build tools
    build-essential \
    pkg-config \
    # Clean up
    && rm -rf /var/lib/apt/lists/*

# ── Install Manim Community Edition ─────────────────────────
# Use a virtual environment to avoid system pip conflicts
RUN python3 -m venv /opt/manim-venv && \
    /opt/manim-venv/bin/pip install --no-cache-dir --upgrade pip && \
    /opt/manim-venv/bin/pip install --no-cache-dir \
        "manim>=0.19.0" \
        "numpy>=1.26.0" \
        "pillow>=10.0.0"

# Add the venv to PATH so 'manim' is found by child_process.execFile
ENV PATH="/opt/manim-venv/bin:$PATH"

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
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

# Start the backend using tsx (TypeScript executor, no build step required)
CMD ["node", "node_modules/.bin/tsx", "src/server/server.ts"]
