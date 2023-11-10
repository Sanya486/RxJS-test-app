import './css/main.css';
import {
  fromEvent, map, pairwise, switchMap, takeUntil,
} from 'rxjs';

const canvas = document.querySelector('canvas');
const lineWidthEl = document.getElementById('line-width');
const lineWidthBadge = document.querySelector('.line-width-badge');
const lineColorInput = document.getElementById('line-color');
const clearBtn = document.getElementById('clear');

const ctx = canvas.getContext('2d');

const mouseMove$ = fromEvent(canvas, 'mousemove');
const mouseDown$ = fromEvent(canvas, 'mousedown');
const mouseUp$ = fromEvent(canvas, 'mouseup');
const mouseOut$ = fromEvent(canvas, 'mouseout');
const changeLineWidth$ = fromEvent(lineWidthEl, 'input');
const changeLineColot$ = fromEvent(lineColorInput, 'change');

const lineWidth$ = changeLineWidth$.pipe(map((e) => e.currentTarget.value));

lineWidth$.subscribe((lineWidth) => {
  ctx.lineWidth = lineWidth;
});

lineWidth$.subscribe((lineWidth) => {
  lineWidthBadge.textContent = lineWidth;
});

const lineColor$ = changeLineColot$.pipe(map((e) => e.currentTarget.value));

lineColor$.subscribe((lineColor) => {
  ctx.strokeStyle = lineColor;
  ctx.fillStyle = lineColor;
});

mouseDown$
  .pipe(
    switchMap(() =>
      mouseMove$.pipe(
        map((e) => ({
          x: e.offsetX,
          y: e.offsetY,
        })),
        pairwise(),
        takeUntil(mouseUp$),
        takeUntil(mouseOut$),
      ),
    ),
  )
  .subscribe(([from, to]) => {
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  });

clearBtn.addEventListener('click', () => ctx.reset());
