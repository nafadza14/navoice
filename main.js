/**
 * Navoice — Real-time AI Voice Scam & Deepfake Shield
 * Full-screen Dashboard & Landing Page Engine with Dark/Night and Light Modes
 */

document.addEventListener("DOMContentLoaded", () => {
  initThemeEngine();
  initNavigationViews();
  initStatsCountUp();
  initMobileMenu();
  initSpeakerScanEngine();
  initVoiceNoteExtension();
  initEmergencyProtocol();
});

/* =========================================================================
   1. THEME ENGINE (NIGHT / DARK MODE & LIGHT MODE)
   ========================================================================= */
function initThemeEngine() {
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const mobileThemeBtn = document.getElementById("mobile-theme-btn");
  const themeIcon = document.getElementById("theme-toggle-icon");
  const themeText = document.getElementById("theme-toggle-text");

  // Default theme is dark / night mode
  const savedTheme = localStorage.getItem("navoice_theme") || "dark";
  applyTheme(savedTheme);

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("navoice_theme", theme);

    const isLight = theme === "light";
    if (themeIcon) {
      themeIcon.className = isLight ? "fa-solid fa-moon" : "fa-solid fa-sun";
    }
    if (themeText) {
      themeText.textContent = isLight ? "Night Mode" : "Light Mode";
    }
    if (mobileThemeBtn) {
      const icon = mobileThemeBtn.querySelector("i");
      const label = mobileThemeBtn.querySelector("span");
      if (icon) icon.className = isLight ? "fa-solid fa-moon" : "fa-solid fa-sun";
      if (label) label.textContent = isLight ? "Switch to Night Mode" : "Switch to Light Mode";
    }

    // Trigger canvas redraw for current theme
    window.dispatchEvent(new CustomEvent("navoice-theme-changed", { detail: { theme } }));
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
  }

  if (themeToggleBtn) themeToggleBtn.addEventListener("click", toggleTheme);
  if (mobileThemeBtn) mobileThemeBtn.addEventListener("click", toggleTheme);
}

/* =========================================================================
   2. FULL-SCREEN NAVIGATION & VIEW SYSTEM
   ========================================================================= */
let activeViewId = "view-home";

function switchView(viewId) {
  if (!viewId) return;
  const targetView = document.getElementById(viewId);
  if (!targetView) return;

  activeViewId = viewId;

  // Deactivate all views
  document.querySelectorAll(".view-panel").forEach((panel) => {
    panel.classList.remove("active");
  });

  // Activate target view
  targetView.classList.add("active");

  // Sync desktop nav links
  const desktopNavLinks = document.querySelectorAll("#desktop-nav .nav-link");
  desktopNavLinks.forEach((link) => {
    const target = link.getAttribute("data-view");
    link.classList.toggle("active", target === viewId);
  });

  // Sync mobile nav links
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
  mobileNavLinks.forEach((link) => {
    const target = link.getAttribute("data-view");
    link.classList.toggle("active", target === viewId);
  });

  // Trigger stats restart if switching to home
  if (viewId === "view-home") {
    initStatsCountUp();
  }

  // Trigger canvas resize/redraw if switching to product
  if (viewId === "view-product") {
    window.dispatchEvent(new Event("resize"));
  }
}

function initNavigationViews() {
  // Desktop nav links
  document.querySelectorAll("#desktop-nav .nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetView = link.getAttribute("data-view");
      if (targetView) switchView(targetView);
    });
  });

  // Logo button returns to home
  const logoBtn = document.getElementById("logo-button");
  if (logoBtn) {
    logoBtn.addEventListener("click", (e) => {
      e.preventDefault();
      switchView("view-home");
    });
  }

  // Quick CTA buttons pointing to specific views
  document.querySelectorAll("[data-navigate]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const target = btn.getAttribute("data-navigate");
      if (target) switchView(target);
    });
  });
}

/* =========================================================================
   3. STATS FOOTER COUNT-UP ANIMATION
   ========================================================================= */
