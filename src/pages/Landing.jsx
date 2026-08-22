import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeBar, setActiveBar] = useState(null);

  // DayBars mock data for interactive hero visual
  const dayBarsData = [
    { day: 'M', height: 'h-24', status: 'Present', time: '09:02 AM' },
    { day: 'T', height: 'h-32', status: 'Present', time: '08:58 AM' },
    { day: 'W', height: 'h-28', status: 'Present', time: '09:15 AM' },
    { day: 'T', height: 'h-36', status: 'Present', time: '08:45 AM' },
    { day: 'F', height: 'h-30', status: 'Present', time: '09:00 AM' },
    { day: 'S', height: 'h-12', status: 'Weekend', time: 'Off' },
    { day: 'S', height: 'h-10', status: 'Weekend', time: 'Off' },
  ];

  return (
    <div className="min-h-screen bg-[#0B0B10] text-slate-100 selection:bg-[#B24BE8]/30 selection:text-purple-200 relative overflow-hidden font-['Inter']">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-150px] left-1/4 w-[600px] h-[600px] bg-[#B24BE8]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[400px] right-[-100px] w-[500px] h-[500px] bg-[#FFB258]/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#B24BE8] to-[#8E24AA] flex items-center justify-center font-bold text-white shadow-lg shadow-[#B24BE8]/25 font-['Space_Grotesk']">
            D
          </div>
          <span className="text-xl font-bold tracking-tight font-['Space_Grotesk'] text-white">DayFlow</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wider text-slate-400">
          <a href="#features" className="hover:text-slate-200 transition">PRODUCT</a>
          <a href="#roles" className="hover:text-slate-200 transition">ROLES</a>
          <a href="#tech" className="hover:text-slate-200 transition">ARCHITECTURE</a>
        </div>

        <button
          onClick={() => navigate('/login')}
          className="px-5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono uppercase tracking-wider text-slate-200 hover:border-slate-700 hover:bg-slate-800 transition"
        >
          Sign In
        </button>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-12 pb-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 backdrop-blur">
              <span className="flex h-2 w-2 relative">
              </span>
              <span className="text-[11px] font-mono tracking-widest text-[#FFB258] uppercase font-semibold">
                HR MANAGEMENT & PAYROLL SYSTEM
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-['Space_Grotesk'] text-white leading-[1.08]">
              Every workday, <br />
              <span className="bg-gradient-to-r from-white via-slate-200 to-[#B24BE8] bg-clip-text text-transparent">
                perfectly aligned.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed">
              DayFlow brings onboarding, daily attendance, verified leave requests, and automated payroll
              into one high-fidelity system of record. Clear for employees, seamless for HR officers.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => navigate('/login')}
                className="px-7 py-3.5 rounded-xl bg-[#B24BE8] hover:bg-[#9d3cd1] text-white font-semibold text-sm transition-all duration-200 shadow-xl shadow-[#B24BE8]/25 hover:shadow-[#B24BE8]/40 hover:-translate-y-0.5"
              >
                Sign in to DayFlow
              </button>

              <button
                onClick={() => navigate('/login?mode=signup')}
                className="px-6 py-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-medium text-sm transition group flex items-center gap-2"
              >
                Register your company
                <span className="text-[#FFB258] group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </div>

          {/* Right Hero Content: Live DayBars Interactive Card */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800/80 rounded-3xl p-6 shadow-2xl backdrop-blur relative group">
              <div className="flex items-center justify-between pb-6 border-b border-slate-800/60">
                <div>
                  <h2 className="text-xs font-mono uppercase tracking-widest text-slate-400">Weekly Alignment</h2>
                  <p className="text-sm font-bold text-white mt-0.5">Live Shift Telemetry</p>
                </div>
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Synced
                </div>
              </div>

              {/* DayBars Visualizer */}
              <div className="h-56 flex items-end justify-between gap-3 pt-8 pb-4 px-2">
                {dayBarsData.map((item, idx) => (
                  <div
                    key={idx}
                    onMouseEnter={() => setActiveBar(item)}
                    onMouseLeave={() => setActiveBar(null)}
                    className="flex-1 flex flex-col items-center gap-3 cursor-pointer group/bar"
                  >
                    <div className="w-full bg-slate-800/40 rounded-lg p-1 flex flex-col justify-end h-40">
                      <div
                        className={`w-full rounded-md transition-all duration-300 ${item.height} ${item.status === 'Weekend'
                          ? 'bg-slate-800/60 group-hover/bar:bg-slate-700'
                          : 'bg-gradient-to-t from-[#B24BE8] to-[#FFB258] opacity-80 group-hover/bar:opacity-100 shadow-lg shadow-[#B24BE8]/20'
                          }`}
                      />
                    </div>
                    <span className="font-mono text-xs text-slate-400 group-hover/bar:text-white transition">
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>

              {/* Dynamic Status Display on Hover */}
              <div className="mt-4 p-3 bg-slate-950/80 border border-slate-800/60 rounded-xl flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">
                  {activeBar ? `Shift: ${activeBar.status}` : 'Hover any day to inspect'}
                </span>
                <span className="text-[#FFB258] font-semibold">
                  {activeBar ? activeBar.time : 'MON – SUN, EVERY TIME'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <section id="features" className="pt-28 space-y-8">
          <div>
            <span className="text-[11px] font-mono tracking-widest text-[#FFB258] uppercase font-semibold">
              CORE CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-['Space_Grotesk'] text-white mt-1">
              Four things HR does every week, in one place
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                tag: 'Clock In / Clock Out',
                title: 'Attendance',
                desc: 'Daily check-ins with present, absent, half-day states and automated extra-hours tracking.',
                accent: 'border-purple-500/20 hover:border-purple-500/50',
              },
              {
                tag: 'Paid • Sick • Unpaid',
                title: 'Leave & Time-off',
                desc: 'Employees select ranges with remarks. Approvals update records and payable days in real time.',
                accent: 'border-[#FFB258]/20 hover:border-[#FFB258]/50',
              },
              {
                tag: 'Read-only for employees',
                title: 'Payroll Visibility',
                desc: 'Auto-calculated wage components (Basic, HRA, Allowances, PF) synced directly with attendance.',
                accent: 'border-purple-500/20 hover:border-purple-500/50',
              },
              {
                tag: 'One queue, zero guesswork',
                title: 'Approvals Hub',
                desc: 'Actionable review queue for HR officers to inspect attachments, comment, and resolve requests.',
                accent: 'border-slate-700 hover:border-slate-600',
              },
            ].map((f, i) => (
              <div
                key={i}
                className={`bg-slate-900/60 border ${f.accent} p-6 rounded-2xl transition-all duration-200 hover:-translate-y-1 backdrop-blur flex flex-col justify-between`}
              >
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-2">
                    {f.tag}
                  </span>
                  <h3 className="text-xl font-bold font-['Space_Grotesk'] text-slate-100">{f.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-3">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Role Breakdown */}
        <section id="roles" className="pt-24 space-y-8">
          <div>
            <span className="text-[11px] font-mono tracking-widest text-[#FFB258] uppercase font-semibold">
              TWO LOGINS, TWO VIEWS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-['Space_Grotesk'] text-white mt-1">
              Built around who’s asking
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/50 border border-slate-800/80 p-8 rounded-3xl space-y-6">
              <span className="inline-block px-3 py-1 bg-[#FFB258]/10 text-[#FFB258] border border-[#FFB258]/20 rounded-full text-xs font-mono font-semibold">
                EMPLOYEE
              </span>
              <h3 className="text-2xl font-bold font-['Space_Grotesk'] text-white">Your week, at a glance</h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-center gap-3">
                  <span className="text-purple-400">✓</span> View and edit personal profile, contact, and address
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-purple-400">✓</span> Instant check-in / out with real-time status dots
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-purple-400">✓</span> Request paid/sick leaves and track approval status
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-purple-400">✓</span> Inspect transparent salary breakdowns and deductions
                </li>
              </ul>
            </div>

            <div className="bg-slate-900/50 border border-slate-800/80 p-8 rounded-3xl space-y-6">
              <span className="inline-block px-3 py-1 bg-[#B24BE8]/10 text-[#B24BE8] border border-[#B24BE8]/20 rounded-full text-xs font-mono font-semibold">
                ADMIN / HR OFFICER
              </span>
              <h3 className="text-2xl font-bold font-['Space_Grotesk'] text-white">Every employee, one console</h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-center gap-3">
                  <span className="text-[#FFB258]">✓</span> Seamless employee directory with attendance filters
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#FFB258]">✓</span> One-click approval/rejection workflows with comments
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#FFB258]">✓</span> Full salary structure configuration and wage definitions
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#FFB258]">✓</span> Automated login ID generation and secure onboarding
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Card */}
        <section className="pt-24">
          <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-950 border border-purple-500/20 p-10 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white">Ready to align your week?</h3>
              <p className="text-slate-400 text-sm mt-1">Sign in with your employee ID, or register your organization to get started.</p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3.5 bg-[#B24BE8] hover:bg-[#9d3cd1] text-white font-semibold text-sm rounded-xl shadow-lg shadow-[#B24BE8]/30 transition whitespace-nowrap"
            >
              Sign In
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-600 gap-4">
        <span>DayFlow HRMS</span>
        <span>Built with Love</span>
      </footer>
    </div>
  );
}