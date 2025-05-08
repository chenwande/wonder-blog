import React, { useEffect } from 'react';
import { Graph } from './utils';

const Demo = () => {
  useEffect(() => {
    const canvas = document.getElementById('canvas-demo') as HTMLCanvasElement;
    canvas.width = devicePixelRatio * canvas.clientWidth;
    canvas.height = devicePixelRatio * 500;
    const ctx = canvas.getContext('2d')!;

    new Graph(ctx, canvas);
  }, []);

  return (
    <canvas
      id="canvas-demo"
      style={{ width: '100%', height: '100%', backgroundColor: '#222' }}
    ></canvas>
  );
};

export default Demo;
