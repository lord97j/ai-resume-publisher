import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const assetDir = path.join(root, "docs", "assets");

function coverSvg() {
  return `<svg width="1280" height="640" viewBox="0 0 1280 640" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1280" height="640" fill="#edf2ee"/>
  <rect x="72" y="64" width="1136" height="512" rx="24" fill="#fbfbf7" stroke="#d6ded8"/>
  <text x="120" y="148" fill="#0f766e" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="800">AI RESUME PUBLISHER</text>
  <text x="120" y="248" fill="#18211e" font-family="Inter, Arial, sans-serif" font-size="76" font-weight="900">Git-native AI resume pages</text>
  <text x="120" y="316" fill="#5d6d67" font-family="Inter, Arial, sans-serif" font-size="30">Generate, tailor, encrypt, publish, and export static resumes from branches.</text>
  <g transform="translate(120 390)">
    <rect width="184" height="54" rx="12" fill="#0b3d39"/>
    <text x="28" y="35" fill="#fff" font-family="Inter, Arial, sans-serif" font-size="20" font-weight="800">GitHub Pages</text>
    <rect x="204" width="152" height="54" rx="12" fill="#e9f5f2" stroke="#0f766e"/>
    <text x="232" y="35" fill="#0b3d39" font-family="Inter, Arial, sans-serif" font-size="20" font-weight="800">Vercel</text>
    <rect x="376" width="180" height="54" rx="12" fill="#fff4d7" stroke="#b45309"/>
    <text x="408" y="35" fill="#73350b" font-family="Inter, Arial, sans-serif" font-size="20" font-weight="800">PDF Releases</text>
  </g>
  <g transform="translate(806 146)">
    <rect width="282" height="360" rx="18" fill="#ffffff" stroke="#cfd8d3"/>
    <rect x="34" y="42" width="150" height="20" rx="10" fill="#18211e"/>
    <rect x="34" y="80" width="210" height="10" rx="5" fill="#8ca098"/>
    <rect x="34" y="112" width="214" height="2" fill="#18211e"/>
    <rect x="34" y="146" width="96" height="10" rx="5" fill="#0f766e"/>
    <rect x="34" y="174" width="214" height="8" rx="4" fill="#d7dfda"/>
    <rect x="34" y="196" width="180" height="8" rx="4" fill="#d7dfda"/>
    <rect x="34" y="238" width="96" height="10" rx="5" fill="#0f766e"/>
    <rect x="34" y="266" width="214" height="8" rx="4" fill="#d7dfda"/>
    <rect x="34" y="288" width="190" height="8" rx="4" fill="#d7dfda"/>
  </g>
</svg>`;
}

function demoResumeSvg() {
  return `<svg width="1280" height="760" viewBox="0 0 1280 760" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1280" height="760" fill="#edf2ee"/>
  <rect x="150" y="32" width="980" height="696" fill="#fbfbf7" stroke="#d9e0dc"/>
  <text x="198" y="92" fill="#0f766e" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="800">PUBLIC RESUME</text>
  <text x="198" y="176" fill="#1c2522" font-family="Inter, Arial, sans-serif" font-size="72" font-weight="900">Alex Chen</text>
  <text x="198" y="215" fill="#66736f" font-family="Inter, Arial, sans-serif" font-size="24">Frontend Engineer</text>
  <rect x="198" y="254" width="884" height="4" fill="#1c2522"/>
  <text x="198" y="314" fill="#1c2522" font-family="Inter, Arial, sans-serif" font-size="24">Frontend engineer focused on AI-assisted productivity tools,</text>
  <text x="198" y="348" fill="#1c2522" font-family="Inter, Arial, sans-serif" font-size="24">design systems, and reliable web delivery.</text>
  <g fill="#d9e0dc">
    <rect x="198" y="392" width="430" height="1"/>
    <rect x="646" y="392" width="436" height="1"/>
    <rect x="198" y="476" width="430" height="1"/>
    <rect x="646" y="476" width="436" height="1"/>
  </g>
  <text x="198" y="426" fill="#66736f" font-family="Inter, Arial, sans-serif" font-size="17">Email</text>
  <text x="198" y="456" fill="#1c2522" font-family="Inter, Arial, sans-serif" font-size="20" font-weight="800">Available in private resume</text>
  <text x="646" y="426" fill="#66736f" font-family="Inter, Arial, sans-serif" font-size="17">Phone</text>
  <text x="646" y="456" fill="#1c2522" font-family="Inter, Arial, sans-serif" font-size="20" font-weight="800">Available in private resume</text>
  <text x="198" y="510" fill="#66736f" font-family="Inter, Arial, sans-serif" font-size="17">Location</text>
  <text x="198" y="540" fill="#1c2522" font-family="Inter, Arial, sans-serif" font-size="20" font-weight="800">San Francisco, CA, US</text>
  <text x="646" y="510" fill="#66736f" font-family="Inter, Arial, sans-serif" font-size="17">GitHub</text>
  <text x="646" y="540" fill="#0b3d39" font-family="Inter, Arial, sans-serif" font-size="20" font-weight="800">https://github.com/alexchen</text>
  <text x="198" y="626" fill="#1c2522" font-family="Inter, Arial, sans-serif" font-size="20" font-weight="900">EXPERIENCE</text>
  <rect x="198" y="642" width="884" height="1" fill="#d9e0dc"/>
  <text x="198" y="684" fill="#1c2522" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="800">Senior Frontend Engineer</text>
  <text x="894" y="684" fill="#66736f" font-family="Inter, Arial, sans-serif" font-size="18">2023-01 - Present</text>
</svg>`;
}

