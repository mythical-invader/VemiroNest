import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ShoppingBag, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const AntigravityCanvas = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationFrameId;
    let width = 0;
    let height = 0;
    const mouse = { x: 0, y: 0, isHovered: false };
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.isHovered = true;
    };
    const handleMouseLeave = () => {
      mouse.isHovered = false;
    };
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        width = canvas.width = parent.offsetWidth;
        height = canvas.height = parent.offsetHeight;
      }
    };
    resizeCanvas();
    const observer = new ResizeObserver(() => resizeCanvas());
    if (canvas.parentElement) {
      observer.observe(canvas.parentElement);
    }
    const particleCount = 60;
    const particles = [];
    const colors = ["#ff9900", "#ffc872", "#ffffff", "#ffecd2"];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * 2000,
        y: Math.random() * 2000,
        radius: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -(Math.random() * 0.7 + 0.2),
        alpha: Math.random() * 0.6 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    const render = () => {
      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (mouse.isHovered) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            p.x += (dx / dist) * 0.2;
            p.y += (dy / dist) * 0.2;
          }
        }
        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      });
      animationFrameId = requestAnimationFrame(render);
    };
    render();
    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
};

const PrimaryButton = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <motion.button
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      style={{
        position: 'relative',
        background: 'linear-gradient(90deg, #f97316, #ea580c)',
        color: 'white',
        border: 'none',
        padding: '18px 40px',
        borderRadius: '50px',
        fontSize: '1.05rem',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: 'pointer',
        overflow: 'hidden',
        boxShadow: isHovered ? '0 15px 35px rgba(249,115,22,0.4)' : '0 10px 20px rgba(249,115,22,0.2)',
        letterSpacing: '0.025em'
      }}
    >
      <motion.div 
        animate={{ left: isHovered ? '200%' : '-100%' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ position: 'absolute', top: 0, left: '-100%', width: '40%', height: '100%', background: 'rgba(255,255,255,0.2)', transform: 'skewX(-25deg)', zIndex: 0 }}
      />
      <span style={{ position: 'relative', zIndex: 1 }}>Explore Collection</span>
      <motion.div animate={{ x: isHovered ? 4 : 0 }} style={{ position: 'relative', zIndex: 1, display: 'flex' }}>
        <ShoppingBag size={20} />
      </motion.div>
    </motion.button>
  );
};

const HeroBanner = () => {  
  const navigate = useNavigate();  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);  
  const containerRef = useRef(null);    
  const mouseX = useMotionValue(-1000); 
  const mouseY = useMotionValue(-1000);  
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });  
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });  
  
  useEffect(() => {    
    const handleResize = () => setIsMobile(window.innerWidth < 768);    
    window.addEventListener('resize', handleResize);    
    return () => window.removeEventListener('resize', handleResize);  
  }, []);  
  
  const handleMouseMove = (e) => {    
    if (!containerRef.current || isMobile) return;    
    const rect = containerRef.current.getBoundingClientRect();    
    mouseX.set(e.clientX - rect.left);    
    mouseY.set(e.clientY - rect.top);  
  };  
  
  const handleMouseLeave = () => {    
    mouseX.set(-1000);    
    mouseY.set(-1000);  
  };  
  
  const spotlightBackground = useTransform(    
    [springX, springY],    
    ([x, y]) => `radial-gradient(800px circle at ${x}px ${y}px, rgba(249, 115, 22, 0.08), transparent 70%)`  
  );  

  return (    
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '70vh',
        backgroundColor: '#050505',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'stretch',
        overflow: 'hidden',
        marginBottom: '60px',
        borderRadius: '24px'
      }}
    >      

      <motion.div 
        style={{
          position: 'absolute',
          inset: 0,
          background: isMobile ? 'transparent' : spotlightBackground,
          pointerEvents: 'none',
          zIndex: 5
        }}
      />      

      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          zIndex: 0,
          pointerEvents: 'none'
        }} 
      />      

      <div 
        style={{ 
          flex: 1, 
          padding: isMobile ? '60px 5% 40px' : '40px 8%', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: isMobile ? 'center' : 'flex-start', 
          textAlign: isMobile ? 'center' : 'left', 
          zIndex: 10, 
          position: 'relative', 
          maxWidth: isMobile ? '100%' : '55%' 
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px'
          }}
        >
          <Sparkles style={{ width: '12px', height: '12px', color: '#f97316' }} />
          <span style={{ 
            fontSize: '0.7rem', 
            fontWeight: 800, 
            textTransform: 'uppercase', 
            letterSpacing: '0.25em', 
            color: '#f97316' 
          }}>
            New Season Arrival
          </span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: isMobile ? '3rem' : '4.5rem',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
            marginBottom: '16px',
            color: '#ffffff',
            textShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}
        >
          Curated<br />Elegance.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          style={{
            fontSize: isMobile ? '1rem' : '1.15rem',
            color: '#a8a29e',
            maxWidth: '520px',
            fontWeight: 400,
            lineHeight: 1.6,
            marginBottom: '32px',
            opacity: 0.8
          }}
        >
          Discover our exclusive collection of premium products, thoughtfully selected to elevate your modern lifestyle. Where quality meets sophisticated design.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          style={{ display: 'flex', gap: '24px', alignItems: 'center', justifyContent: isMobile ? 'center' : 'flex-start', flexWrap: 'wrap', width: '100%' }}
        >
          <PrimaryButton onClick={() => navigate('/shop')} />
        </motion.div>
      </div>

      <div 
        style={{
          flex: 1,
          position: 'relative',
          minHeight: isMobile ? '50vh' : 'auto',
          width: '100%',
          overflow: 'hidden',
          display: isMobile ? 'none' : 'block'
        }}
      >        

        <img 
          src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
          alt="Premium Lifestyle Curation" 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', opacity: 0.85, filter: 'contrast(1.05) brightness(0.95)', zIndex: 0 }} 
        />                

        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, #050505 0%, transparent 40%, transparent 80%, #050505 100%)', zIndex: 2, pointerEvents: 'none' }} />        
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, #050505 0%, transparent 20%)', zIndex: 2, pointerEvents: 'none' }} />                

        <div style={{ position: 'absolute', inset: 0, zIndex: 3, mixBlendMode: 'screen' }}>          
          <AntigravityCanvas />        
        </div>      
      </div>    
    </section>  
  );
};

export default HeroBanner;
