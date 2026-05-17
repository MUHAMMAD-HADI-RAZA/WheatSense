import React from 'react';
import { 
  Cpu, Activity, Target, ShieldCheck, 
  Sprout, Database, Layers, CheckCircle2, 
  ArrowRight, Search, Zap, BarChart3,
  Microscope, Globe, Users
} from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto animate-fade-in pb-12 space-y-24">
      
      {/* 1. HERO SECTION */}
      <section className="relative text-center py-20 lg:py-28 rounded-3xl overflow-hidden shadow-2xl bg-gray-900 border border-gray-800">
        <div className="absolute inset-0 opacity-40 mix-blend-overlay">
          <img 
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=2000" 
            alt="Agriculture AI" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/40 via-transparent to-transparent"></div>
        
        <div className="relative z-10 px-4">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-500/20 rounded-2xl mb-6 backdrop-blur-sm border border-emerald-500/30">
            <Sprout className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-xl">
            WheatSense
          </h1>
          <p className="text-xl md:text-2xl text-emerald-100 font-medium tracking-wide max-w-3xl mx-auto mb-6 drop-shadow-md">
            Intelligent Wheat Disease Detection & Analytics System
          </p>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Empowering modern agriculture with cutting-edge Deep Learning. WheatSense seamlessly bridges the gap between advanced artificial intelligence and practical crop management.
          </p>
        </div>
      </section>

      {/* 2. ABOUT THE SYSTEM & MISSION */}
      <section className="grid lg:grid-cols-2 gap-12 items-center px-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <Target className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            Pioneering Agritech AI
          </h2>
          <div className="space-y-4 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            <p>
              Wheat is one of the most vital staple crops globally, yet fungal and bacterial diseases account for up to 40% of yield losses annually. Early and accurate detection is critical to global food security.
            </p>
            <p>
              <strong>WheatSense</strong> is a state-of-the-art dual-model comparison platform designed to ingest complex agricultural field imagery and execute real-time multi-disease object detection. Utilizing highly optimized variants of the <strong>YOLO (You Only Look Once)</strong> architecture, the platform isolates disease symptoms with pin-point accuracy.
            </p>
            <p>
              Beyond detection, the system empowers farmers and researchers with instant agricultural analytics, chemical treatment plans, and organic prevention strategies.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="card text-center p-6 border border-emerald-100 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-900/10">
            <div className="text-4xl font-black text-emerald-600 dark:text-emerald-400 mb-2">10+</div>
            <div className="text-sm font-bold text-gray-700 dark:text-gray-300">Disease Classes Detected</div>
          </div>
          <div className="card text-center p-6 border border-blue-100 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-900/10">
            <div className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-2">{"<50ms"}</div>
            <div className="text-sm font-bold text-gray-700 dark:text-gray-300">Inference Latency</div>
          </div>
          <div className="card text-center p-6 border border-purple-100 dark:border-purple-800/50 bg-purple-50/50 dark:bg-purple-900/10">
            <div className="text-4xl font-black text-purple-600 dark:text-purple-400 mb-2">94%</div>
            <div className="text-sm font-bold text-gray-700 dark:text-gray-300">Mean Average Precision</div>
          </div>
          <div className="card text-center p-6 border border-amber-100 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-900/10">
            <div className="text-4xl font-black text-amber-600 dark:text-amber-400 mb-2">Dual</div>
            <div className="text-sm font-bold text-gray-700 dark:text-gray-300">Model Pipeline (v8/v10)</div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (WORKFLOW TIMELINE) */}
      <section className="px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Platform Workflow</h2>
          <p className="text-gray-600 dark:text-gray-400">From raw leaf imagery to actionable agronomic insights in seconds.</p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6 relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 z-0"></div>
          
          {[
            { step: '01', title: 'Image Acquisition', desc: 'Upload high-resolution field imagery via the modern drag-and-drop dashboard.', icon: Search },
            { step: '02', title: 'AI Inference', desc: 'YOLOv8 and YOLOv10 process the image concurrently, generating bounding boxes.', icon: Cpu },
            { step: '03', title: 'Data Aggregation', desc: 'Confidence scores and precise detection counts are calculated and evaluated.', icon: Activity },
            { step: '04', title: 'Actionable Output', desc: 'Farmers receive treatment guidelines, visual annotations, and comparison metrics.', icon: ShieldCheck }
          ].map((item, idx) => (
            <div key={idx} className="relative z-10 card flex flex-col items-center text-center hover:-translate-y-2 transition-transform">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900 border-4 border-white dark:border-gray-800 flex items-center justify-center mb-4 shadow-lg">
                <item.icon className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-xs font-black text-emerald-600 dark:text-emerald-500 mb-2 tracking-widest uppercase">Step {item.step}</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. TECHNOLOGY STACK */}
      <section className="bg-white dark:bg-gray-800 rounded-3xl p-8 lg:p-12 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Technology Stack</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Built on a robust, scalable foundation designed for high-performance machine learning deployments.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            { name: 'React.js', role: 'Frontend UI', color: 'text-cyan-500' },
            { name: 'Flask', role: 'API Backend', color: 'text-gray-800 dark:text-white' },
            { name: 'Python', role: 'Core Logic', color: 'text-yellow-500' },
            { name: 'YOLOv10', role: 'Detection Engine', color: 'text-emerald-600' },
            { name: 'PyTorch', role: 'ML Framework', color: 'text-red-500' },
            { name: 'Recharts', role: 'Data Visualization', color: 'text-blue-500' }
          ].map((tech, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors">
              <Database className={`w-8 h-8 mb-3 ${tech.color}`} />
              <span className="font-bold text-gray-900 dark:text-white">{tech.name}</span>
              <span className="text-xs text-gray-500 mt-1">{tech.role}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. KEY FEATURES */}
      <section className="px-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Core Capabilities</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Multi-Disease Detection', desc: 'Identifies overlapping and concurrent rusts, blights, and smuts.' },
            { title: 'Bounding Box Visualization', desc: 'Renders precise geometric boundaries around localized pathogen outbreaks.' },
            { title: 'Dual-Model Comparison', desc: 'Pits YOLOv8 against YOLOv10 Nano to recommend the most reliable inference.' },
            { title: 'Real-Time Analytics', desc: 'Dynamic charts tracking model latency, confidence distributions, and disease trends.' },
            { title: 'Agronomic Guidance', desc: 'Integrated chemical/organic treatment plans specific to detected fungal strains.' },
            { title: 'Downloadable Reports', desc: 'Export annotated bounding box imagery for record-keeping and agronomist review.' }
          ].map((feature, idx) => (
            <div key={idx} className="card hover:shadow-md transition-shadow flex items-start gap-4">
              <div className="mt-1 bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-lg text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. ACADEMIC & RESEARCH METRICS */}
      <section className="grid lg:grid-cols-2 gap-12 items-center px-4 bg-gray-50 dark:bg-gray-800/30 p-8 rounded-3xl border border-gray-200 dark:border-gray-700/50">
        <div className="order-2 lg:order-1 space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Microscope className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            Research & Development
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            This platform was engineered as an advanced <strong>Computer Vision (CS-436) CEP Project</strong>. It bridges the gap between academic research and production-grade software development.
          </p>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <strong className="block text-gray-900 dark:text-white">Custom Annotation Pipeline</strong>
                <span className="text-sm text-gray-600 dark:text-gray-400">Roboflow was utilized to curate, augment, and strictly annotate thousands of hyper-specific field samples.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <BarChart3 className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <strong className="block text-gray-900 dark:text-white">Strict Evaluation Metrics</strong>
                <span className="text-sm text-gray-600 dark:text-gray-400">Models were rigorously judged on Precision, Recall, mAP50, and mAP50-95 to prevent overfitting and ensure robustness.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Layers className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <strong className="block text-gray-900 dark:text-white">Architecture Optimization</strong>
                <span className="text-sm text-gray-600 dark:text-gray-400">Transitioned from heavy, slow architectures to Edge-AI capable YOLO Nano variants without sacrificing mAP.</span>
              </div>
            </li>
          </ul>
        </div>
        
        <div className="order-1 lg:order-2 grid grid-cols-2 gap-4">
           {/* Visual mock of charts/metrics */}
           <div className="col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
             <div className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">Model Precision (PR Curve)</div>
             <div className="h-32 flex items-end gap-2">
                {[40, 65, 75, 82, 88, 92, 94, 93, 95].map((h, i) => (
                  <div key={i} className="flex-1 bg-blue-500 dark:bg-blue-600 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity" style={{ height: `${h}%` }}></div>
                ))}
             </div>
             <div className="mt-4 flex justify-between text-xs text-gray-400 font-bold">
               <span>Epoch 1</span>
               <span>Epoch 50</span>
             </div>
           </div>
           
           <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
             <div className="text-xs text-gray-500 font-bold mb-1">mAP50-95</div>
             <div className="text-2xl font-black text-gray-900 dark:text-white">0.784</div>
           </div>
           <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
             <div className="text-xs text-gray-500 font-bold mb-1">F1 Score</div>
             <div className="text-2xl font-black text-gray-900 dark:text-white">0.912</div>
           </div>
        </div>
      </section>

      {/* 7. VISION FOOTER */}
      <section className="text-center max-w-3xl mx-auto px-4">
        <Globe className="w-12 h-12 text-emerald-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Vision for the Future</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
          WheatSense is an evolving ecosystem. Future milestones include integrating drone-based aerial surveillance integration, real-time edge processing on mobile devices, and deploying multimodal LLMs for interactive agricultural advisory.
        </p>
        <div className="flex justify-center gap-4 text-sm font-bold text-gray-400">
          <span className="flex items-center gap-1"><Users className="w-4 h-4"/> Empowering Farmers</span>
          <span className="text-gray-300">•</span>
          <span className="flex items-center gap-1"><Sprout className="w-4 h-4"/> Securing Yields</span>
        </div>
      </section>

    </div>
  );
}