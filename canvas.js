const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');

const settings = {
  dimensions: [2048, 2048]
};

function createGrid(count) {
  const points = [];
  for (let x = 0; x < count; x++) {
    for (let y = 0; y < count; y++) {
      const u = count <= 1 ? 0.5 : x / (count - 1);
      const v = count <= 1 ? 0.5 : y / (count - 1);
      points.push([u, v]);
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
  const points = createGrid(5);
  const radius = 0.03;

  return ({ context, width, height }) => {
    const margin = width * 0.1;
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    points.forEach(([u, v]) => {
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);
      drawCircle(context, {
        x,
        y,
        radius: radius * width,
        stroke: 'black',
        fill: 'pink',
        width: width * 0.01
      });
    });
  };
};

canvasSketch(sketch, settings);
