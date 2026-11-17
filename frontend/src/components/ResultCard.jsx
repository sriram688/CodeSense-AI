import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

export default function ResultCard({
  title,
  icon: Icon,
  badge,
  badgeColor = 'indigo',
  children,
  actionButton = null,
  defaultExpanded = true,
  className = '',
  copyableContent = null
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!copyableContent) return;
    try {
      await navigator.clipboard.writeText(copyableContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const getBadgeStyle = (color) => {
    switch (color) {
      case 'rose':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'amber':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'emerald':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'blue':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'purple':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default:
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    }
  };

  return (
    <div
      className={`rounded-2xl glass-card border border-slate-800/80 light:border-slate-200 transition-all duration-300 hover:border-indigo-500/40 shadow-lg ${className}`}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/60 light:border-slate-200/80">
        <div className="flex items-center space-x-3">
          {Icon && (
            <div className="p-2 rounded-xl bg-slate-900 light:bg-slate-100 border border-slate-800 light:border-slate-200 text-indigo-400 light:text-indigo-600">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-100 light:text-slate-900 tracking-tight">
                {title}
              </h3>
              {badge && (
                <span
                  className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${getBadgeStyle(
                    badgeColor
                  )}`}
                >
                  {badge}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {copyableContent && (
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 light:hover:text-slate-900 hover:bg-slate-800 light:hover:bg-slate-200 transition-colors"
              title="Copy content"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          )}

          {actionButton}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 light:hover:text-slate-900 hover:bg-slate-800 light:hover:bg-slate-200 transition-colors"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Card Body */}
      {isExpanded && <div className="p-5">{children}</div>}
    </div>
  );
}
