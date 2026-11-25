type Point = readonly [number, number];
type ShapeLoop = readonly Point[];

const SAMPLE_COUNT = 36;
const MORPH_STEP_MS = 560;

function samplePolar(radiusAt: (theta: number) => number): ShapeLoop {
  const points: Point[] = [];
  for (let i = 0; i < SAMPLE_COUNT; i++) {
    const theta: number = (i / SAMPLE_COUNT) * Math.PI * 2;
    const radius: number = radiusAt(theta);
    points.push([Math.cos(theta) * radius, Math.sin(theta) * radius]);
  }
  return points;
}

function sampleSuperellipse(rx: number, ry: number, exponent: number): ShapeLoop {
  const points: Point[] = [];
  for (let i = 0; i < SAMPLE_COUNT; i++) {
    const theta: number = (i / SAMPLE_COUNT) * Math.PI * 2;
    const cos: number = Math.cos(theta);
    const sin: number = Math.sin(theta);
    const x: number = Math.sign(cos) * Math.pow(Math.abs(cos), 2 / exponent) * rx;
    const y: number = Math.sign(sin) * Math.pow(Math.abs(sin), 2 / exponent) * ry;
    points.push([x, y]);
  }
  return points;
}

function sampleRoundedPolygon(
  sides: number,
  radius: number,
  softness: number,
): ShapeLoop {
  return samplePolar((theta: number) => {
    const sector: number = (Math.PI * 2) / sides;
    const angle: number = (((theta % sector) + sector) % sector) - sector / 2;
    const polygonRadius: number = (radius * Math.cos(sector / 2)) / Math.cos(angle);
    return polygonRadius * (1 - softness) + radius * softness;
  });
}

// M3 Expressive sequence: Soft Burst -> Cookie 9 -> Pentagon -> Pill -> Sunny -> Cookie 4 -> Oval
const M3E_SHAPES: readonly ShapeLoop[] = [
  samplePolar((t: number) => 38 + 7.5 * Math.cos(10 * t)),
  samplePolar((t: number) => 40 + 5.5 * Math.cos(9 * t)),
  sampleRoundedPolygon(5, 43, 0.32),
  sampleSuperellipse(45, 27, 3.4),
  samplePolar((t: number) => 37 + 8.5 * Math.cos(8 * t)),
  samplePolar((t: number) => 37 + 9 * Math.cos(4 * t)),
  sampleSuperellipse(44, 32, 2),
];

function pointsToSmoothPath(points: ShapeLoop): string {
  const count: number = points.length;
  let d = `M ${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)}`;
  for (let i = 0; i < count; i++) {
    const p0: Point = points[(i - 1 + count) % count];
    const p1: Point = points[i];
    const p2: Point = points[(i + 1) % count];
    const p3: Point = points[(i + 2) % count];
    const cp1x: number = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y: number = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x: number = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y: number = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)} ${cp2x.toFixed(2)} ${cp2y.toFixed(2)} ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
  }
  return `${d} Z`;
}

function springEase(progress: number): number {
  if (progress <= 0) return 0;
  if (progress >= 1) return 1;
  const c4: number = (2 * Math.PI) / 3.2;
  return (
    1 + Math.pow(2, -9 * progress) * Math.sin((progress * 10 - 0.75) * c4) * 0.45
  );
}

let rafId = 0;
let startTime = 0;
let startShapeIndex = 0;

function renderFrame(container: HTMLElement, now: number): void {
  const elapsed: number = now - startTime;
  const stepFloat: number = elapsed / MORPH_STEP_MS;
  const stepIndex: number = Math.floor(stepFloat);
  const eased: number = springEase(stepFloat - stepIndex);

  const fromIndex: number = (startShapeIndex + stepIndex) % M3E_SHAPES.length;
  const toIndex: number = (fromIndex + 1) % M3E_SHAPES.length;
  const fromPoints: ShapeLoop = M3E_SHAPES[fromIndex];
  const toPoints: ShapeLoop = M3E_SHAPES[toIndex];

  const interpolated: Point[] = [];
  for (let i = 0; i < SAMPLE_COUNT; i++) {
    interpolated.push([
      fromPoints[i][0] + (toPoints[i][0] - fromPoints[i][0]) * eased,
      fromPoints[i][1] + (toPoints[i][1] - fromPoints[i][1]) * eased,
    ]);
  }

  const pathData: string = pointsToSmoothPath(interpolated);
  const angle: number = (stepIndex + eased) * 90 + elapsed * 0.045;

  container.querySelectorAll<SVGPathElement>("[data-m3e-path]").forEach((el) => {
    el.setAttribute("d", pathData);
  });
  container.querySelectorAll<SVGElement>("[data-m3e-svg]").forEach((el) => {
    el.style.transform = `rotate(${angle.toFixed(1)}deg)`;
  });
}

export function stopM3eLoader(): void {
  if (rafId !== 0) {
    cancelAnimationFrame(rafId);
    rafId = 0;
  }
}

export function startM3eLoader(container: HTMLElement): void {
  stopM3eLoader();
  startTime = performance.now();
  startShapeIndex = (startShapeIndex + 1) % M3E_SHAPES.length;

  const tick = (now: number): void => {
    renderFrame(container, now);
    rafId = requestAnimationFrame(tick);
  };

  renderFrame(container, startTime);
  rafId = requestAnimationFrame(tick);
}
