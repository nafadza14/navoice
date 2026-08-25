const fs = require('fs');
let js = fs.readFileSync('main.js', 'utf8');

const applyEffectToNodeLogicOld = `
  function applyEffectToNode(biquad, effect) {
     if (effect === "deep") {
        // Deep voice simulation: Lowpass + peaking
        biquad.type = "lowpass";
        biquad.frequency.value = 800;
        biquad.Q.value = 1.2;
     } else if (effect === "robot") {
        // Synthetic: Bandpass + high Q
        biquad.type = "bandpass";
        biquad.frequency.value = 1200;
        biquad.Q.value = 5.0;
     } else if (effect === "alien") {
        // Chipmunk / High pitch simulation: Highpass
        biquad.type = "highpass";
        biquad.frequency.value = 1600;
        biquad.Q.value = 2.5;
     }
  }
`;

const applyEffectToNodeLogicNew = `
  function applyEffectToNode(biquad, effect) {
     // Ensure we clear previous connections if we're using complex routing... but biquad is just one node here.
     // For a single biquad:
     if (effect === "deep") {
        biquad.type = "lowpass";
        biquad.frequency.value = 600;
        biquad.Q.value = 1.5;
     } else if (effect === "robot") {
        biquad.type = "bandpass";
        biquad.frequency.value = 1000;
        biquad.Q.value = 8.0;
     } else if (effect === "alien") {
        biquad.type = "highpass";
        biquad.frequency.value = 2000;
        biquad.Q.value = 3.0;
     } else if (effect === "radio") {
        biquad.type = "bandpass";
        biquad.frequency.value = 1500;
        biquad.Q.value = 2.5;
     } else if (effect === "echo") {
        biquad.type = "lowshelf"; // We can't really do echo with just one biquad, but let's fake a muffled bassy echo profile
        biquad.frequency.value = 400;
        biquad.gain.value = 10;
     }
  }
`;

js = js.replace(applyEffectToNodeLogicOld, applyEffectToNodeLogicNew);

// Add the echo node to the graph dynamically if effect is echo.
// Actually, doing a real echo requires a DelayNode. Since the user wants complete features, let's implement a real DelayNode based effect!

const startVCOld = `
    vcProcessorNode = vcAudioContext.createBiquadFilter();
    applyEffectToNode(vcProcessorNode, activeEffect);

    vcGainNode = vcAudioContext.createGain();
    vcGainNode.gain.value = 1.5;
`;

const startVCNew = `
    // Create nodes
    vcProcessorNode = vcAudioContext.createBiquadFilter();
    
    // We add an optional delay node for echo
    vcDelayNode = vcAudioContext.createDelay();
    vcDelayNode.delayTime.value = 0.3; // 300ms
    vcDelayGain = vcAudioContext.createGain();
    vcDelayGain.gain.value = 0.4;
    
    // Default effect apply
    applyEffectToNode(vcProcessorNode, activeEffect);

    vcGainNode = vcAudioContext.createGain();
    vcGainNode.gain.value = 1.5;
`;

if(!js.includes('vcDelayNode = vcAudioContext.createDelay();')) {
    js = js.replace(startVCOld, startVCNew);
    
    // Also we need to declare these at the top of initVoiceCloneEngine
    js = js.replace('let vcProcessorNode = null;', 'let vcProcessorNode = null;\n  let vcDelayNode = null;\n  let vcDelayGain = null;');
    
    // And in the connect graph:
    const connectMicOld = `
        vcSourceNode.connect(vcProcessorNode);
        vcProcessorNode.connect(vcGainNode);
        vcGainNode.connect(vcAudioContext.destination);
`;
    const connectMicNew = `
        vcSourceNode.connect(vcProcessorNode);
        vcProcessorNode.connect(vcGainNode);
        
        if (activeEffect === "echo") {
            vcProcessorNode.connect(vcDelayNode);
            vcDelayNode.connect(vcDelayGain);
            vcDelayGain.connect(vcGainNode);
        }
        
        vcGainNode.connect(vcAudioContext.destination);
`;
    js = js.replace(connectMicOld, connectMicNew);
    
    const connectFileOld = `
          vcSourceNode.connect(vcProcessorNode);
          vcProcessorNode.connect(vcGainNode);
          vcGainNode.connect(vcAudioContext.destination);
`;
    const connectFileNew = `
          vcSourceNode.connect(vcProcessorNode);
          vcProcessorNode.connect(vcGainNode);
          if (activeEffect === "echo") {
              vcProcessorNode.connect(vcDelayNode);
              vcDelayNode.connect(vcDelayGain);
              vcDelayGain.connect(vcGainNode);
          }
          vcGainNode.connect(vcAudioContext.destination);
`;
    js = js.replace(connectFileOld, connectFileNew);
    js = js.replace(connectFileOld, connectFileNew); // Replace both occurrences in file loading
}

// We also need to reconnect on the fly if activeEffect changes while isActive
const presetEffectChangeOld = `
      if (isActive && vcProcessorNode) {
         applyEffectToNode(vcProcessorNode, activeEffect);
      }
`;
const presetEffectChangeNew = `
      if (isActive && vcProcessorNode) {
         // Re-run the graph connection if switching to/from echo
         stopVC();
         startVC();
      }
`;
js = js.replace(presetEffectChangeOld, presetEffectChangeNew);


fs.writeFileSync('main.js', js);
