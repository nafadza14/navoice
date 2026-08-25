const fs = require('fs');
let js = fs.readFileSync('main.js', 'utf8');

const oldLogic = `
        let aiRiskScore = 0;
        // Normal mics have high jitter due to ambient noise. True AI TTS has EXTREMELY low jitter (< 0.15)
        if (jitter > 0 && jitter < 0.15) {
          aiRiskScore += 40; // Robotically perfect pitch
        } else if (jitter >= 0.15 && jitter < 0.35) {
          aiRiskScore += 15;
        } else if (jitter >= 0.5) {
          aiRiskScore -= 30; // Natural human voice fluctuation
        }

        if (spectral.hfCutoffDetected && rms > 0.05) {
          aiRiskScore += 35; // Artificial cutoff
        } else if (spectral.hfRatio > 0.6) {
          aiRiskScore += 20; // High frequency artifact
        } else if (spectral.flatness < 0.25) {
          aiRiskScore -= 30; // Natural resonance
        }
        
        // Base bias towards human
        aiRiskScore -= 10;
`;

const newLogic = `
        let aiRiskScore = 0;
        
        // --- HIGH ACCURACY HUMAN CALIBRATION ---
        // Jika jitter berada di rentang normal pita suara manusia (0.15 - 2.5) 
        if (jitter >= 0.15 && jitter <= 2.8) {
          aiRiskScore -= 45; // Kuat ke arah manusia
        } else if (jitter > 0 && jitter < 0.15) {
          aiRiskScore += 45; // Robotik / AI murni
        }

        // Cek frekuensi resonansi vokal asli
        if (spectral.flatness < 0.35 && rms > 0.01) {
          aiRiskScore -= 40; // Vokal natural yang jelas
        } else if (spectral.flatness > 0.5) {
          aiRiskScore += 25; // Noise buatan/sintetis
        }
        
        // Cek anomali high-frequency (biasa di model AI lama)
        if (spectral.hfCutoffDetected && rms > 0.03) {
          aiRiskScore += 50; 
        }
`;

js = js.replace(oldLogic, newLogic);

// Make smoothing slightly faster to react to Human voice, while keeping it stable
js = js.replace('smoothedAiProb = (smoothedAiProb * 0.90) + (instantAiProb * 0.10);', 'smoothedAiProb = (smoothedAiProb * 0.85) + (instantAiProb * 0.15);');

fs.writeFileSync('main.js', js);
