import {range} from 'd3-array';
import random from 'lodash.random';
import {createChart} from './lib';

for (let i = 0; i < 6; i++) {
  createChart(
      `svg#svg-${i}`,
      range(5).map(() => random(50, 80)),
  );
}

