import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { RefreshCw, AlertCircle, Database, Clock, TrendingUp } from 'lucide-react';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316'];

export default function Analytics() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/analytics');
      const data = await res.json();
      if (data.success) {
        setHistory(data.history);
      } else {
        setError(data.error || 'Failed to load analytics.');
      }
    } catch (err) {
      console.error(err);
      setError('Could not connect to backend to fetch analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading analytics data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-6 rounded-xl flex items-start gap-4">
        <AlertCircle className="w-8 h-8 text-red-500 flex-shrink-0" />
        <div>
          <h3 className="text-lg font-bold text-red-800 dark:text-red-300 mb-1">Error Loading Data</h3>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button onClick={fetchAnalytics} className="btn-outline border-red-200 text-red-600 hover:bg-red-100">
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
        <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">No Data Available</h2>
        <p className="text-gray-500">Run some detections in the Detection page to see analytics.</p>
      </div>
    );
  }

  // Prepare data for charts
  const performanceData = history.map((entry, index) => ({
    name: `Run ${index + 1}`,
    YOLOv8_Confidence: entry.model1.avg_confidence,
    YOLOv10_Confidence: entry.model2.avg_confidence,
    YOLOv8_Speed: entry.model1.inference_time_ms,
    YOLOv10_Speed: entry.model2.inference_time_ms,
  }));

  // Average Metrics
  const avgYOLOv8Conf = (history.reduce((acc, curr) => acc + curr.model1.avg_confidence, 0) / history.length).toFixed(1);
  const avgYOLOv10Conf = (history.reduce((acc, curr) => acc + curr.model2.avg_confidence, 0) / history.length).toFixed(1);
  const avgYOLOv8Speed = (history.reduce((acc, curr) => acc + curr.model1.inference_time_ms, 0) / history.length).toFixed(1);
  const avgYOLOv10Speed = (history.reduce((acc, curr) => acc + curr.model2.inference_time_ms, 0) / history.length).toFixed(1);

  // Disease Distribution v8
  const diseaseCountV8 = {};
  history.forEach(run => {
    run.model1.classes.forEach(c => {
      diseaseCountV8[c] = (diseaseCountV8[c] || 0) + 1;
    });
  });
  const pieDataV8 = Object.keys(diseaseCountV8).map(key => ({
    name: key,
    value: diseaseCountV8[key]
  }));

  // Disease Distribution v10
  const diseaseCountV10 = {};
  history.forEach(run => {
    run.model2.classes.forEach(c => {
      diseaseCountV10[c] = (diseaseCountV10[c] || 0) + 1;
    });
  });
  const pieDataV10 = Object.keys(diseaseCountV10).map(key => ({
    name: key,
    value: diseaseCountV10[key]
  }));

  return (
    <div className="max-w-7xl mx-auto animate-fade-in pb-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">System Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">Historical performance comparison between YOLOv8 and YOLOv10.</p>
        </div>
        <button onClick={fetchAnalytics} className="btn-outline">
          <RefreshCw className="w-4 h-4" /> Refresh Data
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-800">
          <div className="text-emerald-800 dark:text-emerald-300 text-sm font-bold mb-1">Total Scans</div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{history.length}</div>
        </div>
        <div className="card">
          <div className="text-gray-500 dark:text-gray-400 text-sm font-bold mb-1 flex items-center gap-2"><TrendingUp className="w-4 h-4"/> Avg Confidence</div>
          <div className="flex justify-between items-end mt-2">
            <div>
              <div className="text-xs text-gray-400">v8 (best.pt)</div>
              <div className="text-xl font-bold">{avgYOLOv8Conf}%</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">v10 (nano)</div>
              <div className="text-xl font-bold text-blue-500">{avgYOLOv10Conf}%</div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="text-gray-500 dark:text-gray-400 text-sm font-bold mb-1 flex items-center gap-2"><Clock className="w-4 h-4"/> Avg Speed (ms)</div>
          <div className="flex justify-between items-end mt-2">
            <div>
              <div className="text-xs text-gray-400">v8 (best.pt)</div>
              <div className="text-xl font-bold">{avgYOLOv8Speed}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">v10 (nano)</div>
              <div className="text-xl font-bold text-blue-500">{avgYOLOv10Speed}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Speed Chart */}
        <div className="card h-96">
          <h3 className="text-lg font-bold mb-4">Inference Speed Comparison</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Milliseconds (ms)', angle: -90, position: 'insideLeft' }} />
              <RechartsTooltip contentStyle={{ backgroundColor: '#1f2937', color: '#fff', border: 'none', borderRadius: '8px' }} />
              <Legend />
              <Line type="monotone" dataKey="YOLOv8_Speed" name="YOLOv8 (best.pt)" stroke="#10b981" strokeWidth={3} dot={{r: 4}} />
              <Line type="monotone" dataKey="YOLOv10_Speed" name="YOLOv10 Nano" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Confidence Chart */}
        <div className="card h-96">
          <h3 className="text-lg font-bold mb-4">Average Confidence Comparison</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} label={{ value: 'Confidence (%)', angle: -90, position: 'insideLeft' }} />
              <RechartsTooltip contentStyle={{ backgroundColor: '#1f2937', color: '#fff', border: 'none', borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="YOLOv8_Confidence" name="YOLOv8" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="YOLOv10_Confidence" name="YOLOv10" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Pie Chart v8 */}
        <div className="card h-80 flex flex-col">
          <h3 className="text-lg font-bold mb-2">Disease Distribution (YOLOv8)</h3>
          <div className="flex-1">
            {pieDataV8.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieDataV8}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieDataV8.map((entry, index) => (
                      <Cell key={`cell-v8-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
               <div className="h-full flex items-center justify-center text-gray-500">No diseases logged yet.</div>
            )}
          </div>
        </div>

        {/* Pie Chart v10 */}
        <div className="card h-80 flex flex-col">
          <h3 className="text-lg font-bold mb-2">Disease Distribution (YOLOv10)</h3>
          <div className="flex-1">
            {pieDataV10.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieDataV10}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieDataV10.map((entry, index) => (
                      <Cell key={`cell-v10-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
               <div className="h-full flex items-center justify-center text-gray-500">No diseases logged yet.</div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold mb-4">Recent Prediction Logs</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <th className="py-3 px-4 text-sm font-bold text-gray-600 dark:text-gray-400">Time</th>
                <th className="py-3 px-4 text-sm font-bold text-gray-600 dark:text-gray-400 text-center">v8 Conf</th>
                <th className="py-3 px-4 text-sm font-bold text-gray-600 dark:text-gray-400 text-center">v10 Conf</th>
                <th className="py-3 px-4 text-sm font-bold text-gray-600 dark:text-gray-400">Found (v8)</th>
                <th className="py-3 px-4 text-sm font-bold text-gray-600 dark:text-gray-400">Found (v10)</th>
              </tr>
            </thead>
            <tbody>
              {[...history].reverse().slice(0, 5).map((log, idx) => (
                <tr key={idx} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-3 px-4 text-sm whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${log.model1.avg_confidence > 70 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
                      {log.model1.avg_confidence}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${log.model2.avg_confidence > 70 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                      {log.model2.avg_confidence}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm max-w-xs truncate text-emerald-600 dark:text-emerald-400">
                    {log.model1.classes.join(', ') || 'None'}
                  </td>
                  <td className="py-3 px-4 text-sm max-w-xs truncate text-blue-600 dark:text-blue-400">
                    {log.model2.classes.join(', ') || 'None'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
