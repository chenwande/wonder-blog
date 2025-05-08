import React, { useEffect, useRef } from 'react';

interface CodeRainProps {
  chars?: string;
  fontSize?: number;
  color?: string;
}

const CodeRain: React.FC<CodeRainProps> = ({
  chars = '01',
  fontSize = 24,
  color = '#0f0',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置canvas为全屏
    canvas.width = devicePixelRatio * canvas.clientWidth;
    canvas.height = devicePixelRatio * 500;

    const columns = Math.floor(canvas.width / fontSize);

    // 初始化雨滴位置
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    // 绘制函数
    function draw() {
      if (!canvas) return;
      if (!ctx) return;

      // 半透明背景
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 设置文字样式
      ctx.fillStyle = color;
      ctx.font = `${fontSize}px monospace`;

      // 绘制每个雨滴
      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // 重置雨滴到底部
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    }

    // 开始动画
    const interval = setInterval(draw, 33);

    // 窗口大小改变时重置canvas
    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [chars, fontSize, color]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
};

export default CodeRain;
