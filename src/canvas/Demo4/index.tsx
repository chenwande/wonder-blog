import React, { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number; // 增大花瓣尺寸范围
  speed: number;
  angle: number;
  rotation: number;
  rotateSpeed: number;
  alpha: number;
}

interface SakuraFallProps {
  petalCount?: number; // 默认花瓣数量调整为更大值
  petalColor?: string;
  windStrength?: number;
  treeColor?: string;
  bloomColor?: string;
}

const SakuraFall: React.FC<SakuraFallProps> = ({
  petalCount = 300, // 增加花瓣数量占满全屏
  petalColor = '#FFB7C5',
  windStrength = 1.2, // 增大风力使分布更分散
  treeColor = '#8B4513',
  bloomColor = '#FFC0CB',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const treePathRef = useRef<Path2D>(new Path2D());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const generateStaticTree = () => {
      const tempCtx = document.createElement('canvas').getContext('2d')!;
      const path = new Path2D();

      const drawBranch = (
        x: number,
        y: number,
        length: number,
        angle: number,
        depth: number,
      ) => {
        if (depth === 0) return;
        tempCtx.save();
        tempCtx.translate(x, y);
        tempCtx.rotate((angle * Math.PI) / 180);
        path.moveTo(0, 0);
        path.lineTo(0, -length);
        if (depth < 3) {
          path.arc(0, -length, 2 + depth, 0, Math.PI * 2);
        }
        const newLength = length * 0.8;
        drawBranch(0, -length, newLength, -20, depth - 1);
        drawBranch(0, -length, newLength, 20, depth - 1);
        tempCtx.restore();
      };

      drawBranch(canvas.width / 2, canvas.height, 150, 0, 6); // 调整树高度和分支层数
      treePathRef.current = path;
    };
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      generateStaticTree();
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // 修改花瓣生成逻辑：全屏随机位置 + 更大尺寸
    const createPetal = (): Petal => ({
      x: Math.random() * canvas.width, // 全屏随机x坐标
      y: -Math.random() * 100, // 从屏幕顶部外随机高度开始
      size: 8 + Math.random() * 24, // 花瓣尺寸8-20px（原6-14px）
      speed: 1.0 + Math.random() * 1.5, // 适当调慢速度（原1.2-3.2）
      angle: Math.random() * Math.PI * 2,
      rotation: Math.random() * Math.PI,
      rotateSpeed: (Math.random() - 0.5) * 0.1,
      alpha: 0.7 + Math.random() * 0.3,
    });

    const petals: Petal[] = Array.from({ length: petalCount }, createPetal);

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      // 调整贝塞尔曲线参数使花瓣形状更饱满
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        p.size * 0.5,
        p.size * 0.3,
        p.size * 1.0,
        p.size * 0.6,
        p.size * 0.6,
        p.size * 1.0,
      );
      ctx.bezierCurveTo(
        p.size * 0.3,
        p.size * 0.6,
        p.size * 0.5,
        p.size * 0.3,
        0,
        0,
      );
      ctx.fillStyle = petalColor;
      ctx.fill();
      ctx.restore();
    };

    const animate = () => {
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = treeColor;
      ctx.fillStyle = bloomColor;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.stroke(treePathRef.current);
      ctx.fill(treePathRef.current);

      petals.forEach((petal) => {
        petal.y += petal.speed;
        petal.x += Math.sin(petal.angle) * windStrength;
        petal.angle += 0.02; // 增加角度变化频率使摆动更明显
        petal.rotation += petal.rotateSpeed;

        // 超出屏幕底部时从顶部重新生成（全屏范围）
        if (petal.y > canvas.height + 20) {
          Object.assign(petal, createPetal());
          petal.y = -20;
        }

        drawPetal(petal);
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, [petalCount, petalColor, windStrength, treeColor, bloomColor]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  );
};

export default SakuraFall;
