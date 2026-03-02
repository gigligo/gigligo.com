'use client';

import React from 'react';

/**
 * Pure CSS Graduates Celebration animation.
 * Replaces the Lottie-based animation for reliability.
 * Shows graduation caps being thrown with confetti and floating elements.
 */
export default function GraduatesLottie({ className }: { className?: string }) {
    return (
        <div className={className || 'w-full max-w-5xl mx-auto'}>
            <div className="grad-anim">
                {/* Cloud Background */}
                <div className="grad-cloud" />

                {/* Floating Caps */}
                <div className="grad-cap grad-cap-1">🎓</div>
                <div className="grad-cap grad-cap-2">🎓</div>
                <div className="grad-cap grad-cap-3">🎓</div>
                <div className="grad-cap grad-cap-4">🎓</div>
                <div className="grad-cap grad-cap-5">🎓</div>

                {/* Center Scroll/Diploma */}
                <div className="grad-diploma">
                    <svg viewBox="0 0 80 100" fill="none" className="grad-scroll-svg">
                        <rect x="10" y="10" width="60" height="80" rx="4" fill="#fefce8" stroke="#eab308" strokeWidth="2" />
                        <line x1="24" y1="30" x2="56" y2="30" stroke="#d4d4d8" strokeWidth="2" strokeLinecap="round" className="grad-text-line" />
                        <line x1="24" y1="40" x2="50" y2="40" stroke="#d4d4d8" strokeWidth="2" strokeLinecap="round" className="grad-text-line grad-text-2" />
                        <line x1="24" y1="50" x2="46" y2="50" stroke="#d4d4d8" strokeWidth="2" strokeLinecap="round" className="grad-text-line grad-text-3" />
                        <circle cx="40" cy="70" r="8" fill="#1dbf73" className="grad-seal" />
                        <path d="M36 70l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="grad-seal-check" />
                    </svg>
                </div>

                {/* Confetti Dots */}
                <div className="grad-confetti grad-cf-1" />
                <div className="grad-confetti grad-cf-2" />
                <div className="grad-confetti grad-cf-3" />
                <div className="grad-confetti grad-cf-4" />
                <div className="grad-confetti grad-cf-5" />
                <div className="grad-confetti grad-cf-6" />
                <div className="grad-confetti grad-cf-7" />
                <div className="grad-confetti grad-cf-8" />

                {/* Stars */}
                <div className="grad-star grad-star-1">✨</div>
                <div className="grad-star grad-star-2">⭐</div>
                <div className="grad-star grad-star-3">✨</div>

                <style jsx>{`
                    .grad-anim {
                        position: relative;
                        width: 100%;
                        height: 280px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        overflow: hidden;
                    }
                    @media (min-width: 768px) {
                        .grad-anim { height: 360px; }
                    }

                    /* Cloud */
                    .grad-cloud {
                        position: absolute;
                        width: 70%;
                        height: 60%;
                        background: linear-gradient(135deg, #dbeafe 0%, #ede9fe 50%, #fce7f3 100%);
                        border-radius: 999px;
                        opacity: 0.5;
                        animation: gradCloudFloat 6s ease-in-out infinite;
                    }
                    @keyframes gradCloudFloat {
                        0%, 100% { transform: translateY(0) scale(1); }
                        50% { transform: translateY(-8px) scale(1.02); }
                    }

                    /* Graduation Caps */
                    .grad-cap {
                        position: absolute;
                        font-size: 28px;
                        animation: gradCapThrow 3s ease-in-out infinite;
                    }
                    @media (min-width: 768px) {
                        .grad-cap { font-size: 36px; }
                    }
                    .grad-cap-1 { left: 15%; top: 30%; animation-delay: 0s; }
                    .grad-cap-2 { left: 30%; top: 15%; animation-delay: 0.4s; }
                    .grad-cap-3 { left: 50%; top: 10%; animation-delay: 0.8s; }
                    .grad-cap-4 { left: 65%; top: 20%; animation-delay: 0.6s; }
                    .grad-cap-5 { left: 80%; top: 28%; animation-delay: 0.2s; }
                    @keyframes gradCapThrow {
                        0% { transform: translateY(0) rotate(0deg); }
                        25% { transform: translateY(-30px) rotate(-15deg); }
                        50% { transform: translateY(-50px) rotate(10deg); }
                        75% { transform: translateY(-25px) rotate(-5deg); }
                        100% { transform: translateY(0) rotate(0deg); }
                    }

                    /* Diploma */
                    .grad-diploma {
                        position: relative;
                        z-index: 2;
                        width: 100px;
                        height: 120px;
                        animation: gradDiplomaFloat 4s ease-in-out infinite;
                    }
                    @media (min-width: 768px) {
                        .grad-diploma { width: 130px; height: 160px; }
                    }
                    @keyframes gradDiplomaFloat {
                        0%, 100% { transform: translateY(0) rotate(-2deg); }
                        50% { transform: translateY(-12px) rotate(2deg); }
                    }
                    .grad-scroll-svg {
                        width: 100%;
                        height: 100%;
                        filter: drop-shadow(0 4px 12px rgba(0,0,0,0.1));
                    }
                    .grad-text-line {
                        stroke-dasharray: 40;
                        stroke-dashoffset: 40;
                        animation: gradLineDraw 1s ease-out forwards;
                    }
                    .grad-text-2 { animation-delay: 0.3s; }
                    .grad-text-3 { animation-delay: 0.6s; }
                    @keyframes gradLineDraw {
                        to { stroke-dashoffset: 0; }
                    }
                    .grad-seal {
                        animation: gradSealPop 0.5s ease-out 1s both;
                    }
                    @keyframes gradSealPop {
                        from { r: 0; opacity: 0; }
                        to { r: 8; opacity: 1; }
                    }
                    .grad-seal-check {
                        stroke-dasharray: 14;
                        stroke-dashoffset: 14;
                        animation: gradLineDraw 0.4s ease-out 1.3s forwards;
                    }

                    /* Confetti */
                    .grad-confetti {
                        position: absolute;
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        animation: gradConfetti 3s ease-in-out infinite;
                    }
                    .grad-cf-1 { background: #1dbf73; left: 10%; top: 20%; animation-delay: 0s; }
                    .grad-cf-2 { background: #eab308; left: 25%; top: 60%; animation-delay: 0.5s; }
                    .grad-cf-3 { background: #6366f1; left: 40%; top: 75%; animation-delay: 1s; }
                    .grad-cf-4 { background: #ec4899; left: 55%; top: 65%; animation-delay: 0.3s; }
                    .grad-cf-5 { background: #14b8a6; left: 70%; top: 70%; animation-delay: 0.7s; }
                    .grad-cf-6 { background: #f97316; left: 85%; top: 40%; animation-delay: 1.2s; }
                    .grad-cf-7 { background: #8b5cf6; left: 20%; top: 80%; animation-delay: 0.9s; }
                    .grad-cf-8 { background: #ef4444; left: 75%; top: 55%; animation-delay: 0.4s; }
                    @keyframes gradConfetti {
                        0% { transform: translateY(0) scale(1); opacity: 0.8; }
                        50% { transform: translateY(-20px) scale(1.3); opacity: 1; }
                        100% { transform: translateY(0) scale(1); opacity: 0.8; }
                    }

                    /* Stars */
                    .grad-star {
                        position: absolute;
                        font-size: 18px;
                        animation: gradStarTwinkle 2s ease-in-out infinite;
                    }
                    .grad-star-1 { left: 12%; top: 15%; animation-delay: 0s; }
                    .grad-star-2 { right: 15%; top: 12%; animation-delay: 0.7s; }
                    .grad-star-3 { right: 25%; bottom: 20%; animation-delay: 1.4s; }
                    @keyframes gradStarTwinkle {
                        0%, 100% { opacity: 0.3; transform: scale(0.8); }
                        50% { opacity: 1; transform: scale(1.2); }
                    }
                `}</style>
            </div>
        </div>
    );
}