function makeEncryptionGif() {
  const width = 640;
  const height = 360;
  const palette = [
    [237, 242, 238],
    [251, 251, 247],
    [28, 37, 34],
    [15, 118, 110],
    [217, 224, 220],
    [11, 61, 57],
    [255, 244, 215],
    [180, 83, 9],
    [102, 115, 111],
    [255, 255, 255]
  ];
  while (palette.length < 256) palette.push([0, 0, 0]);

  const frames = [
    (p) => drawFlowFrame(p, width, height, "PUBLIC", "REDACT", 0),
    (p) => drawFlowFrame(p, width, height, "ENCRYPT", "AES GCM", 1),
    (p) => drawFlowFrame(p, width, height, "URL KEY", "FRAGMENT", 2),
    (p) => drawFlowFrame(p, width, height, "PRIVATE", "UNLOCKED", 3)
  ].map((draw) => {
    const pixels = new Uint8Array(width * height).fill(0);
    draw(pixels);
    return pixels;
  });

  return encodeGif(width, height, palette, frames, 90);
}

function drawFlowFrame(pixels, width, height, title, subtitle, active) {
  rect(pixels, width, 40, 40, 560, 280, 1);
  rect(pixels, width, 68, 78, 150, 168, active === 0 ? 3 : 9);
  rect(pixels, width, 245, 78, 150, 168, active === 1 ? 3 : 9);
  rect(pixels, width, 422, 78, 150, 168, active >= 2 ? 3 : 9);
  rect(pixels, width, 218, 154, 27, 10, 4);
  rect(pixels, width, 395, 154, 27, 10, 4);
  rect(pixels, width, 82, 98, 122, 18, 4);
  rect(pixels, width, 82, 132, 96, 10, 4);
  rect(pixels, width, 82, 152, 108, 10, 4);
  rect(pixels, width, 82, 172, 72, 10, 4);
  rect(pixels, width, 270, 112, 72, 72, 6);
  rect(pixels, width, 292, 92, 28, 36, 5);
  rect(pixels, width, 440, 108, 114, 20, 4);
  rect(pixels, width, 440, 144, 92, 12, 4);
  rect(pixels, width, 440, 170, 104, 12, 4);
  text(pixels, width, 76, 282, title, 2, 5);
  text(pixels, width, 76, 314, subtitle, 8, 3);
}

function rect(pixels, width, x, y, w, h, color) {
  for (let row = y; row < y + h; row += 1) {
    for (let col = x; col < x + w; col += 1) {
      pixels[row * width + col] = color;
    }
  }
}

const font = {
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
  C: ["01111", "10000", "10000", "10000", "10000", "10000", "01111"],
  D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  F: ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
  G: ["01111", "10000", "10000", "10011", "10001", "10001", "01110"],
  I: ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
  K: ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
  L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
  N: ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
  P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  U: ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
  V: ["10001", "10001", "10001", "10001", "10001", "01010", "00100"],
  Y: ["10001", "10001", "01010", "00100", "00100", "00100", "00100"],
  " ": ["00000", "00000", "00000", "00000", "00000", "00000", "00000"]
};