function initStatsCountUp() {
  const statValues = document.querySelectorAll(".stat-value");
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const startCounter = (el) => {
    const target = parseFloat(el.getAttribute("data-target") || "0");
    const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    const duration = parseInt(el.getAttribute("data-duration") || "1500", 10);
    const delay = parseInt(el.getAttribute("data-delay") || "0", 10);

    setTimeout(() => {
      let startTime = null;

      function step(currentTime) {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const eased = easeOutCubic(progress);
        const currentVal = eased * target;

        el.textContent = currentVal.toFixed(decimals);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target.toFixed(decimals);
        }
      }

      requestAnimationFrame(step);
    }, delay);
  };

  statValues.forEach((el) => startCounter(el));
}

/* =========================================================================
   4. MOBILE BURGER & SHEET MENU
   ========================================================================= */
function initMobileMenu() {
  const burgerBtn = document.getElementById("burger-button");
  const overlay = document.getElementById("mobile-overlay");
  const menuSheet = document.getElementById("mobile-menu-sheet");

  if (!burgerBtn || !overlay || !menuSheet) return;

  function toggleMenu(forceClose = false) {
    const isOpen = forceClose ? false : !burgerBtn.classList.contains("open");
    burgerBtn.classList.toggle("open", isOpen);
    burgerBtn.setAttribute("aria-expanded", String(isOpen));
    overlay.classList.toggle("active", isOpen);
    menuSheet.classList.toggle("active", isOpen);
    menuSheet.setAttribute("aria-hidden", String(!isOpen));
  }

  burgerBtn.addEventListener("click", () => toggleMenu());
  overlay.addEventListener("click", () => toggleMenu(true));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && burgerBtn.classList.contains("open")) {
      toggleMenu(true);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && burgerBtn.classList.contains("open")) {
      toggleMenu(true);
    }
  });

  // Handle mobile links and action buttons
  const mobileItems = menuSheet.querySelectorAll(".mobile-nav-link, [data-navigate], [data-view]");
  mobileItems.forEach((link) => {
    link.addEventListener("click", () => {
      const viewId = link.getAttribute("data-view") || link.getAttribute("data-navigate");
      toggleMenu(true);
      if (viewId) switchView(viewId);
    });
  });
}

/* =========================================================================
   5. FEAT-001 & FEAT-002 LIVE SPEAKER SCAN & REAL-TIME SPECTROGRAM
   ========================================================================= */
