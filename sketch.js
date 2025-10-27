// Translated to p5.js fork: oggy  https://openprocessing.org/sketch/555063

const numb = 55;
const step = 8;
const dist = 50;
const distortion = 15;
let dots = [];

// 新增 overlay 變數與要顯示的 URL
let overlayBackdrop = null;
let overlayModal = null;
let overlayIframe = null;
let overlayCloseBtn = null;
const iframeURL = 'https://11132115-beep.github.io/2025.10.20/';
// 新增：第一單元講義 URL（HackMD）
const iframeURL2 = 'https://hackmd.io/@IPa9_G7tTe268b5mtxTumQ/BkSmvX0ogg';


// 新增：選單相關狀態
let menuWidth = 200;
let menuX = -menuWidth;        // 畫面外
let menuTargetX = -menuWidth;  // 目標位置（滑入/滑出）
let currentPage = 0;           // 0 = 主畫面, 1/2/3 = 頁面一/二/三

function setup() {
  // 全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  background(200);
  stroke(256);
  const dx = (width - numb * step) / 2;
  const dy = (height - numb * step) / 2;
  for (let i = 0; i < numb; i++) {
    dots[i] = [];
    for (let j = 0; j < numb; j++) {
      dots[i][j] = new Dot(i * step + dx, j * step + dy);
    }
  }

  // 建立 overlay DOM（預設隱藏）
  createOverlay();
}

function draw() {
  // 背景
  fill(0);
  rect(0, 0, width, height);
  const m = createVector(mouseX, mouseY);
  for (let i = 0; i < numb; i++) {
    for (let j = 0; j < numb; j++) {
      dots[i][j].update(m);
    }
  }

  // 選單邏輯：當滑鼠 X 小於 100 時滑出
  if (mouseX < 100) menuTargetX = 0;
  else menuTargetX = -menuWidth;
  // 平滑動畫
  menuX += (menuTargetX - menuX) * 0.2;

  // 繪製滑出選單（在最上層）
  push();
  translate(menuX, 0);
  noStroke();
  fill(30, 30, 30, 230);
  rect(0, 0, menuWidth, height);

  // 按鈕設定（改為 4 個按鈕）
  const btnW = menuWidth - 30;
  const btnH = 48;
  const startY = 80;
  const gap = 12;

  textAlign(LEFT, CENTER);
  textSize(20);
  fill(220);
  text("選單", 20, 40);

  // 新標籤陣列
  const labels = [
    "1. 第一單元作品",
    "2. 第一單元講義",
    "3. 測驗系統",
    "4. 回到首頁"
  ];

  // 四個按鈕：1~4
  for (let i = 0; i < labels.length; i++) {
    const bx = 15;
    const by = startY + i * (btnH + gap);
    // 按鈕背景（當滑鼠位於按鈕上時改變顏色）
    if (mouseX - menuX >= bx && mouseX - menuX <= bx + btnW &&
        mouseY >= by - btnH/2 && mouseY <= by + btnH/2) {
      fill(100);
    } else {
      fill(60);
    }
    rect(bx, by - btnH/2, btnW, btnH, 6);

    // 按鈕文字
    fill(240);
    textAlign(LEFT, CENTER);
    // 留一些左邊距
    text(labels[i], bx + 12, by);
  }
  pop();

  // 若已切換頁面，繪製頁面指示（示範內容）
  if (currentPage !== 0) {
    push();
    fill(0, 200);
    rect(0, 0, width, height);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(48);
    text(`頁面 ${currentPage}`, width / 2, height / 2);
    pop();
  }
}

