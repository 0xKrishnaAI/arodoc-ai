import { motion } from 'framer-motion';
import { Calendar, Activity, FileText, ChevronRight, AlertCircle, CheckCircle } from 'lucide-react';

const HealthTimeline = ({ events = [] }) => {
    // Sort events by date descending if not already
    const sortedEvents = [...events].sort((a, b) => new Date(b.date) - new Date(a.date));

    // If no events, show placeholder
    if (!sortedEvents.length) {
        return (
            <div className="w-full p-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50">
                <div className="w-12 h-12 mx-auto mb-3 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                    <Calendar className="w-5 h-5" />
                </div>
                <h4 className="text-slate-600 dark:text-slate-300 font-medium mb-1">No Timeline Activity</h4>
                <p className="text-slate-400 text-sm">Your health events will appear here.</p>
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
            <div className="flex gap-4 min-w-max px-1">
                {sortedEvents.map((event, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative flex-shrink-0 w-64 p-4 rounded-xl border ${event.type === 'CRITICAL'
                                ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30'
                                : event.type === 'WARNING'
                                    ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30'
                                    : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'
                            } shadow-sm group hover:shadow-md transition-all duration-300 cursor-default`}
                    >
                        {/* Connector Line (except for last item) */}
                        {index !== sortedEvents.length - 1 && (
                            <div className="absolute top-1/2 -right-4 w-4 h-[2px] bg-slate-200 dark:bg-slate-700" />
                        )}

                        <div className="flex items-start gap-3 mb-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${event.type === 'CRITICAL' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                                    event.type === 'WARNING' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                                        'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                                }`}>
                                {event.icon === 'report' ? <FileText className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">
                                    {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </p>
                                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate" title={event.title}>
                                    {event.title}
                                </h4>
                            </div>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 min-h-[2.5em]">
                            {event.description}
                        </p>

                        <div className={`mt-3 flex items-center text-xs font-medium ${event.type === 'CRITICAL' ? 'text-red-600 dark:text-red-400' :
                                event.type === 'WARNING' ? 'text-amber-600 dark:text-amber-400' :
                                    'text-emerald-600 dark:text-emerald-400'
                            }`}>
                            {event.type === 'CRITICAL' ? <AlertCircle className="w-3.5 h-3.5 mr-1" /> : <CheckCircle className="w-3.5 h-3.5 mr-1" />}
                            {event.status || 'Completed'}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default HealthTimeline;
