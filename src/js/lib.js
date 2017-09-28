import {select} from 'd3-selection';
import {range} from 'd3-array';

const DEG_180 = 180;
const DEG_360 = 360;
const PI_HALF = Math.PI / 2;
const RADIAN_IN_ONE_DEG = Math.PI / DEG_180;

export function createChart(rootElSelector, points) {
  const root = select(rootElSelector);

  const svgSize = {
    width: parseInt(root.style('width'), 10),
    height: parseInt(root.style('height'), 10),
  };
  const radius = Math.max(svgSize.width, svgSize.height) / 2;
  const center = {
    x: svgSize.width / 2,
    y: svgSize.height / 2,
  };
  const circleRange = range(1, radius, radius / 5);
  const circlePoints = getPolygonPoints(5, Math.max(...circleRange), center);
  const underlay = createEl(root, 'g', 'underlay');
  const arcsG = createEl(underlay, 'g', 'arcs');
  const arcs = createCircles(arcsG, center, circleRange);
  const linesG = createEl(underlay, 'g', 'lines');
  const lines = createLines(linesG, center, circlePoints);

  underlay.selectAll('polygon')
      .data([1])
      .enter()
      .append('polygon')
      .attr('points', getPolygonPath(points, center));
}

export function createEl(parentEl, elName, id) {
  return parentEl.append(elName).attr('id', id);
}

export function createCircles(parentEl, center, circleRange) {
  return parentEl.selectAll('circle')
      .data(circleRange)
      .enter()
      .append('circle')
      .attr('cx', center.x)
      .attr('cy', center.y)
      .attr('r', d => d);
}

export function createLines(parentEl, center, points) {
  return parentEl.selectAll('line')
      .data(points)
      .enter()
      .append('line')
      .attr('x1', center.x)
      .attr('x2', d => d.x)
      .attr('y1', center.y)
      .attr('y2', d => d.y);
}

export function getPolygonPoints(countSide, radius, center) {
  const points = [];
  const angleRadian = (DEG_360 / countSide) * RADIAN_IN_ONE_DEG;

  for (let i = 0; i < countSide; i++) {
    points.push(getPoint(radius, center, angleRadian * i));
  }

  return points;
}

export function getPoint(radius, center, radian) {
  return {
    x: radius * Math.cos(radian - PI_HALF) + center.x,
    y: radius * Math.sin(radian - PI_HALF) + center.y,
    radian,
  };
}

export function getPolygonPath(arrayRadius, center) {
  const angleRadian = (DEG_360 / arrayRadius.length) * RADIAN_IN_ONE_DEG;

  const points = [];
  let counter = 0;
  for (let radius of arrayRadius) {
    const point = getPoint(radius, center, angleRadian * counter);
    points.push(`${point.x},${point.y}`);
    counter++;
  }

  return points.join(', ');
}