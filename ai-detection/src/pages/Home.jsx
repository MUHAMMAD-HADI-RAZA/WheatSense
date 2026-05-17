import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ScanLine, BarChart3, Leaf, Cpu, Zap, ShieldCheck,
  TrendingUp, Clock, Target, CheckCircle2, ArrowRight,
  Activity, ChevronRight, Layers, Database, Eye
} from 'lucide-react';

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '', duration = 1800 }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = target / (duration / 16);
        const interval = setInterval(() => {
          start += step;
          if (start >= target) { setValue(target); clearInterval(interval); }
          else setValue(Math.floor(start));
        }, 16);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{value}{suffix}</span>;
}

// ─── Feature Card ─────────────────────────────────────────────────────────────
const features = [
  { icon: Layers, title: 'Dual-Model Engine', desc: 'YOLOv8 & YOLOv10 run concurrently on every scan.', color: '#10b981' },
  { icon: Eye, title: 'Bounding Box AI', desc: 'Sub-pixel accurate disease region localization.', color: '#3b82f6' },
  { icon: BarChart3, title: 'Real-Time Analytics', desc: 'Live performance dashboards with Recharts.', color: '#8b5cf6' },
  { icon: Target, title: '10 Disease Classes', desc: 'From Yellow Rust to Karnal Bunt — all covered.', color: '#f59e0b' },
  { icon: ShieldCheck, title: 'Treatment Engine', desc: 'Chemical & organic agronomic recommendations.', color: '#ef4444' },
  { icon: TrendingUp, title: 'Model Comparison', desc: 'Side-by-side confidence and speed benchmarking.', color: '#06b6d4' },
];

