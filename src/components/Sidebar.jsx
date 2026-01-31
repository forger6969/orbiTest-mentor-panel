import React, { useState } from 'react';
import { Home, LayoutDashboard, FolderKanban, CheckSquare, BarChart3, Users, Settings, HelpCircle, ExternalLink, X, ChevronDown } from 'lucide-react';

const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState({
        home: false,
        dashboard: false,
        projects: false
    });

    const toggleExpand = (item) => {
        setIsExpanded(prev => ({
            ...prev,
            [item]: !prev[item]
        }));
    };



    return (
        <div className="w-64 bg-white border-r border-slate-200/60 flex flex-col relative shadow-xl shadow-slate-900/5 min-h-screen max-h-screen">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-300/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-300/50 to-transparent"></div>

            {/* Header */}
            <div className="p-5 pb-4 border-b border-slate-200/60">
                logo
            </div>

            {/* Search */}
            <div className="px-4 pt-4 pb-3">
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-200/0 via-slate-200/50 to-slate-200/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200/60 hover:border-slate-300 transition-all duration-200 group-hover:bg-white">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search"
                            className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
                        />
                        <kbd className="px-1.5 py-0.5 text-[11px] font-medium text-slate-400 bg-white border border-slate-200 rounded">⌘K</kbd>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                {/* Home */}
                <div>
                    <button
                        onClick={() => toggleExpand('home')}
                        className="w-full group relative flex items-center justify-between px-3 py-2.5 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-200 hover:text-slate-900"
                    >
                        <div className="flex items-center gap-3">
                            <Home className="w-[18px] h-[18px] text-slate-500 group-hover:text-slate-700 transition-colors duration-200" />
                            <span className="text-[14px] font-medium">Home</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isExpanded.home ? 'rotate-180' : ''}`} />
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-full opacity-0 group-hover:h-8 group-hover:opacity-100 transition-all duration-300"></div>
                    </button>

                    {isExpanded.home && (
                        <div className="ml-9 mt-1 mb-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
                            <a href="#" className="block px-3 py-1.5 text-[13px] text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-50 transition-all duration-150">
                                Overview
                            </a>
                            <a href="#" className="block px-3 py-1.5 text-[13px] text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-50 transition-all duration-150">
                                Analytics
                            </a>
                            <a href="#" className="block px-3 py-1.5 text-[13px] text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-50 transition-all duration-150">
                                Settings
                            </a>
                        </div>
                    )}
                </div>

                {/* Dashboard */}
                <div>
                    <button
                        onClick={() => toggleExpand('dashboard')}
                        className="w-full group relative flex items-center justify-between px-3 py-2.5 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-200 hover:text-slate-900"
                    >
                        <div className="flex items-center gap-3">
                            <LayoutDashboard className="w-[18px] h-[18px] text-slate-500 group-hover:text-slate-700 transition-colors duration-200" />
                            <span className="text-[14px] font-medium">Dashboard</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isExpanded.dashboard ? 'rotate-180' : ''}`} />
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-full opacity-0 group-hover:h-8 group-hover:opacity-100 transition-all duration-300"></div>
                    </button>

                    {isExpanded.dashboard && (
                        <div className="ml-9 mt-1 mb-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
                            <a href="#" className="block px-3 py-1.5 text-[13px] text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-50 transition-all duration-150">
                                Overview
                            </a>
                            <a href="#" className="block px-3 py-1.5 text-[13px] text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-50 transition-all duration-150">
                                Analytics
                            </a>
                            <a href="#" className="block px-3 py-1.5 text-[13px] text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-50 transition-all duration-150">
                                Settings
                            </a>
                        </div>
                    )}
                </div>

                {/* Projects */}
                <div>
                    <button
                        onClick={() => toggleExpand('projects')}
                        className="w-full group relative flex items-center justify-between px-3 py-2.5 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-200 hover:text-slate-900"
                    >
                        <div className="flex items-center gap-3">
                            <FolderKanban className="w-[18px] h-[18px] text-slate-500 group-hover:text-slate-700 transition-colors duration-200" />
                            <span className="text-[14px] font-medium">Projects</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isExpanded.projects ? 'rotate-180' : ''}`} />
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-full opacity-0 group-hover:h-8 group-hover:opacity-100 transition-all duration-300"></div>
                    </button>

                    {isExpanded.projects && (
                        <div className="ml-9 mt-1 mb-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
                            <a href="#" className="block px-3 py-1.5 text-[13px] text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-50 transition-all duration-150">
                                Overview
                            </a>
                            <a href="#" className="block px-3 py-1.5 text-[13px] text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-50 transition-all duration-150">
                                Analytics
                            </a>
                            <a href="#" className="block px-3 py-1.5 text-[13px] text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-50 transition-all duration-150">
                                Settings
                            </a>
                        </div>
                    )}
                </div>

                {/* Tasks */}
                <div>
                    <button className="w-full group relative flex items-center justify-between px-3 py-2.5 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-200 hover:text-slate-900">
                        <div className="flex items-center gap-3">
                            <CheckSquare className="w-[18px] h-[18px] text-slate-500 group-hover:text-slate-700 transition-colors duration-200" />
                            <span className="text-[14px] font-medium">Tasks</span>
                        </div>
                        <span className="px-2 py-0.5 text-[11px] font-semibold text-slate-600 bg-slate-100 rounded-full">10</span>
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-full opacity-0 group-hover:h-8 group-hover:opacity-100 transition-all duration-300"></div>
                    </button>
                </div>

                {/* Reporting */}
                <div>
                    <button className="w-full group relative flex items-center justify-between px-3 py-2.5 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-200 hover:text-slate-900">
                        <div className="flex items-center gap-3">
                            <BarChart3 className="w-[18px] h-[18px] text-slate-500 group-hover:text-slate-700 transition-colors duration-200" />
                            <span className="text-[14px] font-medium">Reporting</span>
                        </div>
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-full opacity-0 group-hover:h-8 group-hover:opacity-100 transition-all duration-300"></div>
                    </button>
                </div>

                {/* Users */}
                <div>
                    <button className="w-full group relative flex items-center justify-between px-3 py-2.5 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-200 hover:text-slate-900">
                        <div className="flex items-center gap-3">
                            <Users className="w-[18px] h-[18px] text-slate-500 group-hover:text-slate-700 transition-colors duration-200" />
                            <span className="text-[14px] font-medium">Users</span>
                        </div>
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-full opacity-0 group-hover:h-8 group-hover:opacity-100 transition-all duration-300"></div>
                    </button>
                </div>
            </nav>

            {/* Bottom section */}
            <div className="px-3 py-3 space-y-0.5 border-t border-slate-200/60">
                {/* Settings */}
                <button className="w-full group relative flex items-center justify-between px-3 py-2.5 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-200 hover:text-slate-900">
                    <div className="flex items-center gap-3">
                        <Settings className="w-[18px] h-[18px] text-slate-500 group-hover:text-slate-700 transition-colors duration-200" />
                        <span className="text-[14px] font-medium">Settings</span>
                    </div>
                </button>

                {/* Support */}
                <button className="w-full group relative flex items-center justify-between px-3 py-2.5 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-200 hover:text-slate-900">
                    <div className="flex items-center gap-3">
                        <HelpCircle className="w-[18px] h-[18px] text-slate-500 group-hover:text-slate-700 transition-colors duration-200" />
                        <span className="text-[14px] font-medium">Support</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[11px] font-medium text-emerald-600">Online</span>
                    </div>
                </button>

                {/* Open in browser */}
                <button className="w-full group relative flex items-center justify-between px-3 py-2.5 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-200 hover:text-slate-900">
                    <div className="flex items-center gap-3">
                        <ExternalLink className="w-[18px] h-[18px] text-slate-500 group-hover:text-slate-700 transition-colors duration-200" />
                        <span className="text-[14px] font-medium">Open in browser</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors duration-200" />
                </button>
            </div>



            {/* User profile */}
            <div className="p-3 border-t border-slate-200/60">
                <button className="w-full group flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-all duration-200">
                    <div className="relative">
                        <img
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                            alt="User"
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-md"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1 text-left">
                        <p className="text-[13px] font-semibold text-slate-800">Olivia Rhye</p>
                        <p className="text-[12px] text-slate-500">olivia@untitledui.com</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors duration-200" />
                </button>
            </div>

        </div>
    );
};

export default Sidebar;