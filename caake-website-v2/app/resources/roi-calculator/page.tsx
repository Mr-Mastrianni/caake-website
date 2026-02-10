'use client'

import { useState, useMemo } from 'react'
import { ArrowLeft, Calculator, DollarSign, Clock, Users, TrendingUp, Building2, Zap, AlertCircle, CheckCircle, BarChart3, Download, Mail } from 'lucide-react'
import Link from 'next/link'

// Preset configurations for different process types
const processPresets = {
  'custom': { name: 'Custom Process', hoursPerWeek: 20, hourlyRate: 50, automationPotential: 50, errorRate: 5, errorCost: 500 },
  'data-entry': { name: 'Data Entry & Processing', hoursPerWeek: 40, hourlyRate: 35, automationPotential: 75, errorRate: 8, errorCost: 200 },
  'invoice': { name: 'Invoice Processing', hoursPerWeek: 15, hourlyRate: 45, automationPotential: 80, errorRate: 4, errorCost: 150 },
  'customer-support': { name: 'Customer Support Tickets', hoursPerWeek: 60, hourlyRate: 40, automationPotential: 60, errorRate: 3, errorCost: 100 },
  'reporting': { name: 'Report Generation', hoursPerWeek: 25, hourlyRate: 65, automationPotential: 70, errorRate: 2, errorCost: 300 },
  'onboarding': { name: 'Employee Onboarding', hoursPerWeek: 10, hourlyRate: 55, automationPotential: 65, errorRate: 5, errorCost: 400 },
  'compliance': { name: 'Compliance Checking', hoursPerWeek: 20, hourlyRate: 80, automationPotential: 55, errorRate: 1, errorCost: 1000 },
  'inventory': { name: 'Inventory Management', hoursPerWeek: 30, hourlyRate: 38, automationPotential: 70, errorRate: 6, errorCost: 250 },
}

const complexityLevels = {
  'simple': { name: 'Simple', automationRange: [60, 85], multiplier: 0.8 },
  'moderate': { name: 'Moderate', automationRange: [40, 70], multiplier: 1.0 },
  'complex': { name: 'Complex', automationRange: [25, 50], multiplier: 1.3 },
}

const companySizes = {
  'small': { name: 'Small (1-50)', scaleFactor: 1, hourlyRateAdjustment: -5 },
  'medium': { name: 'Medium (51-500)', scaleFactor: 1.1, hourlyRateAdjustment: 0 },
  'large': { name: 'Large (500+)', scaleFactor: 1.2, hourlyRateAdjustment: 10 },
  'enterprise': { name: 'Enterprise (5000+)', scaleFactor: 1.3, hourlyRateAdjustment: 20 },
}