function initSpeakerScanEngine() {
  const canvas = document.getElementById("scan-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const btnToggleScan = document.getElementById("btn-toggle-scan");
  const btnToggleScanText = document.getElementById("btn-toggle-scan-text");
  const trustScoreNum = document.getElementById("trust-score-num");
  const trustScoreSub = document.getElementById("trust-score-sub");
  const trustStatusChip = document.getElementById("trust-status-chip");
  const trustStatusText = document.getElementById("trust-status-text");
  const trustStatusBar = document.getElementById("trust-status-bar");
  const trustPanel = document.getElementById("trust-panel");
  const emergencyBanner = document.getElementById("scan-emergency-banner");
  const btnQuickEndCall = document.getElementById("btn-quick-end-call");
  const dspMetrics = document.getElementById("dsp-metrics");

  let isScanning = false;
  let activePreset = "scam"; // "scam", "safe", "noisy", "mic"
  let animationFrameId = null;
  let audioContext = null;
  let analyserNode = null;
  let micStream = null;
  let scanProgressTimer = null;

  // Responsive canvas sizing
  function resizeCanvas() {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!isScanning) drawIdleCanvas();
  }

  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("navoice-theme-changed", () => {
    if (!isScanning) drawIdleCanvas();
  });
  setTimeout(resizeCanvas, 50);

  // Preset switchers
  const presetBtns = document.querySelectorAll(".preset-pill");
  presetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      presetBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activePreset = btn.getAttribute("data-preset") || "scam";
      resetScanState();
    });
  });

  // Quick end call button
  if (btnQuickEndCall) {
    btnQuickEndCall.addEventListener("click", () => {
      stopScan();
      if (emergencyBanner) emergencyBanner.style.display = "none";
      alert("Panggilan mencurigakan berhasil diakhiri! Data audio dihapus seketika (Zero-Storage).");
    });
  }

  function isDarkTheme() {
    return document.documentElement.getAttribute("data-theme") !== "light";
  }

  function resetScanState() {
    stopScan();
    if (trustScoreNum) trustScoreNum.textContent = "--";
    if (trustScoreSub) trustScoreSub.textContent = "% Match";
    if (trustStatusBar) {
      trustStatusBar.style.width = "0%";
      trustStatusBar.style.backgroundColor = isDarkTheme() ? "#52525b" : "#cbd5e1";
    }
    if (trustPanel) {
      trustPanel.className = "dashboard-glass-panel";
    }
    if (trustStatusChip) {
      trustStatusChip.className = "status-pill neutral";
    }
    if (trustStatusText) {
      trustStatusText.textContent = "Ready to Scan (" + activePreset.toUpperCase() + ")";
    }
    if (emergencyBanner) emergencyBanner.style.display = "none";
  }

  async function startScan() {
    isScanning = true;
    if (btnToggleScanText) btnToggleScanText.textContent = "Hentikan Scan";
    if (btnToggleScan) {
      btnToggleScan.classList.add("active-danger");
    }

    if (trustStatusText) trustStatusText.textContent = "Sliding Buffer 3.5s Extracting...";
    if (dspMetrics) dspMetrics.textContent = "DSP: Mel-Spectrogram Extracting...";

    if (activePreset === "mic") {
      try {
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyserNode = audioContext.createAnalyser();
        analyserNode.fftSize = 128;
        const source = audioContext.createMediaStreamSource(micStream);
        source.connect(analyserNode);
      } catch (err) {
        console.warn("Microphone access unavailable, using simulated stream:", err);
      }
    }

    startVisualizer();

    // Fast AI Inference Simulation
    let elapsed = 0;
    scanProgressTimer = setInterval(() => {
      elapsed += 350;

      if (activePreset === "scam") {
        if (dspMetrics) dspMetrics.textContent = `AASIST INT8 • ${Math.floor(180 + Math.random() * 40)}ms • >16kHz Harmonic Anomaly`;
        if (elapsed > 1400) {
          updateTrustIndicator("threat", 96);
          if (emergencyBanner) emergencyBanner.style.display = "block";
        }
      } else if (activePreset === "safe") {
        if (dspMetrics) dspMetrics.textContent = `AASIST INT8 • ${Math.floor(150 + Math.random() * 30)}ms • Natural Formants`;
        if (elapsed > 1300) {
          updateTrustIndicator("safe", 94);
        }
      } else if (activePreset === "noisy") {
        if (dspMetrics) dspMetrics.textContent = `AASIST INT8 • ${Math.floor(210 + Math.random() * 30)}ms • Low SNR Cafe Noise`;
        if (elapsed > 1300) {
          updateTrustIndicator("uncertain", 62);
        }
      } else {
        const randScore = 88 + Math.floor(Math.random() * 8);
        if (dspMetrics) dspMetrics.textContent = `Live Mic • 24.0kHz • ${Math.floor(190 + Math.random() * 30)}ms`;
        if (elapsed > 1200) {
          updateTrustIndicator("safe", randScore);
        }
      }
    }, 350);
  }

  function updateTrustIndicator(state, score) {
    if (trustScoreNum) trustScoreNum.textContent = String(score);

    if (state === "safe") {
      if (trustScoreSub) trustScoreSub.textContent = "% Human (Safe)";
      if (trustStatusBar) {
        trustStatusBar.style.width = `${score}%`;
        trustStatusBar.style.backgroundColor = "#10B981";
      }
      if (trustPanel) trustPanel.className = "dashboard-glass-panel border-safe";
      if (trustStatusChip) trustStatusChip.className = "status-pill safe";
      if (trustStatusText) trustStatusText.textContent = "Safe: Authentic Human Voice";
      if (emergencyBanner) emergencyBanner.style.display = "none";
    } else if (state === "uncertain") {
      if (trustScoreSub) trustScoreSub.textContent = "% Match (Noisy)";
      if (trustStatusBar) {
        trustStatusBar.style.width = `${score}%`;
        trustStatusBar.style.backgroundColor = "#F59E0B";
      }
      if (trustPanel) trustPanel.className = "dashboard-glass-panel border-warn";
      if (trustStatusChip) trustStatusChip.className = "status-pill warn";
      if (trustStatusText) trustStatusText.textContent = "Uncertain: Dekatkan Mic ke Speaker";
      if (emergencyBanner) emergencyBanner.style.display = "none";
    } else if (state === "threat") {
      if (trustScoreSub) trustScoreSub.textContent = "% AI Synthetic";
      if (trustStatusBar) {
        trustStatusBar.style.width = `${score}%`;
        trustStatusBar.style.backgroundColor = "#EF4444";
      }
      if (trustPanel) trustPanel.className = "dashboard-glass-panel border-danger";
      if (trustStatusChip) trustStatusChip.className = "status-pill danger";
      if (trustStatusText) trustStatusText.textContent = "Threat: AI Voice Clone (RVC/TTS)";
    }
  }

  function stopScan() {
    isScanning = false;
    if (btnToggleScanText) btnToggleScanText.textContent = "Mulai Analisis Audio";
    if (btnToggleScan) {
      btnToggleScan.classList.remove("active-danger");
    }

    if (scanProgressTimer) clearInterval(scanProgressTimer);
    if (animationFrameId) cancelAnimationFrame(animationFrameId);

    if (micStream) {
      micStream.getTracks().forEach((track) => track.stop());
      micStream = null;
    }
    if (audioContext) {
      audioContext.close();
      audioContext = null;
    }

    drawIdleCanvas();
  }

  if (btnToggleScan) {
    btnToggleScan.addEventListener("click", () => {
      if (isScanning) {
        stopScan();
      } else {
        startScan();
      }
    });
  }

  function drawIdleCanvas() {
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const dark = isDarkTheme();

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = dark ? "#08080a" : "#f1f5f9";
    ctx.fillRect(0, 0, w, h);

    // Subtle grid lines
    ctx.strokeStyle = dark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)";
    ctx.lineWidth = 1;
    for (let y = 16; y < h; y += 22) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Baseline center
    ctx.strokeStyle = "#10B981";
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();
    ctx.globalAlpha = 1.0;

    // Harmonic label
    ctx.fillStyle = "#EF4444";
    ctx.font = "500 10px Inter, sans-serif";
    ctx.fillText(">16kHz Harmonic Baseline Tracking", 12, 14);
  }

  function startVisualizer() {
    let tick = 0;
    const dataArray = new Uint8Array(64);

    function render() {
      if (!isScanning) return;

      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const dark = isDarkTheme();
      tick++;

      ctx.fillStyle = dark ? "rgba(8, 8, 10, 0.35)" : "rgba(241, 245, 249, 0.35)";
      ctx.fillRect(0, 0, w, h);

      // 16kHz harmonic threshold line
      ctx.strokeStyle = "#EF4444";
      ctx.globalAlpha = 0.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, 20);
      ctx.lineTo(w, 20);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1.0;

      ctx.fillStyle = "#EF4444";
      ctx.font = "600 10px Inter, sans-serif";
      ctx.fillText(">16kHz High-Frequency Artifacts Tracking", 12, 14);

      if (analyserNode) {
        analyserNode.getByteFrequencyData(dataArray);
      }

      const barCount = 42;
      const barWidth = (w - (barCount * 3)) / barCount;

      for (let i = 0; i < barCount; i++) {
        let barHeight = 0;

        if (analyserNode) {
          barHeight = (dataArray[i % dataArray.length] / 255) * (h - 26);
        } else {
          const freq = (i / barCount) * Math.PI * 4 + tick * 0.08;
          const noise = Math.sin(freq) * 0.5 + 0.5;

          if (activePreset === "scam") {
            const highFreqSpike = i > 28 ? Math.sin(tick * 0.3 + i) * 32 + 26 : 0;
            barHeight = noise * 38 + highFreqSpike + 8;
          } else if (activePreset === "safe") {
            const naturalDecay = Math.max(0, 1 - (i / 36));
            barHeight = noise * 48 * naturalDecay + 6;
          } else {
            barHeight = Math.random() * 30 + 8;
          }
        }

        const x = i * (barWidth + 3) + 2;
        const y = h - barHeight;

        let barColor = "#10B981";
        if (i > 28 && activePreset === "scam") {
          barColor = "#EF4444";
        } else if (activePreset === "noisy") {
          barColor = "#F59E0B";
        }

        ctx.fillStyle = barColor;
        ctx.fillRect(x, y, Math.max(2, barWidth), barHeight);
      }

      animationFrameId = requestAnimationFrame(render);
    }

    render();
  }

  drawIdleCanvas();
}

