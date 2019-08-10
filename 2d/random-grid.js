const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

random.setSeed(random.getRandomSeed());

function showText(text) {
  const div = document.createElement('div');
  div.style.position = 'fixed';
  div.style.bottom = '8px';
  div.style.right = '8px';
  div.textContent = text;
  document.body.appendChild(div);
}

showText(random.getSeed());

const palette = random.pick(palettes);

const settings = {
  dimensions: [2048, 2048]
};

const frequency = 3;
const amplitude = 0.07;
function createGrid(count, withNoise = false) {
  const points = [];
  for (let i = 0; i < count; i++) {
    for (let j = 0; j < count; j++) {
      const u = count <= 1 ? 0.5 : i / (count - 1);
      const v = count <= 1 ? 0.5 : j / (count - 1);
      const dif = withNoise ? amplitude * random.noise2D(u * frequency, v * frequency) : 0;
      const x = u + dif;
      const y = v + dif;
      points.push({
        position: [x, y],
        color: random.pick(palette)
      });
    }
  }
  return points;
}

function drawCircle(
  context,
  { x, y, radius, from = 0, to = Math.PI * 2, clockwise = false, stroke, fill, width }
) {
  context.beginPath();
  context.arc(x, y, radius, from, to, clockwise);

  if (stroke) {
    context.strokeStyle = stroke;
    if (width) {
      context.lineWidth = width;
    }

    context.stroke();
  }

  if (fill) {
    context.fillStyle = fill;
    context.fill();
  }
}

const sketch = () => {
  const points = createGrid(40, true);
  const radius = 0.005;

  return ({ context, width, height }) => {
    const margin = width * 0.05;
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    points
      .filter(() => Math.abs(random.gaussian()) > 0.4)
      .forEach(({ position: [u, v], color }) => {
        const x = lerp(margin, width - margin, u);
        const y = lerp(margin, height - margin, v);
        drawCircle(context, {
          x,
          y,
          radius: radius * width * (Math.abs(random.gaussian()) + 0.1),
          stroke: 'black',
          fill: color,
          width: width * 0.005
        });
      });
  };
};

canvasSketch(sketch, settings);
