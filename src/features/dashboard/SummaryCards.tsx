import React from 'react';
import { DashboardMetrics, StatusFilter } from '../../types/post';
import { Layers, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface SummaryCardsProps {
  metrics: DashboardMetrics;
  activeStatusFilter: StatusFilter;
  onSelectStatusFilter: (status: StatusFilter) => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  metrics,
  activeStatusFilter,
  onSelectStatusFilter,
}) => {
  const cards = [
    {
      id: 'all' as StatusFilter,
      label: 'Total Posts',
      count: metrics.total,
      icon: Layers,
      color: 'indigo',
      cardBorder:
        activeStatusFilter === 'all'
          ? 'ring-2 ring-indigo-500 border-indigo-500 bg-indigo-50/20'
          : 'border-slate-200/80 hover:border-indigo-300 bg-white',
      iconBg: 'bg-indigo-50 text-indigo-600',
      badge: 'All networks',
    },
    {
      id: 'scheduled' as StatusFilter,
      label: 'Scheduled',
      count: metrics.scheduled,
      icon: Clock,
      color: 'blue',
      cardBorder:
        activeStatusFilter === 'scheduled'
          ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50/20'
          : 'border-slate-200/80 hover:border-blue-300 bg-white',
      iconBg: 'bg-blue-50 text-blue-600',
      badge: 'Pending',
    },
    {
      id: 'published' as StatusFilter,
      label: 'Published',
      count: metrics.published,
      icon: CheckCircle2,
      color: 'emerald',
      cardBorder:
        activeStatusFilter === 'published'
          ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/20'
          : 'border-slate-200/80 hover:border-emerald-300 bg-white',
      iconBg: 'bg-emerald-50 text-emerald-600',
      badge: 'Live',
    },
    {
      id: 'failed' as StatusFilter,
      label: 'Failed',
      count: metrics.failed,
      icon: AlertCircle,
      color: 'rose',
      cardBorder:
        activeStatusFilter === 'failed'
          ? 'ring-2 ring-rose-500 border-rose-500 bg-rose-50/20'
          : 'border-slate-200/80 hover:border-rose-300 bg-white',
      iconBg: 'bg-rose-50 text-rose-600',
      badge: metrics.failed > 0 ? 'Needs retry' : 'None',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = activeStatusFilter === card.id;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectStatusFilter(card.id)}
            className={`text-left rounded-2xl border p-4 sm:p-5 transition-all shadow-card hover:shadow-card-hover cursor-pointer relative overflow-hidden group focus:outline-none ${card.cardBorder}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                {card.label}
              </span>
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${card.iconBg}`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {card.count}
              </span>
              <span
                className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                  isSelected
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {card.badge}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