export default function ROICalculator() {
  // Selection states
  const [selectedProcess, setSelectedProcess] = useState('custom')
  const [selectedComplexity, setSelectedComplexity] = useState('moderate')
  const [selectedSize, setSelectedSize] = useState('medium')
  const [timeHorizon, setTimeHorizon] = useState(3)
  
  // Custom input states (initialized from preset)
  const preset = processPresets[selectedProcess as keyof typeof processPresets]
  const complexity = complexityLevels[selectedComplexity as keyof typeof complexityLevels]
  const companySize = companySizes[selectedSize as keyof typeof companySizes]
  
  const [inputs, setInputs] = useState({
    numEmployees: 5,
    hoursPerWeek: preset.hoursPerWeek,
    hourlyRate: preset.hourlyRate + companySize.hourlyRateAdjustment,
    automationPercent: Math.floor((complexity.automationRange[0] + complexity.automationRange[1]) / 2),
    errorRate: preset.errorRate,
    errorCost: preset.errorCost,
    // Cost breakdown
    softwareCost: 5000,
    servicesCost: 8000,
    trainingCost: 2000,
    annualMaintenance: 1500,
  })

  // Update inputs when presets change
  useMemo(() => {
    const newPreset = processPresets[selectedProcess as keyof typeof processPresets]
    const newComplexity = complexityLevels[selectedComplexity as keyof typeof complexityLevels]
    const newSize = companySizes[selectedSize as keyof typeof companySizes]
    
    setInputs(prev => ({
      ...prev,
      hoursPerWeek: newPreset.hoursPerWeek,
      hourlyRate: newPreset.hourlyRate + newSize.hourlyRateAdjustment,
      automationPercent: Math.floor((newComplexity.automationRange[0] + newComplexity.automationRange[1]) / 2),
      errorRate: newPreset.errorRate,
      errorCost: newPreset.errorCost,
    }))
  }, [selectedProcess, selectedComplexity, selectedSize])

  // Calculations
  const totalImplementationCost = inputs.softwareCost + inputs.servicesCost + inputs.trainingCost
  const weeklyHoursAutomated = inputs.hoursPerWeek * (inputs.automationPercent / 100)
  const weeklyLaborSavings = weeklyHoursAutomated * inputs.hourlyRate * inputs.numEmployees
  
  // Error reduction savings
  const currentWeeklyErrors = (inputs.hoursPerWeek * inputs.numEmployees) * (inputs.errorRate / 100)
  const automatedWeeklyErrors = currentWeeklyErrors * 0.2 // 80% error reduction
  const weeklyErrorSavings = (currentWeeklyErrors - automatedWeeklyErrors) * inputs.errorCost
  
  const totalWeeklySavings = weeklyLaborSavings + weeklyErrorSavings
  const monthlySavings = totalWeeklySavings * 4.3
  const annualSavings = totalWeeklySavings * 52
  const annualNetSavings = annualSavings - inputs.annualMaintenance
  
  // Multi-year projections
  const year1Net = annualNetSavings - totalImplementationCost
  const year2Net = annualNetSavings
  const year3Net = annualNetSavings * 1.05 // 5% efficiency gain
  const total3Year = year1Net + year2Net + year3Net
  
  const roi = ((annualSavings - totalImplementationCost) / totalImplementationCost) * 100
  const paybackMonths = totalImplementationCost / monthlySavings
  
  // Scenario analysis
  const conservativeSavings = annualSavings * 0.7
  const optimisticSavings = annualSavings * 1.3

  return (
    <div className="overflow-hidden">
      <section className="section-padding pt-32">
        <div className="container-custom max-w-6xl">
          <Link href="/resources" className="text-gold text-sm flex items-center gap-2 mb-8 hover:underline">
            <ArrowLeft size={16} /> Back to Resources
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <Calculator className="w-6 h-6 text-gold" />
            <span className="text-gold text-sm font-medium uppercase tracking-wider">Tool</span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Automation ROI Calculator
          </h1>

          <p className="text-xl text-white/60 mb-12 max-w-3xl">
            Estimate the potential return on investment for your automation project. 
            Select a process type or enter custom values to see your projected savings.
          </p>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Inputs */}
            <div className="xl:col-span-2 space-y-6">
              {/* Quick Selectors */}
              <div className="card p-6">
                <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-gold" />
                  Quick Configuration
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/80">
                      Process Type
                    </label>
                    <select
                      value={selectedProcess}
                      onChange={(e) => setSelectedProcess(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-gold focus:outline-none transition-colors"
                    >
                      {Object.entries(processPresets).map(([key, preset]) => (
                        <option key={key} value={key}>{preset.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/80">
                      Complexity Level
                    </label>
                    <select
                      value={selectedComplexity}
                      onChange={(e) => setSelectedComplexity(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-gold focus:outline-none transition-colors"
                    >
                      {Object.entries(complexityLevels).map(([key, level]) => (
                        <option key={key} value={key}>{level.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/80">
                      Company Size
                    </label>
                    <select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-gold focus:outline-none transition-colors"
                    >
                      {Object.entries(companySizes).map(([key, size]) => (
                        <option key={key} value={key}>{size.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Process Details */}
              <div className="card p-6">
                <h2 className="font-display text-lg font-bold mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5 text-gold" />
                  Process Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/80">
                      Number of Employees Doing This Task
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={inputs.numEmployees}
                      onChange={(e) => setInputs({...inputs, numEmployees: Number(e.target.value)})}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-gold focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/80">
                      Hours Per Week (per person)
                    </label>
                    <input
                      type="number"
                      value={inputs.hoursPerWeek}
                      onChange={(e) => setInputs({...inputs, hoursPerWeek: Number(e.target.value)})}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-gold focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/80">
                      Fully Loaded Hourly Rate ($)
                    </label>
                    <input
                      type="number"
                      value={inputs.hourlyRate}
                      onChange={(e) => setInputs({...inputs, hourlyRate: Number(e.target.value)})}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-gold focus:outline-none transition-colors"
                    />
                    <p className="text-white/40 text-xs mt-1">Include benefits, overhead, etc.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/80">
                      Automation Potential: {inputs.automationPercent}%
                    </label>
                    <input
                      type="range"
                      min={complexity.automationRange[0]}
                      max={complexity.automationRange[1]}
                      value={inputs.automationPercent}
                      onChange={(e) => setInputs({...inputs, automationPercent: Number(e.target.value)})}
                      className="w-full accent-gold mt-2"
                    />
                    <div className="flex justify-between text-xs text-white/40 mt-1">
                      <span>{complexity.automationRange[0]}%</span>
                      <span>{complexity.automationRange[1]}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Reduction */}
              <div className="card p-6">
                <h2 className="font-display text-lg font-bold mb-6 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-gold" />
                  Error Reduction Benefits
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/80">
                      Current Error Rate (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={inputs.errorRate}
                      onChange={(e) => setInputs({...inputs, errorRate: Number(e.target.value)})}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-gold focus:outline-none transition-colors"
                    />
                    <p className="text-white/40 text-xs mt-1">Percentage of tasks with errors</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/80">
                      Average Cost Per Error ($)
                    </label>
                    <input
                      type="number"
                      value={inputs.errorCost}
                      onChange={(e) => setInputs({...inputs, errorCost: Number(e.target.value)})}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-gold focus:outline-none transition-colors"
                    />
                    <p className="text-white/40 text-xs mt-1">Time to fix + any direct costs</p>
                  </div>
                </div>
              </div>

              {/* Implementation Costs */}
              <div className="card p-6">
                <h2 className="font-display text-lg font-bold mb-6 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-gold" />
                  Investment Breakdown
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/80">
                      Software & Licenses ($)
                    </label>
                    <input
                      type="number"
                      value={inputs.softwareCost}
                      onChange={(e) => setInputs({...inputs, softwareCost: Number(e.target.value)})}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-gold focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/80">
                      Implementation Services ($)
                    </label>
                    <input
                      type="number"
                      value={inputs.servicesCost}
                      onChange={(e) => setInputs({...inputs, servicesCost: Number(e.target.value)})}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-gold focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/80">
                      Training & Change Management ($)
                    </label>
                    <input
                      type="number"
                      value={inputs.trainingCost}
                      onChange={(e) => setInputs({...inputs, trainingCost: Number(e.target.value)})}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-gold focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/80">
                      Annual Maintenance ($)
                    </label>
                    <input
                      type="number"
                      value={inputs.annualMaintenance}
                      onChange={(e) => setInputs({...inputs, annualMaintenance: Number(e.target.value)})}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-gold focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="mt-6 p-4 bg-white/5 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Initial Investment</span>
                    <span className="font-display text-2xl font-bold text-gold">
                      ${totalImplementationCost.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Results */}
            <div className="space-y-6">
              {/* Main Results Card */}
              <div className="card p-6 bg-gradient-to-br from-gold/10 to-transparent border-gold/20 sticky top-32">
                <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-gold" />
                  Projected ROI
                </h2>

                {/* Time Horizon Toggle */}
                <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-lg">
                  {[1, 2, 3].map((year) => (
                    <button
                      key={year}
                      onClick={() => setTimeHorizon(year)}
                      className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                        timeHorizon === year
                          ? 'bg-gold text-midnight'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      {year} Year{year > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
                
                <div className="space-y-5">
                  <div className="p-4 bg-white/5 rounded-lg">
                    <p className="text-white/60 text-sm mb-1">
                      Net Benefit ({timeHorizon} Year{timeHorizon > 1 ? 's' : ''})
                    </p>
                    <p className="font-display text-4xl font-bold text-gold">
                      ${timeHorizon === 1 ? year1Net.toLocaleString() : 
                        timeHorizon === 2 ? (year1Net + year2Net).toLocaleString() :
                        total3Year.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Return on Investment</p>
                      <p className="font-display text-2xl font-bold text-gold">
                        {timeHorizon === 1 ? roi.toFixed(0) : (roi * timeHorizon).toFixed(0)}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Payback Period</p>
                      <p className="font-display text-2xl font-bold text-gold">
                        {paybackMonths <= 12 ? `${paybackMonths.toFixed(1)} months` : `${(paybackMonths / 12).toFixed(1)} years`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Annual Savings</p>
                      <p className="font-display text-2xl font-bold text-gold">
                        ${annualNetSavings.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Hours Saved Per Week</p>
                      <p className="font-display text-2xl font-bold text-gold">
                        {weeklyHoursAutomated.toFixed(1)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-white/60 text-sm mb-3">Year-by-Year Breakdown</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Year 1</span>
                      <span className={year1Net >= 0 ? 'text-green-400' : 'text-red-400'}>
                        ${year1Net.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Year 2</span>
                      <span className="text-green-400">${year2Net.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Year 3</span>
                      <span className="text-green-400">${year3Net.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scenario Analysis */}
              <div className="card p-6">
                <h3 className="font-display text-lg font-bold mb-4">Scenario Analysis</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-white/60 text-xs mb-1">Conservative (70%)</p>
                    <p className="font-semibold text-red-400">${conservativeSavings.toLocaleString()}/year</p>
                  </div>
                  <div className="p-3 bg-gold/10 border border-gold/20 rounded-lg">
                    <p className="text-white/60 text-xs mb-1">Expected</p>
                    <p className="font-semibold text-gold">${annualSavings.toLocaleString()}/year</p>
                  </div>
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-white/60 text-xs mb-1">Optimistic (130%)</p>
                    <p className="font-semibold text-green-400">${optimisticSavings.toLocaleString()}/year</p>
                  </div>
                </div>
              </div>

              {/* Savings Breakdown */}
              <div className="card p-6">
                <h3 className="font-display text-lg font-bold mb-4">Annual Savings Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-white/60 text-sm">Labor Savings</span>
                    <span className="font-semibold">${(weeklyLaborSavings * 52).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-white/60 text-sm">Error Reduction</span>
                    <span className="font-semibold">${(weeklyErrorSavings * 52).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-white/60 text-sm">Annual Maintenance</span>
                    <span className="font-semibold text-red-400">-${inputs.annualMaintenance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-white/80 font-medium">Net Annual Benefit</span>
                    <span className="font-semibold text-gold">${annualNetSavings.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-white/5 rounded-lg p-6">
                <p className="text-white/70 text-sm mb-4">
                  Want a detailed analysis of your specific automation opportunity?
                </p>
                <a 
                  href="mailto:mastrianni@caake.org?subject=ROI Calculator Results&body=I ran the ROI calculator and would like to discuss the results." 
                  className="btn btn-primary w-full justify-center mb-3"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Discuss Results
                </a>
                <button 
                  onClick={() => window.print()}
                  className="btn btn-ghost w-full justify-center text-sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Save / Print Results
                </button>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="mt-12 card p-8">
            <h3 className="font-display text-xl font-bold mb-4">How This Calculator Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-semibold text-gold mb-2">Labor Savings</h4>
                <p className="text-white/60">
                  Calculated from hours automated × hourly rate × number of employees. 
                  Includes loaded costs (benefits, overhead).
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gold mb-2">Error Reduction</h4>
                <p className="text-white/60">
                  Assumes 80% reduction in errors from automation. Error cost includes 
                  time to fix plus any direct costs (rework, penalties, etc.).
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gold mb-2">Investment</h4>
                <p className="text-white/60">
                  One-time costs (software, services, training) plus ongoing annual 
                  maintenance and support.
                </p>
              </div>
            </div>
            <p className="text-white/40 text-sm mt-6">
              Note: Results are estimates. Actual savings depend on implementation quality, 
              user adoption, and process specifics. Contact us for a detailed workflow analysis.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
