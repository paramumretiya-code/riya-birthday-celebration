import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';

// Launch Chrome with remote debugging
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--user-data-dir=/tmp/chrome_cdp_profile_' + Date.now(),
  '--window-size=1280,850',
  '--disable-gpu',
  'about:blank'
]);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getWsUrl() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch('http://127.0.0.1:9222/json/list');
      if (res.ok) {
        const targets = await res.json();
        const page = targets.find(t => t.type === 'page');
        if (page && page.webSocketDebuggerUrl) {
          return page.webSocketDebuggerUrl;
        }
      }
    } catch (e) {}
    await sleep(200);
  }
  throw new Error("Could not connect to Chrome CDP page target");
}

async function run() {
  try {
    const wsUrl = await getWsUrl();
    const ws = new WebSocket(wsUrl);

    let id = 1;
    const pending = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && pending.has(msg.id)) {
        pending.get(msg.id)(msg);
        pending.delete(msg.id);
      }
    };

    await new Promise(res => ws.onopen = res);

    function send(method, params = {}) {
      return new Promise((resolve) => {
        const msgId = id++;
        pending.set(msgId, (res) => {
          if (res.error) console.error("CDP method error:", method, res.error);
          resolve(res);
        });
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    // Enable Page and Runtime
    await send('Page.enable');
    await send('Runtime.enable');
    await send('DOM.enable');

    console.log("Navigating to http://localhost:5173/...");
    await send('Page.navigate', { url: 'http://localhost:5173/' });
    await sleep(2500);

    // Evaluate section metrics
    const metrics = await send('Runtime.evaluate', {
      expression: `(() => {
        const s1 = document.getElementById('welcome-section');
        const s2 = document.getElementById('wishes-section');
        const s3 = document.getElementById('cake-section');
        return {
          s1: { offsetTop: s1.offsetTop, offsetHeight: s1.offsetHeight },
          s2: { offsetTop: s2.offsetTop, offsetHeight: s2.offsetHeight },
          s3: { offsetTop: s3.offsetTop, offsetHeight: s3.offsetHeight },
          windowScrollY: window.scrollY,
          docHeight: document.documentElement.scrollHeight
        };
      })()`,
      returnByValue: true
    });
    console.log("Initial Section Metrics:", JSON.stringify(metrics?.result?.result?.value, null, 2));

    // Capture initial Section 1
    const snap1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('verify_cdp_section1.png', Buffer.from(snap1.result.data, 'base64'));
    console.log("Saved verify_cdp_section1.png");

    // Click "LET'S CELEBRATE ✨"
    console.log("Clicking LET'S CELEBRATE...");
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.getElementById('btn-to-wishes');
        if (btn) btn.click();
      })()`
    });
    await sleep(1500);

    // Check audio state & scroll position
    const afterCelebrate = await send('Runtime.evaluate', {
      expression: `(() => {
        const audioBtn = document.getElementById('btn-audio-toggle');
        const statusLabel = document.getElementById('audio-status-label');
        const activeStep = document.querySelector('.step-item.active .step-text')?.textContent;
        return {
          scrollY: window.scrollY,
          audioBtnPlaying: audioBtn.classList.contains('playing'),
          statusLabelText: statusLabel ? statusLabel.textContent : null,
          activeStep: activeStep
        };
      })()`,
      returnByValue: true
    });
    console.log("After LET'S CELEBRATE click:", JSON.stringify(afterCelebrate?.result?.result?.value, null, 2));

    // Ensure wishes section is in view & capture Section 2
    await send('Runtime.evaluate', {
      expression: `(() => {
        const s2 = document.getElementById('wishes-section');
        s2.scrollIntoView({ behavior: 'instant' });
        // Force reveal check
        document.querySelectorAll('.reveal-on-scroll').forEach(el => {
          const r = el.getBoundingClientRect();
          if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('is-revealed');
        });
      })()`
    });
    await sleep(800);

    const snap2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('verify_cdp_section2.png', Buffer.from(snap2.result.data, 'base64'));
    console.log("Saved verify_cdp_section2.png");

    // Scroll to Cake Section & trigger lighting
    console.log("Scrolling to Section 3 (Cake)...");
    await send('Runtime.evaluate', {
      expression: `(() => {
        const s3 = document.getElementById('cake-section');
        s3.scrollIntoView({ behavior: 'instant' });
        document.querySelectorAll('.reveal-on-scroll').forEach(el => {
          const r = el.getBoundingClientRect();
          if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('is-revealed');
        });
      })()`
    });
    await sleep(1200);

    const snap3 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('verify_cdp_section3_candles.png', Buffer.from(snap3.result.data, 'base64'));
    console.log("Saved verify_cdp_section3_candles.png");

    // Click "CUT THE CAKE 🎂"
    console.log("Clicking CUT THE CAKE...");
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.getElementById('btn-cut-cake');
        if (btn) btn.click();
      })()`
    });
    // Wait for knife slice animation to complete (approx 2s)
    await sleep(2500);

    const afterCut = await send('Runtime.evaluate', {
      expression: `(() => {
        const celebBox = document.getElementById('celebration-message-box');
        const cutBtn = document.getElementById('btn-cut-cake');
        return {
          celebBoxActive: celebBox.classList.contains('active'),
          cutBtnDisplay: cutBtn.style.display,
          greeting: celebBox.querySelector('.celebration-greeting')?.textContent,
          quote: celebBox.querySelector('.celebration-sweet-quote')?.textContent
        };
      })()`,
      returnByValue: true
    });
    console.log("After Cut:", JSON.stringify(afterCut?.result?.result?.value, null, 2));

    const snap4 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('verify_cdp_section3_cut.png', Buffer.from(snap4.result.data, 'base64'));
    console.log("Saved verify_cdp_section3_cut.png");

    // Click "CELEBRATE AGAIN ✨"
    console.log("Clicking CELEBRATE AGAIN...");
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btnAgain = document.getElementById('btn-celebrate-again');
        if (btnAgain) btnAgain.click();
      })()`
    });
    await sleep(1000);

    const afterAgain = await send('Runtime.evaluate', {
      expression: `(() => {
        const celebBox = document.getElementById('celebration-message-box');
        const cutBtn = document.getElementById('btn-cut-cake');
        return {
          celebBoxActive: celebBox.classList.contains('active'),
          cutBtnDisplay: cutBtn.style.display
        };
      })()`,
      returnByValue: true
    });
    console.log("After CELEBRATE AGAIN:", JSON.stringify(afterAgain?.result?.result?.value, null, 2));

    const snap5 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('verify_cdp_section3_celebrate_again.png', Buffer.from(snap5.result.data, 'base64'));
    console.log("Saved verify_cdp_section3_celebrate_again.png");

    ws.close();
  } catch (err) {
    console.error("CDP Test error:", err);
  } finally {
    chrome.kill();
  }
}

run();