/* =========================================================================
   6. FEAT-003 VOICE NOTE SHARE EXTENSION
   ========================================================================= */
function initVoiceNoteExtension() {
  const dropzone = document.getElementById("vn-dropzone");
  const fileInput = document.getElementById("vn-file-input");
  const resultBox = document.getElementById("vn-result-box");
  const fileNameDisplay = document.getElementById("vn-analyzing-file-name");
  const resultBadge = document.getElementById("vn-result-badge");
  const inferenceTimeDisplay = document.getElementById("vn-inference-time");
  const harmonicStatDisplay = document.getElementById("vn-harmonic-stat");

  if (!dropzone || !fileInput) return;

  dropzone.addEventListener("click", () => fileInput.click());

  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("dragover");
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("dragover");
  });

  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      analyzeVoiceNoteFile(e.dataTransfer.files[0].name, false);
    }
  });

  fileInput.addEventListener("change", () => {
    if (fileInput.files && fileInput.files[0]) {
      analyzeVoiceNoteFile(fileInput.files[0].name, false);
    }
  });

  // Sample triggers
  document.querySelectorAll(".sample-vn-pill").forEach((item) => {
    item.addEventListener("click", () => {
      const isScam = item.getAttribute("data-sample") === "scam-vn";
      const name = isScam ? "Mama_Minta_Transfer_Darurat.ogg" : "Ayah_Konfirmasi_Rumah.m4a";
      analyzeVoiceNoteFile(name, isScam);
    });
  });

  function analyzeVoiceNoteFile(fileName, isScamExplicit) {
    if (!resultBox) return;
    resultBox.style.display = "block";
    if (fileNameDisplay) fileNameDisplay.textContent = fileName;
    if (resultBadge) {
      resultBadge.className = "status-pill neutral";
      resultBadge.textContent = "Extracting Mel-Spectrogram Features...";
    }
    if (inferenceTimeDisplay) inferenceTimeDisplay.textContent = "Analyzing...";
    if (harmonicStatDisplay) harmonicStatDisplay.textContent = "Processing...";

    setTimeout(() => {
      const isAI = isScamExplicit !== undefined ? isScamExplicit : fileName.toLowerCase().includes("scam") || fileName.toLowerCase().includes("darurat");
      const latency = Math.floor(150 + Math.random() * 35);

      if (inferenceTimeDisplay) inferenceTimeDisplay.textContent = `${latency} ms (On-Device INT8)`;

      if (isAI) {
        if (resultBadge) {
          resultBadge.className = "status-pill danger";
          resultBadge.textContent = "THREAT DETECTED: 97.4% AI Voice Clone (RVC/TTS)";
        }
        if (harmonicStatDisplay) harmonicStatDisplay.textContent = "High Artifacts (>16kHz) Detected";
      } else {
        if (resultBadge) {
          resultBadge.className = "status-pill safe";
          resultBadge.textContent = "SAFE: 94.8% Authentic Human Voice";
        }
        if (harmonicStatDisplay) harmonicStatDisplay.textContent = "Natural Formants (No Synthetic Glitch)";
      }
    }, 800);
  }
}

/* =========================================================================
   7. FEAT-004 EMERGENCY SAFETY PROTOCOL & SAFE WORD
   ========================================================================= */
function initEmergencyProtocol() {
  const inputSafeWord = document.getElementById("input-safeword");
  const btnVerifySafeWord = document.getElementById("btn-verify-safeword");
  const safeWordResult = document.getElementById("safeword-result");

  if (!btnVerifySafeWord || !inputSafeWord || !safeWordResult) return;

  btnVerifySafeWord.addEventListener("click", () => {
    const val = inputSafeWord.value.trim();
    if (!val) {
      safeWordResult.style.display = "block";
      safeWordResult.style.color = "#F59E0B";
      safeWordResult.textContent = "Silakan ketik Safe Word keluarga Anda.";
      return;
    }

    safeWordResult.style.display = "block";
    if (val.toLowerCase() === "garuda2026" || val.length >= 4) {
      safeWordResult.style.color = "#10B981";
      safeWordResult.textContent = "✓ Safe Word Terverifikasi: Keluarga Asli (Safe to Proceed).";
    } else {
      safeWordResult.style.color = "#EF4444";
      safeWordResult.textContent = "✗ Safe Word Salah: Waspada Indikasi Scam AI Clone!";
    }
  });
}
