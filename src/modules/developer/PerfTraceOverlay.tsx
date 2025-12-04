import React, { useState, useEffect } from 'react';

export const PerfTraceOverlay: React.FC = () => {
    const [metrics, setMetrics] = useState({
        fps: 0,
        memory: 0,
        domNodes: 0
    });

    useEffect(() => {
        let frameCount = 0;
        let lastTime = performance.now();

        const loop = () => {
            const now = performance.now();
            frameCount++;

            if (now - lastTime >= 1000) {
                setMetrics({
                    fps: frameCount,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    memory: (performance as any).memory ? Math.round((performance as any).memory.usedJSHeapSize / 1048576) : 0,
                    domNodes: document.getElementsByTagName('*').length
                });
                frameCount = 0;
                lastTime = now;
            }
            requestAnimationFrame(loop);
        };

        const handle = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(handle);
    }, []);

    return (
        <div className="fixed bottom-4 left-4 bg-black/80 backdrop-blur text-green-400 p-3 rounded-lg font-mono text-xs z-[9999] border border-green-900 pointer-events-none select-none">
            <div className="flex gap-4">
                <div>
                    <span className="text-gray-500">FPS:</span> <span className={metrics.fps < 30 ? 'text-red-500' : 'text-green-400'}>{metrics.fps}</span>
                </div>
                <div>
                    <span className="text-gray-500">HEAP:</span> {metrics.memory}MB
                </div>
                <div>
                    <span className="text-gray-500">DOM:</span> {metrics.domNodes}
                </div>
            </div>
        </div>
    );
};
