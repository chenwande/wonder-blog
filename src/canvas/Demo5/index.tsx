import React, { useEffect, useRef } from 'react';

// 雪花类型定义
interface Snow {
  x: number;          // x坐标
  y: number;          // y坐标
  size: number;       // 大小（半径）
  speed: number;      // 下落速度
  angle: number;      // 摆动角度（用于水平移动）
  alpha: number;      // 透明度
}

// 组件Props类型
interface SnowFallProps {
  snowCount?: number;     // 雪花数量（默认150）
  snowColor?: string;     // 雪花颜色（默认白色）
  windStrength?: number;  // 风力强度（控制水平摆动幅度，默认0.8）
  maxSize?: number;       // 最大雪花尺寸（默认4px）
}

const SnowFall: React.FC<SnowFallProps> = ({
  snowCount = 150,
  snowColor = '#ffffff',
  windStrength = 0.8,
  maxSize = 4
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 初始化Canvas尺寸
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // 生成随机雪花（从屏幕顶部外开始）
    const createSnow = (): Snow => ({
      x: Math.random() * canvas.width,        // 全屏随机x坐标
      y: -Math.random() * 100,                // 初始y在屏幕上方外（-0~-100px）
      size: 1 + Math.random() * (maxSize - 1), // 尺寸范围1~maxSize（默认1~4px）
      speed: 1 + Math.random() * 2,           // 下落速度1~3
      angle: Math.random() * Math.PI * 2,     // 初始摆动角度
      alpha: 0.7 + Math.random() * 0.3        // 透明度0.7~1.0
    });

    // 初始化雪花数组
    const snows: Snow[] = Array.from({ length: snowCount }, createSnow);

    // 绘制单个雪花（圆形）
    const drawSnow = (s: Snow) => {
      ctx.save();
      ctx.globalAlpha = s.alpha;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = snowColor;
      ctx.fill();
      ctx.restore();
    };

    // 动画循环
    const animate = () => {
      // 半透明背景实现拖尾效果
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      snows.forEach(snow => {
        // 更新位置：垂直下落 + 水平摆动（正弦曲线）
        snow.y += snow.speed;
        snow.x += Math.sin(snow.angle) * windStrength;
        snow.angle += 0.01;  // 角度缓慢变化

        // 超出屏幕底部时重置（从顶部重新生成）
        if (snow.y > canvas.height + 20) {
          Object.assign(snow, createSnow());
          snow.y = -20;  // 重置到屏幕上方外
        }

        drawSnow(snow);
      });

      requestAnimationFrame(animate);
    };

    // 启动动画
    animate();

    // 清理函数
    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, [snowCount, snowColor, windStrength, maxSize]);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        pointerEvents: 'none', 
        zIndex: 999 
      }}
    />
  );
};

export default SnowFall;