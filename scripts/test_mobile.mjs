import { spawn } from 'child_process';
import fs from 'fs';

const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless=new',
  '--remote-debugging-port=9223',
  '--user-data-dir=/tmp/chrome_mobile_' + Date.now(),
  '--window-size=390,844',
  '--disable-gpu',
  'about:blank'
]);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getWsUrl() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch('http://127.0.0.1:9223/json/list');
      if (res.ok) {
        const targets = await res.json();
        const page = targets.find(t => t.type === 'page');
        if (page && page.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
      }
    } catch (e) {}
    await sleep(200);
  }
  throw new Error("Could not connect to Chrome CDP mobile");
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
        pending.set(msgId, (res) => resolve(res));
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });

    console.log("Navigating to mobile view...");
    await send('Page.navigate', { url: 'http://localhost:5173/' });
    await sleep(2500);

    // Section 1 mobile
    const m1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('verify_mobile_section1.png', Buffer.from(m1.result.data, 'base64'));
    console.log("Saved verify_mobile_section1.png");

    // Scroll to section 2
    await send('Runtime.evaluate', {
      expression: `(() => {
        document.getElementById('wishes-section').scrollIntoView({ behavior: 'instant' });
        document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('is-revealed'));
      })()`
    });
    await sleep(800);
    const m2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('verify_mobile_section2.png', Buffer.from(m2.result.data, 'base64'));
    console.log("Saved verify_mobile_section2.png");

    // Scroll to section 3
    await send('Runtime.evaluate', {
      expression: `(() => {
        document.getElementById('cake-section').scrollIntoView({ behavior: 'instant' });
        document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('is-revealed'));
      })()`
    });
    await sleep(800);
    const m3 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('verify_mobile_section3.png', Buffer.from(m3.result.data, 'base64'));
    console.log("Saved verify_mobile_section3.png");

    ws.close();
  } catch (err) {
    console.error("Mobile test error:", err);
  } finally {
    chrome.kill();
  }
}

run();

