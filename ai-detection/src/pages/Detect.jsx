import React, { useState, useRef } from "react";
import { UploadCloud, CheckCircle, AlertCircle, Clock, Zap, Download } from "lucide-react";

export default function Detect() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [confidence, setConfidence] = useState(0.25);
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg("Please upload an image file.");
      return;
    }
    setImage(file);
    setResult(null);
    setErrorMsg(null);
    
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handlePredict = async () => {
    if (!image) return;
    
    setLoading(true);
    setResult(null);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("file", image);
    formData.append("confidence", confidence.toString());

    try {
      const res = await fetch("https://wheatsense-production.up.railway.app/predict", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.error) {
        setErrorMsg(data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      console.error("Error:", err);
      setErrorMsg("Failed to connect to the backend server. Make sure Flask is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (base64Img, filename) => {
    const link = document.createElement('a');
    link.href = base64Img;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const ModelResultCard = ({ data, recommended }) => (
    <div className={`card relative overflow-hidden ${recommended ? 'ring-2 ring-emerald-500 shadow-emerald-500/20' : ''}`}>
      {recommended && (
        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" /> BEST MODEL
        </div>
      )}
      
      <h3 className="text-xl font-bold mb-4">{data.name}</h3>
      
      <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 mb-4 group">
        <img 
          src={data.results.annotated_image} 
          alt={`${data.name} annotations`} 
          className="w-full object-contain max-h-[400px]"
        />
        <button 
          onClick={() => handleDownload(data.results.annotated_image, `${data.name.replace(/[^a-z0-9]/gi, '_')}.jpg`)}
          className="absolute bottom-2 right-2 p-2 bg-black/60 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
          title="Download Image"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
        <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">Detections</div>
          <div className="font-bold text-lg">{data.results.total_detections}</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">Confidence</div>
          <div className="font-bold text-lg">{data.results.average_confidence}%</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">Speed</div>
          <div className="font-bold text-lg">{data.results.inference_time_ms}ms</div>
        </div>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
        {data.results.detections.length === 0 ? (
          <div className="text-center p-4 text-gray-500 dark:text-gray-400 italic border-t border-gray-100 dark:border-gray-700 mt-4 pt-4">
            No diseases detected
          </div>
        ) : (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-4">
            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Detection Analysis</h4>
            {data.results.detections.map((det, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                <div className="p-3 bg-gray-50 dark:bg-gray-800/80 flex justify-between items-center border-b border-gray-100 dark:border-gray-700">
                  <span className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    {det.title}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold text-white ${det.confidence > 70 ? 'bg-emerald-500' : (det.confidence > 40 ? 'bg-amber-500' : 'bg-red-500')}`}>
                    {det.confidence}% Conf
                  </span>
                </div>
                
                <div className="p-3 space-y-3">
                  <div>
                    <h5 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Symptoms & Causes</h5>
                    <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Symptoms:</strong> {det.symptoms}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1"><strong>Causes:</strong> {det.causes}</p>
                  </div>
                  
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-lg border border-emerald-100 dark:border-emerald-800/50">
                    <h5 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">Treatment Plan</h5>
                    <p className="text-sm text-emerald-900 dark:text-emerald-200">{det.treatment}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                      <h5 className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-1">Prevention</h5>
                      <p className="text-xs text-blue-900 dark:text-blue-200">{det.prevention}</p>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg">
                      <h5 className="text-xs font-bold text-orange-700 dark:text-orange-400 uppercase tracking-wider mb-1">Control</h5>
                      <p className="text-xs text-orange-900 dark:text-orange-200">{det.control}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dual Model Detection</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Upload a wheat leaf image to compare predictions from YOLOv8 and YOLOv10 Nano simultaneously.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3 text-red-800 dark:text-red-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>{errorMsg}</p>
        </div>
      )}

      {!result && (
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 card">
            <div 
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors cursor-pointer bg-gray-50 dark:bg-gray-800/50 min-h-[300px] flex flex-col items-center justify-center relative"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {preview ? (
                <>
                  <img src={preview} alt="Preview" className="max-h-[400px] object-contain rounded-lg z-10" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center z-20">
                    <span className="text-white font-bold bg-black/50 px-4 py-2 rounded-lg">Click or drop to replace</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Upload Image</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">Drag and drop an image, or click to browse</p>
                  <span className="btn-primary">Browse Files</span>
                </>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          </div>
          
          <div className="card flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold mb-4">Detection Settings</h3>
              
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confidence Threshold</label>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{Math.round(confidence * 100)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0.01" 
                  max="1.0" 
                  step="0.01" 
                  value={confidence} 
                  onChange={(e) => setConfidence(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-emerald-600"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Lower threshold detects more objects but may increase false positives.
                </p>
              </div>
            </div>

            <button 
              onClick={handlePredict} 
              disabled={!image || loading}
              className={`w-full py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all ${
                !image 
                  ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500 dark:text-gray-400' 
                  : loading 
                    ? 'bg-emerald-500/50 cursor-wait' 
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/30'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Running Models...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Run Comparison
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold">Comparison Results</h2>
            <button 
              onClick={() => {setResult(null); setPreview(null); setImage(null);}}
              className="btn-outline text-sm py-1.5"
            >
              New Detection
            </button>
          </div>

          {/* Recommendation Banner */}
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 dark:bg-emerald-800 p-2 rounded-full">
                <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-emerald-900 dark:text-emerald-100 text-lg">
                  Recommended: {result.comparison.recommended_model}
                </h3>
                <p className="text-emerald-700 dark:text-emerald-300 text-sm">
                  {result.comparison.reason}
                </p>
              </div>
            </div>
          </div>

          {/* Side-by-Side Cards */}
          <div className="grid lg:grid-cols-2 gap-6 items-start">
            <ModelResultCard 
              data={result.model1} 
              recommended={result.comparison.recommended_model === result.model1.name} 
            />
            <ModelResultCard 
              data={result.model2} 
              recommended={result.comparison.recommended_model === result.model2.name} 
            />
          </div>
        </div>
      )}
    </div>
  );
}