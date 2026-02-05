"use client";

import { Check, X, BarChart2 } from "lucide-react";

export function ComparisonTable() {
  return (
    <section id="comparison" className="space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 mb-4">
          <BarChart2 className="w-4 h-4 text-[#111827]" />
          <span className="text-xs font-medium text-[#111827] uppercase tracking-wide">
            Comparison
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4 text-[#111827]">
          The Smart Choice for Newcomers
        </h2>
        <p className="text-lg text-gray-500 leading-relaxed">
          See how we compare to traditional childcare options
        </p>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block glass-card rounded-3xl p-8 md:p-12">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left pb-4 text-gray-600 font-semibold">
                Feature
              </th>
              <th className="text-center pb-4 text-gray-500 font-semibold">
                Daycare
              </th>
              <th className="text-center pb-4 text-gray-500 font-semibold">
                Informal Sitter
              </th>
              <th className="text-center pb-4 text-[#E5533D] font-semibold">
                littlëHALO
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Waitlist */}
            <tr className="border-b border-gray-100">
              <td className="py-5 font-medium text-[#111827]">Waitlist</td>
              <td className="py-5 text-center text-gray-600">9-12 Months</td>
              <td className="py-5 text-center text-gray-600">None</td>
              <td className="py-5 text-center font-semibold text-[#111827]">
                None (Instant)
              </td>
            </tr>

            {/* Background Checks */}
            <tr className="border-b border-gray-100">
              <td className="py-5 font-medium text-[#111827]">
                Background Checks
              </td>
              <td className="py-5 text-center">
                <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100">
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
              </td>
              <td className="py-5 text-center">
                <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100">
                  <X className="w-4 h-4 text-red-600" />
                </div>
              </td>
              <td className="py-5 text-center">
                <div className="inline-flex flex-col items-center gap-1">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-medium text-emerald-700">
                    Verified
                  </span>
                </div>
              </td>
            </tr>

            {/* Cultural Match */}
            <tr className="border-b border-gray-100">
              <td className="py-5 font-medium text-[#111827]">
                Cultural Match
              </td>
              <td className="py-5 text-center text-gray-600">Random</td>
              <td className="py-5 text-center text-gray-600">Luck-based</td>
              <td className="py-5 text-center">
                <div className="inline-flex flex-col items-center gap-1">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-medium text-emerald-700">
                    Guaranteed
                  </span>
                </div>
              </td>
            </tr>

            {/* Insurance */}
            <tr className="border-b border-gray-100">
              <td className="py-5 font-medium text-[#111827]">Insurance</td>
              <td className="py-5 text-center text-gray-600">Yes</td>
              <td className="py-5 text-center text-gray-600">No</td>
              <td className="py-5 text-center">
                <div className="inline-flex flex-col items-center gap-1">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-medium text-emerald-700">
                    Included
                  </span>
                </div>
              </td>
            </tr>

            {/* Cost */}
            <tr>
              <td className="py-5 font-medium text-[#111827]">Cost</td>
              <td className="py-5 text-center text-gray-600">High (Monthly)</td>
              <td className="py-5 text-center text-gray-600">$15-25/hr</td>
              <td className="py-5 text-center font-bold text-[#111827]">
                $18-28/hr
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="max-w-2xl mx-auto md:hidden space-y-4">
        {/* Waitlist Card */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold text-[#111827] mb-4">Waitlist</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Daycare</span>
              <span className="text-sm font-medium">9-12 Months</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Informal Sitter</span>
              <span className="text-sm font-medium">None</span>
            </div>
            <div className="flex items-center justify-between py-2 bg-[#FFE5B4]/30 -mx-3 px-3 rounded-lg">
              <span className="text-sm font-semibold">littlëHALO</span>
              <span className="text-sm font-bold text-[#E5533D]">
                None (Instant)
              </span>
            </div>
          </div>
        </div>

        {/* Background Checks Card */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold text-[#111827] mb-4">
            Background Checks
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Daycare</span>
              <Check className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Informal Sitter</span>
              <X className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex items-center justify-between py-2 bg-[#FFE5B4]/30 -mx-3 px-3 rounded-lg">
              <span className="text-sm font-semibold">littlëHALO</span>
              <div className="flex items-center gap-1">
                <Check className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-medium text-emerald-700">
                  Verified
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cultural Match Card */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold text-[#111827] mb-4">Cultural Match</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Daycare</span>
              <span className="text-sm font-medium">Random</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Informal Sitter</span>
              <span className="text-sm font-medium">Luck-based</span>
            </div>
            <div className="flex items-center justify-between py-2 bg-[#FFE5B4]/30 -mx-3 px-3 rounded-lg">
              <span className="text-sm font-semibold">littlëHALO</span>
              <div className="flex items-center gap-1">
                <Check className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-medium text-emerald-700">
                  Guaranteed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Insurance Card */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold text-[#111827] mb-4">Insurance</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Daycare</span>
              <span className="text-sm font-medium">Yes</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Informal Sitter</span>
              <span className="text-sm font-medium">No</span>
            </div>
            <div className="flex items-center justify-between py-2 bg-[#FFE5B4]/30 -mx-3 px-3 rounded-lg">
              <span className="text-sm font-semibold">littlëHALO</span>
              <div className="flex items-center gap-1">
                <Check className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-medium text-emerald-700">
                  Included
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cost Card */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold text-[#111827] mb-4">Cost</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Daycare</span>
              <span className="text-sm font-medium">High (Monthly)</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Informal Sitter</span>
              <span className="text-sm font-medium">$15-25/hr</span>
            </div>
            <div className="flex items-center justify-between py-2 bg-[#FFE5B4]/30 -mx-3 px-3 rounded-lg">
              <span className="text-sm font-semibold">littlëHALO</span>
              <span className="text-sm font-bold text-[#E5533D]">
                $18-28/hr
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
