import React from 'react';

export default function MetricCard({ title, value, unit, icon: Icon, trend, status = 'safe', description }) {
  const getStatusClass = () => {
    switch (status) {
      case 'danger': return 'glowing-red';
      case 'warning': return 'glowing-orange';
      default: return 'glowing-green';
    }
  };

  const getLedClass = () => {
    switch (status) {
      case 'danger': return 'pulse-led-red';
      case 'warning': return 'pulse-led-orange';
      default: return 'pulse-led-green';
    }
  };

  const getTextColorClass = () => {
    switch (status) {
      case 'danger': return 'glow-text-red';
      case 'warning': return 'glow-text-orange';
      default: return 'glow-text-green';
    }
  };

  const getBorderColorHex = () => {
    switch (status) {
      case 'danger': return '#ffb4ab';
      case 'warning': return '#ff8c00';
      default: return '#34f885';
    }
  };

  return (
    <div className={`glass-panel ${getStatusClass()} p-4 flex flex-col justify-between relative overflow-hidden`} style={{ minHeight: '100px', borderLeft: `4px solid ${getBorderColorHex()}` }}>
      {/* LED status indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">{status}</span>
        <div className={getLedClass()}></div>
      </div>

      <div>
        <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
          {Icon && <Icon size={14} className="text-slate-400" />}
          <span>{title}</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`text-2xl font-extrabold tracking-tight ${getTextColorClass()}`}>
            {value}
          </span>
          {unit && <span className="text-xs font-semibold text-slate-500">{unit}</span>}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-slate-800/50 pt-2 text-[10px] text-slate-400">
        <span>{description}</span>
        {trend && (
          <span className={`font-semibold ${trend.direction === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trend.direction === 'up' ? '▲' : '▼'} {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}
