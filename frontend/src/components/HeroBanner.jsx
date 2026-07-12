import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Zap, Gift, Heart, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

const HeroBanner = () => {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseMove = (e) => {
    const x = (e.clientX - window.innerWidth / 2) * 0.05;
    const y = (e.clientY - window.innerHeight / 2) * 0.05;
    setMousePos({ x, y });
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f97316', '#10b981', '#3b82f6', '#eab308', '#8b5cf6', '#ec4899']
    });
  };

  // 3. Staggered Bouncing Text Animation
  const titleText = "Level Up Your Lifestyle.";
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      scale: 1,
      transition: { type: "spring", damping: 10, stiffness: 200 },
    },
    hidden: {
      opacity: 0,
      y: 50,
      rotate: -10,
      scale: 0.5,
      transition: { type: "spring", damping: 10, stiffness: 200 },
    },
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #09090b 0%, #18181b 100%)',
        borderRadius: '24px',
        padding: isMobile ? '40px 20px' : '80px 40px',
        overflow: 'hidden',
        marginBottom: '60px',
        border: '1px solid rgba(249, 115, 22, 0.15)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 0 80px rgba(249,115,22,0.03)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: isMobile ? 'calc(100vh - 220px)' : 'calc(100vh - 200px)'
      }}
    >
      
      {/* Dynamic Glowing Orb that follows cursor slightly */}
      <motion.div 
        animate={{ x: mousePos.x * 2, y: mousePos.y * 2 }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: isMobile ? '400px' : '800px',
          height: isMobile ? '400px' : '800px',
          background: 'radial-gradient(circle, rgba(249,115,22,0.1) 0%, rgba(0,0,0,0) 60%)',
          pointerEvents: 'none',
          zIndex: 0
        }} 
      />

      {/* Floating Parallax Icons */}
      <motion.div 
        animate={{ x: mousePos.x * -1.5, y: [mousePos.y * -1.5 - 15, mousePos.y * -1.5 + 15], rotate: [0, 10, 0] }}
        transition={{ y: { duration: 2.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }, rotate: { duration: 4, repeat: Infinity } }}
        style={{ position: 'absolute', top: '15%', left: '8%', color: '#f97316', opacity: 0.9 }}
      >
        <ShoppingBag size={56} strokeWidth={2} />
      </motion.div>

      <motion.div 
        animate={{ x: mousePos.x * 2, y: [mousePos.y * 2 - 20, mousePos.y * 2 + 20], rotate: [0, -15, 0] }}
        transition={{ y: { duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.5 }, rotate: { duration: 5, repeat: Infinity } }}
        style={{ position: 'absolute', bottom: '20%', right: '12%', color: '#10b981', opacity: 0.8 }}
      >
        <Gift size={64} strokeWidth={2} />
      </motion.div>

      <motion.div 
        animate={{ x: mousePos.x * -2, y: [mousePos.y * -2 - 10, mousePos.y * -2 + 10], rotate: [0, 20, 0] }}
        transition={{ y: { duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 1 }, rotate: { duration: 3.5, repeat: Infinity } }}
        style={{ position: 'absolute', top: '25%', right: '10%', color: '#eab308', opacity: 0.9 }}
      >
        <Star size={48} strokeWidth={2} />
      </motion.div>

      <motion.div 
        animate={{ x: mousePos.x * 1.5, y: [mousePos.y * 1.5 - 18, mousePos.y * 1.5 + 18], rotate: [0, -10, 0] }}
        transition={{ y: { duration: 2.8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 1.5 }, rotate: { duration: 4.5, repeat: Infinity } }}
        style={{ position: 'absolute', bottom: '15%', left: '15%', color: '#8b5cf6', opacity: 0.8 }}
      >
        <Zap size={52} strokeWidth={2} />
      </motion.div>

      <motion.div 
        animate={{ x: mousePos.x * -1, y: [mousePos.y * -1 - 12, mousePos.y * -1 + 12], scale: [1, 1.1, 1] }}
        transition={{ y: { duration: 2.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.2 }, scale: { duration: 2, repeat: Infinity } }}
        style={{ position: 'absolute', top: '10%', left: '48%', color: '#ec4899', opacity: 0.7 }}
      >
        <Heart size={40} strokeWidth={2} />
      </motion.div>

      {/* Main Content */}
      <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Staggered Bouncing Title */}
        <motion.div
          style={{ display: "flex", overflow: "hidden", justifyContent: "center", flexWrap: "wrap", marginBottom: '20px' }}
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {titleText.split(" ").map((word, wordIndex) => (
            <span key={wordIndex} style={{ display: 'inline-block', marginRight: isMobile ? '12px' : '18px' }}>
              {word.split("").map((letter, letterIndex) => (
                <motion.span
                  key={`${wordIndex}-${letterIndex}`}
                  variants={child}
                  style={{
                    fontSize: isMobile ? '2.8rem' : '4.5rem', 
                    fontWeight: 800,
                    background: 'linear-gradient(to bottom right, #ffffff, #f97316)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline-block',
                    textShadow: '0 4px 10px rgba(0,0,0,0.3)'
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </span>
          ))}
        </motion.div>

        <motion.p 
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5, type: "spring" }}
          style={{ fontSize: isMobile ? '1.1rem' : '1.4rem', color: '#a1a1aa', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.6' }}
        >
          Discover the internet's best products at unbeatable prices. Fun, fast, and delivered right to your nest.
        </motion.p>

        {/* Super Interactive Button */}
        <motion.button
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
          whileHover={{ 
            scale: 1.1, 
            rotate: [-1, 1, -1, 0], 
            boxShadow: "0px 0px 25px rgba(249, 115, 22, 0.8)" 
          }}
          whileTap={{ scale: 0.9 }}
          onMouseEnter={triggerConfetti}
          onClick={() => { 
            triggerConfetti(); 
            setTimeout(() => navigate('/shop'), 600); 
          }}
          style={{
            background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
            color: '#fff',
            border: 'none',
            padding: '18px 40px',
            borderRadius: '50px',
            fontSize: '1.3rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(249, 115, 22, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <Sparkles size={24} /> Start Exploring <Zap size={20} />
        </motion.button>
      </div>
    </div>
  );
};

export default HeroBanner;
