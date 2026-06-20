'use client';

import { memo, useEffect, useState, useRef } from 'react';
import { getState } from '@/lib/diagnostics';

function fmtTime(ts: number): string {
  if (!ts) return '—';
  return new Date(ts).toLocaleTimeString('es-ES', { hour12: false });
}

function ago(ts: number): string {
  if (!ts) return '—';
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return `${m}m ${s % 60}s`;
}

function memStr(): string {
  try {
    const mem = (performance as any).memory;
    if (!mem) return '—';
    const used = Math.round(mem.usedJSHeapSize / 1024 / 1024);
    const limit = Math.round(mem.jsHeapSizeLimit / 1024 / 1024);
    return `${used}MB / ${limit}MB`;
  } catch {
    return '—';
  }
}

function DiagnosticPanel() {
  // Force re-render every second to show live values from the singleton
  const [, tick] = useState(0);
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).has('debug');
  });

  // Corner tap counter — 5 taps in 2 seconds toggles visibility
  const clickRef = useRef(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const id = setInterval(() => tick(n => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const handleCornerTap = () => {
    clickRef.current++;
    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => { clickRef.current = 0; }, 2000);
    if (clickRef.current >= 5) {
      clickRef.current = 0;
      setVisible(v => !v);
    }
  };

  const s = getState();
  const heartbeatSec = s.clockLastUpdate
    ? Math.floor((Date.now() - s.clockLastUpdate) / 1000)
    : null;
  const frozen = heartbeatSec !== null && heartbeatSec > 5;
  const lastError = s.errors[s.errors.length - 1];

  return (
    <>
      {/* Invisible 60×60 tap zone — bottom-left corner, always present */}
      <div
        onClick={handleCornerTap}
        style={{
          position: 'fixed', bottom: 0, left: 0,
          width: 60, height: 60,
          zIndex: 9999,
        }}
      />

      {visible && (
        <div
          style={{
            position: 'fixed',
            bottom: 70,
            left: 10,
            zIndex: 9998,
            background: 'rgba(0,0,0,0.93)',
            color: '#00FF41',
            fontFamily: 'monospace',
            fontSize: '12px',
            lineHeight: 1.65,
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid rgba(0,255,65,0.35)',
            minWidth: '320px',
            maxWidth: '400px',
            pointerEvents: 'none',
          }}
        >
          <div style={{ color: '#FFD700', fontWeight: 'bold', marginBottom: 8 }}>
            📊 DIAGNÓSTICO — Al Huda
          </div>

          <div>
            🕐 Reloj:{'    '}
            {fmtTime(s.clockLastUpdate)}
            {s.clockLastUpdate ? ` (${ago(s.clockLastUpdate)})` : ''}
          </div>

          <div style={{ color: frozen ? '#FF4444' : '#00FF41' }}>
            💓 Heartbeat: {heartbeatSec !== null ? `${heartbeatSec}s` : '—'}
            {frozen ? '  ⚠️ CONGELADO' : '  ✓ OK'}
          </div>

          <div>🔄 Renders: {s.renderCount}</div>

          <div style={{ color: s.errorCount > 0 ? '#FF6B6B' : '#00FF41' }}>
            ⚠️ Errores JS: {s.errorCount}
          </div>

          {lastError && (
            <div
              style={{
                color: '#FF8888',
                fontSize: 10,
                marginTop: 3,
                wordBreak: 'break-all',
                maxWidth: 380,
              }}
            >
              [{fmtTime(lastError.time)}] {lastError.msg}
            </div>
          )}

          <div>💾 Memoria: {memStr()}</div>

          <div>
            ⏱ Esta carga:{'  '}{fmtTime(s.pageLoadTime)}
            {' '}({ago(s.pageLoadTime)} ago)
          </div>

          <div>
            🔃 Reload previo:{' '}
            {s.prevReloadTime ? fmtTime(s.prevReloadTime) : 'primera carga'}
          </div>

          <div style={{ color: '#555', fontSize: 10, marginTop: 8 }}>
            Tap 5× esquina inf-izq para ocultar · ?debug para fijar
          </div>
        </div>
      )}
    </>
  );
}

export default memo(DiagnosticPanel);
