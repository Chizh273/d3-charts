import * as d3 from 'd3';
import random from 'lodash.random';
import {createChart} from './lib';

for (let i = 0; i < 6; i++) {
  createChart(
      d3,
      `svg#svg-${i}`,
      d3.range(5).map(() => random(50, 80))
  );
}

