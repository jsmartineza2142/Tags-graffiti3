// Lista de tipografías disponibles
const FONTS = [
  'DonGraffiti',
  'GrafittiNewYear',
  'AnotherTag',
  'StreetWarsDemo',
  'Decipher'
];

// Elementos del DOM
const input = document.getElementById('textInput');
const generateBtn = document.getElementById('generateBtn');
const output = document.getElementById('tagOutput');
const downloadBtn = document.getElementById('downloadBtn');
const colorInput = document.getElementById('colorInput');

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

function pickRandomFont() {
  const idx = randomInt(FONTS.length);
  return FONTS[idx];
}

function applyFontAndText(fontName, text, color) {
  output.style.fontFamily = `'${fontName}', sans-serif`;
  output.textContent = text || '';
  output.style.color = color || '#000';
  output.style.textShadow = 'none';
  output.style.webkitTextStroke = '0px';
}

generateBtn.addEventListener('click', async () => {
  const text = input.value.trim() || 'Tag';
  const color = colorInput.value || '#000000';
  const fontName = pickRandomFont();

  try {
    await document.fonts.load(`1rem '${fontName}'`);
  } catch (e) {
    console.warn('Error cargando fuente', fontName, e);
  }

  applyFontAndText(fontName, text, color);
  fitTextToContainer();
});

function fitTextToContainer() {
  const wrap = document.getElementById('outputWrap');
  output.classList.remove('scale-down');
  const overflow = output.scrollWidth > wrap.clientWidth - 40;
  if (overflow) output.classList.add('scale-down');
}

// Descargar imagen como PNG
downloadBtn.addEventListener('click', async () => {
  const fontName = getComputedStyle(output).fontFamily.split(',')[0].replace(/['"]/g, '');
  const text = output.textContent || '';
  const color = getComputedStyle(output).color || '#000';

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const width = Math.max(800, output.scrollWidth * 2);
  const height = 400;
  canvas.width = width;
  canvas.height = height;

  ctx.fillStyle = '#ffffff00';
  ctx.clearRect(0, 0, width, height);

  const fontSize = Math.floor(height * 0.6);
  ctx.fillStyle = color;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  await document.fonts.load(`${fontSize}px '${fontName}'`).catch(() => {});
  ctx.font = `${fontSize}px '${fontName}', sans-serif`;

  ctx.fillText(text, width / 2, height / 2);

  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = (text || 'tag') + '.png';
  a.click();
});

// Inicial
window.addEventListener('load', () => {
  const initialFont = pickRandomFont();
  applyFontAndText(initialFont, input.value || 'Nombre', colorInput.value);
});
