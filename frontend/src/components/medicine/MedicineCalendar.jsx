import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MedicineCalendar = ({ medicines = [] }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];
    const days = [];
    const dayList = eachDayOfInterval({ start: startDate, end: endDate });

    // Helper to get status for a day
    // In a real app, this would aggregate data from a history log
    // For this demo, we'll simulate some history based on the 'medicines' prop status
    // and randomizing slightly for visual demonstration if it's in the past
    const getDayStatus = (day) => {
        if (isToday(day)) {
            const allTaken = medicines.every(m => m.status === 'Taken');
            const anyMissed = medicines.some(m => m.status === 'Missed');
            if (allTaken) return 'taken';
            if (anyMissed) return 'missed';
            return 'pending';
        }

        // Simulation logic for past dates
        if (day < new Date()) {
            // Hash day to deterministic pseudo-random status
            const hash = day.getDate() + day.getMonth();
            if (hash % 7 === 0) return 'missed';
            return 'taken';
        }

        return 'future';
    };

    dayList.forEach((day, index) => {
        const formattedDate = format(day, dateFormat);
        const status = getDayStatus(day);

        let statusColor = "";
        let StatusIcon = null;

        if (status === 'taken') {
            statusColor = "bg-emerald-100/50 text-emerald-600 border-emerald-200";
            StatusIcon = isSameMonth(day, monthStart) ? <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mx-auto mt-1" /> : null;
        } else if (status === 'missed') {
            statusColor = "bg-rose-100/50 text-rose-600 border-rose-200";
            StatusIcon = isSameMonth(day, monthStart) ? <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mx-auto mt-1" /> : null;
        } else if (status === 'pending') {
            statusColor = "bg-amber-100/50 text-amber-600 border-amber-200";
            StatusIcon = isSameMonth(day, monthStart) ? <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mx-auto mt-1" /> : null;
        }

        days.push(
            <div
                className={`flex flex-col h-14 md:h-20 lg:h-24 p-1 md:p-2 border border-slate-50 relative transition-colors duration-200
                    ${!isSameMonth(day, monthStart) ? "text-slate-300 bg-slate-50/30" : "text-slate-700"}
                    ${isToday(day) ? "bg-primary-50/30 font-bold ring-1 ring-inset ring-primary-200" : ""}
                    ${isSameMonth(day, monthStart) ? "hover:bg-slate-50" : ""}
                `}
                key={day}
            >
                <div className="flex justify-between items-start">
                    <span className={`text-xs md:text-sm w-6 h-6 flex items-center justify-center rounded-full
                        ${isToday(day) ? "bg-primary text-white" : ""}
                    `}>
                        {formattedDate}
                    </span>
                </div>

                {isSameMonth(day, monthStart) && (
                    <div className="mt-auto flex justify-center pb-1">
                        {status === 'taken' && (
                            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] w-full justify-center">
                                <CheckCircle2 className="w-3 h-3" />
                                <span className="hidden md:inline">Taken</span>
                            </div>
                        )}
                        {status === 'missed' && (
                            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] w-full justify-center">
                                <AlertTriangle className="w-3 h-3" />
                                <span className="hidden md:inline">Missed</span>
                            </div>
                        )}
                        {status === 'pending' && (
                            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] w-full justify-center">
                                <Clock className="w-3 h-3" />
                                <span className="hidden md:inline">Pending</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    });

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-soft border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Medicine History</h3>
                <div className="flex items-center gap-2">
                    <button onClick={prevMonth} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                        <ChevronLeft className="w-5 h-5 text-slate-500" />
                    </button>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 w-32 text-center">
                        {format(currentMonth, "MMMM yyyy")}
                    </span>
                    <button onClick={nextMonth} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                        <ChevronRight className="w-5 h-5 text-slate-500" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="py-2 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7">
                {days}
            </div>

            <div className="p-3 flex items-center justify-end gap-4 text-xs text-slate-500 border-t border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>All Taken</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Pending</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>Missed</span>
                </div>
            </div>
        </div>
    );
};

export default MedicineCalendar;
