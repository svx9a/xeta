import React from 'react';

const QuantumSecurity: React.FC = () => {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-slate-50">
            {/* 3D Perspective Grid Floor - Muted Azure */}
            <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] h-[100%] quantum-grid opacity-[0.05]"
                style={{
                    transform: 'perspective(1500px) rotateX(70deg) translateY(100px)',
                    transformOrigin: 'bottom center',
                }}
            />

            {/* Dynamic Scanning Pulse - Subtle */}
            <div className="absolute inset-0 scanline opacity-5" />

            {/* Corner HUD Elements - Structural, No Glow */}
            <div className="absolute top-12 left-12 flex flex-col gap-1 opacity-20">
                <div className="text-[8px] font-mono text-blue-600 tracking-[0.3em] uppercase">Architecture v09</div>
                <div className="w-24 h-px bg-slate-100" />
            </div>

            <div className="absolute bottom-12 right-12 flex flex-col items-end gap-1 opacity-20">
                <div className="text-[8px] font-mono text-blue-600 tracking-[0.3em] uppercase">Protocol: Active</div>
                <div className="text-[10px] font-mono text-slate-800/20">0x...4F7E2B</div>
            </div>
        </div>
    );
};

export default QuantumSecurity;
