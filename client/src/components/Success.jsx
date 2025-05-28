import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();
  const cardRef = useRef(null);

  const goHome = () => {
    navigate('/');
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (cardRef.current) {
        const { left, top, width, height } = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        
        cardRef.current.style.transform = `
          perspective(1000px)
          rotateX(${y * 10}deg)
          rotateY(${-x * 10}deg)
          scale3d(1.03, 1.03, 1.03)
        `;
        cardRef.current.style.boxShadow = `
          ${-x * 20}px ${y * 20}px 30px rgba(0, 0, 0, 0.2)
        `;
      }
    };

    const handleMouseLeave = () => {
      if (cardRef.current) {
        cardRef.current.style.transform = `
          perspective(1000px)
          rotateX(0deg)
          rotateY(0deg)
          scale3d(1, 1, 1)
        `;
        cardRef.current.style.boxShadow = `
          0 10px 25px rgba(0, 0, 0, 0.1)
        `;
      }
    };

    const card = cardRef.current;
    if (card) {
      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (card) {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <div className="min-h-[79vh] flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 h-[590px]">
      <div 
        ref={cardRef}
        className="bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-2xl text-center max-w-md w-full border border-white/20 transition-all duration-300 ease-out"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="relative">
          {/* Floating orb behind checkmark */}
          <div className="absolute -top-16 -left-16 w-32 h-32 rounded-full bg-green-500/20 blur-xl animate-pulse"></div>
          
          {/* Animated checkmark */}
          <svg
            className="mx-auto mb-4 w-20 h-20 text-green-400 relative z-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              filter: 'drop-shadow(0 0 10px rgba(74, 222, 128, 0.7))',
            }}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2"
              d="M9 12l2 2l4 -4m5 2a9 9 0 11-18 0a9 9 0 0118 0"
              style={{
                strokeDasharray: 100,
                strokeDashoffset: 100,
                animation: 'draw 1s ease-out forwards',
              }}
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold mb-2 text-white bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-400">
          Order Placed Successfully!
        </h1>
        
        <p className="text-white/80 mb-6">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
        
        <button
          onClick={goHome}
          className="relative overflow-hidden group bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-green-500/30"
        >
          <span className="relative z-10">Go to Home</span>
          <span className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          <span className="absolute -inset-1 bg-white/10 rounded-xl blur-md group-hover:blur-lg transition-all duration-500"></span>
        </button>

        {/* Floating particles */}
        {[...Array(10)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 5}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></div>
        ))}
      </div>

      <style jsx>{`
        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) translateX(20px) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Success;