// 新增：建立 overlay DOM（背板 + modal + iframe + 關閉按鈕）
function createOverlay() {
  if (overlayBackdrop) return;

  overlayBackdrop = document.createElement('div');
  Object.assign(overlayBackdrop.style, {
    position: 'fixed',
    left: '0',
    top: '0',
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0.6)',
    display: 'none',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    overflow: 'auto'
  });
  document.body.appendChild(overlayBackdrop);

  overlayModal = document.createElement('div');
  Object.assign(overlayModal.style, {
    position: 'relative',
    width: '70vw',    // 70% 寬
    height: '85vh',   // 85% 高
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
    overflow: 'hidden'
  });
  overlayBackdrop.appendChild(overlayModal);

  overlayIframe = document.createElement('iframe');
  overlayIframe.setAttribute('src', '');
  overlayIframe.setAttribute('frameborder', '0');
  Object.assign(overlayIframe.style, {
    width: '100%',
    height: '100%',
    border: '0',
    display: 'block'
  });
  overlayModal.appendChild(overlayIframe);

  overlayCloseBtn = document.createElement('button');
  overlayCloseBtn.innerText = '✕';
  Object.assign(overlayCloseBtn.style, {
    position: 'absolute',
    right: '8px',
    top: '8px',
    zIndex: 10001,
    background: 'rgba(0,0,0,0.6)',
    color: '#fff',
    border: 'none',
    padding: '6px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  });
  overlayModal.appendChild(overlayCloseBtn);

  // 點擊 backdrop（背景）會關閉 overlay
  overlayBackdrop.addEventListener('click', (e) => {
    if (e.target === overlayBackdrop) hideOverlay();
  });

  // 關閉按鈕
  overlayCloseBtn.addEventListener('click', hideOverlay);

  // Esc 鍵關閉
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideOverlay();
  });
}

function showOverlay(url, pageNum = 1) {
  if (!overlayBackdrop) createOverlay();
  overlayIframe.src = url;
  overlayBackdrop.style.display = 'flex';
  currentPage = pageNum;
}

function hideOverlay() {
  if (!overlayBackdrop) return;
  overlayBackdrop.style.display = 'none';
  overlayIframe.src = 'about:blank';
  currentPage = 0;
}

// 新增：將畫布與點陣在視窗改變時重新配置
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  const dx = (width - numb * step) / 2;
  const dy = (height - numb * step) / 2;
  for (let i = 0; i < numb; i++) {
    for (let j = 0; j < numb; j++) {
      const x = i * step + dx;
      const y = j * step + dy;
      dots[i][j].origin = createVector(x, y);
      dots[i][j].pos = dots[i][j].origin.copy();
      dots[i][j].speed.set(0, 0);
    }
  }
}

class Dot {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.origin = this.pos.copy();
    this.speed = createVector(0, 0);
  }
  
  update(m) {
    let tmp = this.origin.copy();
    tmp.sub(m);
    const d = tmp.mag();
    const c = map(d, 0, dist, 0, PI);
    tmp.normalize();
    tmp.mult(distortion * sin(c));
    
    let strokeWidth;
    if (d < dist) strokeWidth = 1 + 10 * abs(cos(c / 2));
    else strokeWidth = map(min(d, width), 0, width, 5, 0.1);
   
    const target = createVector(this.origin.x + tmp.x, this.origin.y + tmp.y);
    tmp = this.pos.copy();
    tmp.sub(target);
    tmp.mult(-map(m.dist(this.pos), 0, 2 * width, 0.1, 0.01));
    this.speed.add(tmp);
    this.speed.mult(0.87);
    this.pos.add(this.speed);

    strokeWeight(strokeWidth);
    point(this.pos.x, this.pos.y);
  }
}

// 修改 mousePressed：1 顯示 iframe overlay（置中、70% x 85%），2 也用 iframe overlay（講義），其他保留
function mousePressed() {
  // 如果選單可見或滑出的範圍包含滑鼠，檢查按鈕點擊
  const localX = mouseX - menuX;
  if (localX >= 0 && localX <= menuWidth) {
    const btnW = menuWidth - 30;
    const btnH = 48;
    const startY = 80;
    const gap = 12;
    const btnCount = 4;
    for (let i = 0; i < btnCount; i++) {
      const bx = 15;
      const by = startY + i * (btnH + gap);
      if (localX >= bx && localX <= bx + btnW &&
          mouseY >= by - btnH/2 && mouseY <= by + btnH/2) {
        const idx = i + 1;
        if (idx === 1) {
          // 使用 iframe overlay 顯示指定 URL（置中、70% 寬、85% 高）
          showOverlay(iframeURL, 1);
        } else if (idx === 2) {
          // 用 iframe overlay 顯示第一單元講義（HackMD）
          showOverlay(iframeURL2, 2);
        } else if (idx === 3) {
          currentPage = 3;
          window.open('page3.html', '_blank');
        } else if (idx === 4) {
          // 回到首頁（同頁導向或自行修改）
          currentPage = 0;
          window.location.href = iframeURL;
        }
        // 點擊後收起選單
        menuTargetX = -menuWidth;
        break;
      }
    }
  }
}
