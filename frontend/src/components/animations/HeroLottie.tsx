'use client';

import React from 'react';

/**
 * Pure CSS Handshake Contract animation.
 * Shows a contract card with a handshake icon and animated checkmark.
 */
export default function HeroLottie({ className }: { className?: string }) {
    return (
        <div className={className || 'w-full max-w-lg mx-auto'}>
            <div className="hero-contract-anim">
                {/* Card */}
                <div className="hc-card">
                    {/* Handshake Icon */}
                    <div className="hc-icon">
                        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="hc-svg">
                            <path d="M12 36l8-4 6 6 8-8 6 6 8-4" stroke="#1dbf73" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="hc-path" />
                            <circle cx="20" cy="24" r="6" stroke="#1dbf73" strokeWidth="2.5" className="hc-circle-l" />
                            <circle cx="44" cy="24" r="6" stroke="#1dbf73" strokeWidth="2.5" className="hc-circle-r" />
                            <path d="M26 24h12" stroke="#1dbf73" strokeWidth="2.5" strokeLinecap="round" className="hc-bridge" />
                        </svg>
                    </div>
                    {/* Lines */}
                    <div className="hc-lines">
                        <div className="hc-line hc-line-1" />
                        <div className="hc-line hc-line-2" />
                        <div className="hc-line hc-line-3" />
                    </div>
                    {/* Check Badge */}
                    <div className="hc-badge">
                        <svg viewBox="0 0 24 24" fill="none" className="hc-check-svg">
                            <circle cx="12" cy="12" r="10" fill="#1dbf73" />
                            <path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hc-check-path" />
                        </svg>
                    </div>
                </div>

                <style dangerouslySetInnerHTML={{
                    __html: `
                    .hero-contract-anim {
                        width: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        padding: 16px;
                    }
                    .hc-card {
                        position: relative;
                        width: 160px;
                        background: white;
                        border-radius: 16px;
                        padding: 20px;
                        box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
                        animation: hcSlideUp 0.8s ease-out both;
                    }
                    @media (min-width: 768px) {
                        .hc-card { width: 200px; padding: 28px; }
                    }
                    @keyframes hcSlideUp {
                        from { opacity: 0; transform: translateY(30px) scale(0.95); }
                        to { opacity: 1; transform: translateY(0) scale(1); }
                    }
                    .hc-icon {
                        width: 56px;
                        height: 56px;
                        margin: 0 auto 16px;
                        background: #f0fdf4;
                        border-radius: 14px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        animation: hcPulse 2s ease-in-out infinite;
                    }
                    @keyframes hcPulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                    }
                    .hc-svg { width: 36px; height: 36px; }
                    .hc-path {
                        stroke-dasharray: 60;
                        stroke-dashoffset: 60;
                        animation: hcDraw 1.5s ease-out 0.5s forwards;
                    }
                    .hc-circle-l {
                        stroke-dasharray: 38;
                        stroke-dashoffset: 38;
                        animation: hcDraw 1s ease-out 0.3s forwards;
                    }
                    .hc-circle-r {
                        stroke-dasharray: 38;
                        stroke-dashoffset: 38;
                        animation: hcDraw 1s ease-out 0.6s forwards;
                    }
                    .hc-bridge {
                        stroke-dasharray: 12;
                        stroke-dashoffset: 12;
                        animation: hcDraw 0.8s ease-out 0.9s forwards;
                    }
                    @keyframes hcDraw {
                        to { stroke-dashoffset: 0; }
                    }
                    .hc-lines { display: flex; flex-direction: column; gap: 8px; }
                    .hc-line {
                        height: 6px;
                        border-radius: 3px;
                        background: #f1f5f9;
                        animation: hcLineGrow 0.6s ease-out both;
                    }
                    .hc-line-1 { width: 100%; animation-delay: 0.8s; }
                    .hc-line-2 { width: 80%; animation-delay: 1.0s; }
                    .hc-line-3 { width: 60%; animation-delay: 1.2s; }
                    @keyframes hcLineGrow {
                        from { transform: scaleX(0); opacity: 0; }
                        to { transform: scaleX(1); opacity: 1; }
                    }
                    .hc-badge {
                        position: absolute;
                        top: -8px;
                        right: -8px;
                        width: 28px;
                        height: 28px;
                        animation: hcBadgePop 0.5s ease-out 1.5s both;
                    }
                    @keyframes hcBadgePop {
                        from { opacity: 0; transform: scale(0); }
                        to { opacity: 1; transform: scale(1); }
                    }
                    .hc-check-svg { width: 28px; height: 28px; }
                    .hc-check-path {
                        stroke-dasharray: 14;
                        stroke-dashoffset: 14;
                        animation: hcDraw 0.4s ease-out 1.8s forwards;
                    }
                ` }} />
            </div>
        </div>
    );
}