// ─── Workflow Steps ────────────────────────────────────────────────────────────
const steps = [
  { num: '01', icon: Database, title: 'Upload Image', desc: 'Drag & drop your wheat field photograph.' },
  { num: '02', icon: Cpu, title: 'AI Processing', desc: 'Both YOLO models begin parallel inference.' },
  { num: '03', icon: Eye, title: 'Disease Detection', desc: 'Bounding boxes rendered on identified lesions.' },
  { num: '04', icon: BarChart3, title: 'Analytics', desc: 'Confidence, speed, and class metrics computed.' },
  { num: '05', icon: ShieldCheck, title: 'Treatment Plan', desc: 'Fungicide and prevention guidance generated.' },
];

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto animate-slide-up space-y-16 pb-12">

      {/* ═══════════════════════════════════════════════════
          1. HERO
      ═══════════════════════════════════════════════════ */}
      <section className="relative min-h-[480px] flex items-center rounded-3xl overflow-hidden shadow-2xl">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="/wsdb.png"
            alt=""
            className="w-full h-full object-cover opacity-10 scale-105"
          />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #064e3b 50%, #0f172a 100%)'
          }} />
        </div>

        {/* Glow blobs */}
        <div className="glow-blob w-96 h-96 top-[-80px] left-[-80px]" style={{ background: '#10b981', opacity: 0.2 }} />
        <div className="glow-blob w-72 h-72 bottom-[-60px] right-[-60px]" style={{ background: '#3b82f6', opacity: 0.18 }} />

        {/* Content */}
        <div className="relative z-10 px-8 md:px-16 py-16 w-full">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold mb-6"
              style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399' }}>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Dual-Model AI Engine Active
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6 tracking-tight">
              Smart Wheat<br />
              <span className="gradient-text">Disease AI</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-8 max-w-xl">
              Upload a single image. WheatSense runs <strong className="text-emerald-400">YOLOv8</strong> and <strong className="text-blue-400">YOLOv10 Nano</strong> simultaneously — delivering annotated bounding boxes, confidence scores, and treatment plans instantly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/detect" className="btn-primary text-base px-7 py-3.5 animate-pulse-glow">
                <ScanLine className="w-5 h-5" />
                Start Detection
              </Link>
              <Link to="/analytics" className="btn-ghost text-base px-7 py-3.5" style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)' }}>
                <BarChart3 className="w-5 h-5" />
                View Analytics
              </Link>
            </div>
          </div>
        </div>

        {/* Floating stat cards (desktop) */}
        <div className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 flex-col gap-4 z-10">
          {[
            { label: 'Avg Confidence', value: '91.2%', sub: 'YOLOv8 best.pt', color: '#10b981' },
            { label: 'Inference Speed', value: '38ms', sub: 'YOLOv10 Nano', color: '#3b82f6' },
            { label: 'mAP50 Score', value: '94.1%', sub: 'Validation set', color: '#8b5cf6' },
          ].map((s, i) => (
            <div key={i} className="card-glass px-5 py-4 rounded-2xl min-w-[180px] animate-float" style={{ animationDelay: `${i * 0.4}s` }}>
              <div className="text-xs font-bold mb-1" style={{ color: s.color }}>{s.label}</div>
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          2. STATISTICS STRIP
      ═══════════════════════════════════════════════════ */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Disease Classes', value: 10, suffix: '+', color: '#10b981', Icon: Leaf },
          { label: 'Mean Avg Precision', value: 94, suffix: '%', color: '#3b82f6', Icon: Target },
          { label: 'Inference Speed', value: 38, suffix: 'ms', color: '#8b5cf6', Icon: Zap },
          { label: 'AI Models Active', value: 2, suffix: '', color: '#f59e0b', Icon: Cpu },
        ].map((s, i) => (
          <div key={i} className="stat-card card-glow flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color}18` }}>
                <s.Icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <Activity className="w-4 h-4 text-gray-300 dark:text-gray-600" />
            </div>
            <div className="text-3xl font-black mb-1" style={{ color: s.color }}>
              <AnimatedCounter target={s.value} suffix={s.suffix} />
            </div>
            <div className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* ═══════════════════════════════════════════════════
          3. FEATURE CARDS
      ═══════════════════════════════════════════════════ */}
      <section>
        <div className="text-center mb-10">
          <span className="badge badge-emerald mb-3">Core Capabilities</span>
          <h2 className="text-3xl md:text-4xl font-black mb-3" style={{ color: 'var(--text-color)' }}>
            Everything You Need for{' '}
            <span className="gradient-text-green">Smart Crop Diagnostics</span>
          </h2>
          <p style={{ color: 'var(--text-muted)' }} className="max-w-xl mx-auto">
            A comprehensive AI platform built for precision agriculture at every scale.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div key={i} className="card card-hover group cursor-default">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{ background: `${f.color}18` }}>
                <f.icon className="w-6 h-6" style={{ color: f.color }} />
              </div>
              <h3 className="text-base font-bold mb-2" style={{ color: 'var(--text-color)' }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
              <div className="flex items-center gap-1 mt-4 text-xs font-bold transition-colors group-hover:gap-2" style={{ color: f.color }}>
                Learn more <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          4. HOW IT WORKS
      ═══════════════════════════════════════════════════ */}
      <section className="rounded-3xl p-8 md:p-12" style={{ background: 'var(--card-color)', border: '1px solid var(--border-color)' }}>
        <div className="text-center mb-12">
          <span className="badge badge-blue mb-3">Workflow</span>
          <h2 className="text-3xl font-black mb-3" style={{ color: 'var(--text-color)' }}>How WheatSense Works</h2>
          <p style={{ color: 'var(--text-muted)' }}>From raw imagery to actionable intelligence in under a second.</p>
        </div>

        <div className="grid md:grid-cols-5 gap-6 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-px"
            style={{ background: 'linear-gradient(90deg,transparent,#10b981,#3b82f6,#8b5cf6,transparent)' }} />

          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center relative z-10">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${['#10b981','#3b82f6','#8b5cf6','#f59e0b','#ef4444'][i]}22, ${['#10b981','#3b82f6','#8b5cf6','#f59e0b','#ef4444'][i]}08)`,
                  border: `1px solid ${['#10b981','#3b82f6','#8b5cf6','#f59e0b','#ef4444'][i]}33`,
                }}>
                <step.icon className="w-8 h-8" style={{ color: ['#10b981','#3b82f6','#8b5cf6','#f59e0b','#ef4444'][i] }} />
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: ['#10b981','#3b82f6','#8b5cf6','#f59e0b','#ef4444'][i] }}>
                Step {step.num}
              </div>
              <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-color)' }}>{step.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          5. MODEL COMPARISON PREVIEW + CTA
      ═══════════════════════════════════════════════════ */}
      <section className="grid lg:grid-cols-2 gap-8 items-center">
        {/* Model metrics */}
        <div className="space-y-4">
          <span className="badge badge-purple">Dual-Model Intelligence</span>
          <h2 className="text-3xl font-black" style={{ color: 'var(--text-color)' }}>
            YOLOv8 vs YOLOv10 —<br />
            <span className="gradient-text">You Decide the Winner</span>
          </h2>
          <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            WheatSense runs both detection models in parallel and provides you with an objective recommendation based on confidence, speed, and detection count.
          </p>

          <div className="space-y-4 mt-4">
            {[
              { label: 'YOLOv8 (best.pt) — Confidence', val: 91, color: '#10b981' },
              { label: 'YOLOv10 Nano — Confidence', val: 85, color: '#3b82f6' },
              { label: 'YOLOv8 — mAP50', val: 94, color: '#10b981' },
              { label: 'YOLOv10 — mAP50', val: 87, color: '#3b82f6' },
            ].map((m, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  <span>{m.label}</span>
                  <span className="font-bold" style={{ color: m.color }}>{m.val}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${m.val}%`, background: `linear-gradient(90deg, ${m.color}, ${m.color}88)` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA card */}
        <div className="relative rounded-3xl overflow-hidden p-8 shadow-2xl" style={{ background: 'linear-gradient(135deg,#064e3b,#0f172a)' }}>
          <div className="glow-blob w-64 h-64 top-[-40px] right-[-40px]" style={{ background: '#10b981', opacity: 0.25 }} />

          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.3)' }}>
              <ScanLine className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-black text-white mb-3">Ready to Analyze<br />Your Crop?</h3>
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              Upload any wheat leaf or field photograph and receive a complete dual-model diagnostic report within seconds.
            </p>

            <div className="space-y-3">
              {['Drag & drop any image format','YOLOv8 + YOLOv10 parallel inference','Treatment & prevention guidance'].map((t, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  {t}
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-8">
              <Link to="/detect" className="btn-primary flex-1">
                <ScanLine className="w-4 h-4" /> Detect Now
              </Link>
              <Link to="/about" className="btn-ghost flex-none px-4" style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)' }}>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}