function text(pixels, width, x, y, value, color, scale) {
  let cursor = x;
  for (const char of value) {
    const rows = font[char] || font[" "];
    for (let row = 0; row < rows.length; row += 1) {
      for (let col = 0; col < rows[row].length; col += 1) {
        if (rows[row][col] === "1") rect(pixels, width, cursor + col * scale, y + row * scale, scale, scale, color);
      }
    }
    cursor += 6 * scale;
  }
}

function encodeGif(width, height, palette, frames, delay) {
  const chunks = [];
  chunks.push(Buffer.from("GIF89a", "ascii"));
  chunks.push(word(width), word(height), Buffer.from([0xf7, 0x00, 0x00]));
  chunks.push(Buffer.from(palette.flat()));
  chunks.push(Buffer.from([0x21, 0xff, 0x0b]), Buffer.from("NETSCAPE2.0", "ascii"), Buffer.from([0x03, 0x01, 0x00, 0x00, 0x00]));

  for (const pixels of frames) {
    chunks.push(Buffer.from([0x21, 0xf9, 0x04, 0x04]), word(delay), Buffer.from([0x00, 0x00]));
    chunks.push(Buffer.from([0x2c]), word(0), word(0), word(width), word(height), Buffer.from([0x00, 0x08]));
    chunks.push(subBlocks(lzwEncode(pixels, 8)));
  }

  chunks.push(Buffer.from([0x3b]));
  return Buffer.concat(chunks);
}

function lzwEncode(pixels, minCodeSize) {
  const clear = 1 << minCodeSize;
  const end = clear + 1;
  let codeSize = minCodeSize + 1;
  let nextCode = end + 1;
  let dict = new Map();
  const codes = [clear];
  let prefix = String(pixels[0]);

  const reset = () => {
    dict = new Map();
    for (let index = 0; index < clear; index += 1) dict.set(String(index), index);
    codeSize = minCodeSize + 1;
    nextCode = end + 1;
  };

  reset();
  for (let index = 1; index < pixels.length; index += 1) {
    const entry = String(pixels[index]);
    const joined = `${prefix},${entry}`;
    if (dict.has(joined)) {
      prefix = joined;
    } else {
      codes.push(dict.get(prefix));
      if (nextCode < 4096) {
        dict.set(joined, nextCode++);
        if (nextCode === 1 << codeSize && codeSize < 12) codeSize += 1;
      } else {
        codes.push(clear);
        reset();
      }
      prefix = entry;
    }
  }
  codes.push(dict.get(prefix), end);

  const bytes = [];
  let bitBuffer = 0;
  let bitCount = 0;
  codeSize = minCodeSize + 1;
  nextCode = end + 1;

  for (const code of codes) {
    bitBuffer |= code << bitCount;
    bitCount += codeSize;
    while (bitCount >= 8) {
      bytes.push(bitBuffer & 0xff);
      bitBuffer >>= 8;
      bitCount -= 8;
    }
    if (code === clear) {
      codeSize = minCodeSize + 1;
      nextCode = end + 1;
    } else {
      nextCode += 1;
      if (nextCode === 1 << codeSize && codeSize < 12) codeSize += 1;
    }
  }
  if (bitCount > 0) bytes.push(bitBuffer & 0xff);
  return Buffer.from(bytes);
}

function subBlocks(buffer) {
  const blocks = [];
  for (let index = 0; index < buffer.length; index += 255) {
    const slice = buffer.subarray(index, index + 255);
    blocks.push(Buffer.from([slice.length]), slice);
  }
  blocks.push(Buffer.from([0x00]));
  return Buffer.concat(blocks);
}

function word(value) {
  return Buffer.from([value & 0xff, (value >> 8) & 0xff]);
}

await mkdir(assetDir, { recursive: true });
await writeFile(path.join(assetDir, "cover.svg"), coverSvg());
await writeFile(path.join(assetDir, "demo-resume.svg"), demoResumeSvg());
await writeFile(path.join(assetDir, "encryption-flow.gif"), makeEncryptionGif());

console.log("Generated README assets in docs/assets/");
