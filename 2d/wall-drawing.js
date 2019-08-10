/**
 * An example of a Sol LeWitt inspired "Wall Drawing" using
 * a simple generative algorithm.
 *
 * The instructions for this mural:
 *
 * - Using a 6x6 grid of evenly spaced points
 * - Connect two random points on the grid; forming a trapezoid with two parallel sides extending down
 * - Fill the trapezoid with a colour, then stroke with the background colour
 * - Find another two random points and repeat; continuing until all grid points are exhausted
 * - Layer the shapes by the average Y position of their two grid points
 */

const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const { lerp } = require('canvas-sketch-util/math');
const palettes = require('nice-color-palettes/1000.json');

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

function getPalette() {
  // Let's get a random palette of 1-5 colours
  const nColors = random.rangeFloor(1, 6);
  return random.shuffle(random.pick(palettes)).slice(0, nColors);
}

const settings = {
  dimensions: [2048, 1024]
};

const sketch = ({ width, height }) => {
  const palette = getPalette();
  const background = 'white';

  // Padding around edges
  const margin = width * 0.05;

  // Create a grid of points (in pixel space) within the margin bounds
  const createGrid = () => {
    const xCount = 6;
    const yCount = 6;
    const points = [];
    for (let x = 0; x < xCount; x++) {
      for (let y = 0; y < yCount; y++) {
        const u = x / (xCount - 1);
        const v = y / (yCount - 1);
        const px = lerp(margin, width - margin, u);
        const py = lerp(margin, height - margin, v);
        points.push([px, py]);
      }
    }
    return points;
  };

  // Create the grid
  let grid = createGrid();

  // Now create the shapes
  let shapes = [];

  while (grid.length > 2) {
    const pointsToRemove = random.shuffle(grid).slice(0, 2);

    if (pointsToRemove.length < 2) {
      break;
    }

    grid = grid.filter(point => !pointsToRemove.includes(point));

    const [a, b] = pointsToRemove;

    shapes.push({
      color: random.pick(palette),
      path: [[a[0], height - margin], a, b, [b[0], height - margin]],
      y: (a[1] + b[1]) / 2
    });
  }

  // Sort/layer the shapes according to their average Y position
  shapes.sort((a, b) => a.y - b.y);

  // Now render
  return ({ context, width, height }) => {
    // Make sure our alpha is back to 1.0 before
    // we draw our background color
    context.globalAlpha = 1;
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);

    shapes.forEach(({ path, color }) => {
      context.beginPath();
      path.forEach(([x, y]) => {
        context.lineTo(x, y);
      });
      context.closePath();

      // Draw the trapezoid with a specific colour
      context.lineWidth = 20;
      context.fillStyle = color;
      context.fill();

      // Outline at full opacity
      context.lineJoin = context.lineCap = 'round';
      context.strokeStyle = background;
      context.globalAlpha = 1;
      context.stroke();
    });
  };
};

canvasSketch(sketch, settings);
