const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

random.setSeed(random.getRandomSeed());

console.log(random.getSeed());

const palette = random.pick(palettes);

const settings = {
  dimensions: [2048, 2048]
};

function createGrid(count) {
  const points = [];
  for (let x = 0; x < count; x++) {
    for (let y = 0; y < count; y++) {
      const u = count <= 1 ? 0.5 : x / (count - 1);
      const v = count <= 1 ? 0.5 : y / (count - 1);
      points.push({ position: [u, v], color: random.pick(palette) });
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
  const points = createGrid(40);
  const radius = 0.005;
  const frequency = 1;
  const amplitude = 0.5;

  return ({ context, width, height }) => {
    const margin = width * 0.05;
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    points
      // .filter(() => Math.abs(random.gaussian()) > 0.5)
      .forEach(({ position: [u, v], color }) => {
        const n = amplitude * random.noise2D(u * frequency, v * frequency);
        const x = lerp(margin, width - margin, u + n);
        const y = lerp(margin, height - margin, v + n);
        drawCircle(context, {
          x,
          y,
          radius: radius * width * Math.abs(random.gaussian()),
          stroke: 'black',
          fill: color,
          width: width * 0.005
        });
      });
  };
};

canvasSketch(sketch, settings);
