const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const tabPane = `
            <!-- TAB: VOICE CLONE -->
            <div class="dash-tab-pane" id="tab-voiceclone">
              <div class="saas-main-header" style="padding:0; margin-bottom: 24px;">
                <div>
                  <h2 class="saas-page-title" style="font-size: 16px;">Voice Cloning & Modulation</h2>
                  <p class="saas-page-subtitle">Simulate real-time AI voice changing (Deep Voice, Synthetic, Masking).</p>
                </div>
              </div>

              <div style="display: flex; flex-direction: column; gap: 20px;">
                <!-- Audio Input Selection -->
                <div class="acoustic-metric-card" style="padding: 16px;">
                  <div style="font-size: 13px; font-weight: 600; margin-bottom: 12px;">Pilih Sumber Suara</div>
                  <div style="display: flex; gap: 10px;">
                    <button class="action-pill-btn" id="vc-btn-mic" style="flex: 1; justify-content: center; height: 40px;">
                      <i class="fa-solid fa-microphone"></i> Live Mic
                    </button>
                    <button class="action-pill-btn" id="vc-btn-file" style="flex: 1; justify-content: center; height: 40px; background: transparent; border: 1px solid var(--panel-border);">
                      <i class="fa-solid fa-file-audio"></i> Unggah Audio
                    </button>
                    <input type="file" id="vc-file-input" accept="audio/*" style="display: none;" />
                  </div>
                  <div id="vc-status-text" style="font-size: 12px; color: var(--muted); margin-top: 12px; text-align: center;">Sumber: Live Mic</div>
                  
                  <div id="vc-audio-player-container" style="display:none; margin-top: 12px; text-align: center;">
                    <audio id="vc-audio-player" controls style="width: 100%; height: 35px;"></audio>
                  </div>
                </div>

                <!-- Effect Selection -->
                <div class="acoustic-metric-card" style="padding: 16px;">
                  <div style="font-size: 13px; font-weight: 600; margin-bottom: 12px;">Pilih Filter Suara (Voice Morph)</div>
                  
                  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                    <button class="preset-pill vc-preset-btn active" data-effect="deep" style="justify-content: center; padding: 12px 8px;">
                      <i class="fa-solid fa-user-secret" style="margin-bottom: 4px; font-size: 16px;"></i><br/>Deep Voice
                    </button>
                    <button class="preset-pill vc-preset-btn" data-effect="robot" style="justify-content: center; padding: 12px 8px;">
                      <i class="fa-solid fa-robot" style="margin-bottom: 4px; font-size: 16px;"></i><br/>Synthetic
                    </button>
                    <button class="preset-pill vc-preset-btn" data-effect="alien" style="justify-content: center; padding: 12px 8px;">
                      <i class="fa-solid fa-ghost" style="margin-bottom: 4px; font-size: 16px;"></i><br/>Chipmunk
                    </button>
                  </div>
                  
                  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 10px;">
                    <button class="preset-pill vc-preset-btn" data-effect="radio" style="justify-content: center; padding: 12px 8px;">
                      <i class="fa-solid fa-walkie-talkie" style="margin-bottom: 4px; font-size: 16px;"></i><br/>Walkie Talkie
                    </button>
                    <button class="preset-pill vc-preset-btn" data-effect="echo" style="justify-content: center; padding: 12px 8px;">
                      <i class="fa-solid fa-mountain" style="margin-bottom: 4px; font-size: 16px;"></i><br/>Cave Echo
                    </button>
                  </div>
                </div>
                
                <div class="acoustic-metric-card" style="padding: 16px; background: rgba(59, 130, 246, 0.05); border-color: rgba(59, 130, 246, 0.2);">
                   <div style="display: flex; align-items: center; gap: 10px;">
                      <i class="fa-solid fa-circle-info" style="color: var(--text);"></i>
                      <div style="font-size: 11px; color: var(--text); line-height: 1.5;">Gunakan headphone (earphone) untuk menghindari feedback audio yang menyakitkan telinga saat menggunakan mode Live Mic.</div>
                   </div>
                </div>

                <button class="action-pill-btn" id="btn-toggle-vc" style="height: 44px; width: 100%; justify-content: center; font-size: 14px; background: var(--text); color: var(--bg);">
                  <i class="fa-solid fa-play"></i>
                  <span id="btn-toggle-vc-text">Mulai Voice Clone</span>
                </button>
              </div>
            </div>

            <!-- TAB 3: FAMILY SAFE WORD VAULT -->
            <div class="dash-tab-pane" id="tab-safeword">
`;

html = html.replace(/<!-- TAB 3: FAMILY SAFE WORD VAULT -->\s*<div class="dash-tab-pane" id="tab-safeword">/g, tabPane);
fs.writeFileSync('index.html', html);
