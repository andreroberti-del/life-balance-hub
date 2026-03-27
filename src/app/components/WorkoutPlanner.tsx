import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Target,
  Dumbbell,
  TrendingUp,
  Calendar,
  Check,
  Plus,
  Zap,
  Clock,
  Flame,
  ChevronRight,
  X,
  ArrowRight,
  Home,
  Building2,
  Activity,
  Eye,
  EyeOff
} from 'lucide-react';
import { WorkoutPlan } from './WorkoutPlan';

// Mock data
const mockGoals = [
  { id: 1, type: 'weight_loss', target: 'Perder 10kg', progress: 40, current: 78, target_value: 68 },
  { id: 2, type: 'muscle_gain', target: 'Ganhar massa', progress: 60, current: 12, target_value: 18 },
];

const objectives = [
  {
    id: 'weight_loss',
    icon: TrendingUp,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    label_en: 'Lose Weight',
    label_pt: 'Perder Peso',
    label_es: 'Perder Peso',
    emoji: '\u{1F525}'
  },
  {
    id: 'muscle_gain',
    icon: Dumbbell,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    label_en: 'Build Muscle',
    label_pt: 'Ganhar Massa',
    label_es: 'Ganar Masa',
    emoji: '\u{1F4AA}'
  },
  {
    id: 'endurance',
    icon: Zap,
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
    label_en: 'Endurance',
    label_pt: 'Resist\u00EAncia',
    label_es: 'Resistencia',
    emoji: '\u26A1'
  },
  {
    id: 'toning',
    icon: Target,
    color: 'from-pink-500 to-pink-600',
    bgColor: 'bg-pink-50',
    label_en: 'Toning',
    label_pt: 'Defini\u00E7\u00E3o',
    label_es: 'Tonificaci\u00F3n',
    emoji: '\u2728'
  },
];

export function WorkoutPlanner() {
  const { t, language } = useLanguage();
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState<any>(null);
  const [wizardData, setWizardData] = useState({
    objective: '',
    currentWeight: 75,
    currentBodyFat: 20,
    currentMuscleMass: 0,
    currentVisceralFat: 0,
    currentWater: 0,
    targetWeight: 68,
    targetBodyFat: 15,
    targetMuscleMass: 0,
    targetVisceralFat: 0,
    deadline: 90, // dias
    workoutsPerWeek: 3,
    experience: 'beginner',
    equipment: 'gym',
    hasBioimpedance: false,
    targetHasBioimpedance: false,
  });

  // Safe access to translation keys with fallbacks
  const tWorkout = (t as any)?.workout || {};
  const tCommon = (t as any)?.common || {};

  const handleObjectiveClick = (objId: string) => {
    setWizardData({ ...wizardData, objective: objId });
    setShowWizard(true);
    setWizardStep(1);
  };

  const nextStep = () => {
    if (wizardStep < 3) {
      setWizardStep(wizardStep + 1);
    }
  };

  const closeWizard = () => {
    setShowWizard(false);
    setWizardStep(1);
  };

  const generatePlan = () => {
    console.log('Gerando plano com:', wizardData);
    closeWizard();
  };

  const getObjectiveData = (objId: string) => {
    return objectives.find(o => o.id === objId);
  };

  const getObjectiveLabel = (objId: string) => {
    const obj = getObjectiveData(objId);
    if (!obj) return '';
    return language === 'pt' ? obj.label_pt : language === 'es' ? obj.label_es : obj.label_en;
  };

  const selectedObj = getObjectiveData(wizardData.objective);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2">{tWorkout.title || 'Workout Planner'}</h1>
        <p className="text-gray-500">{tWorkout.subtitle || 'Plan your workouts with AI'}</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-3xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-[#D4FF00] rounded-xl flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-[#1a1a1a]" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[#1a1a1a] mb-1">8</div>
          <div className="text-xs text-gray-500">{tWorkout.workoutsCompleted || 'Workouts Completed'}</div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[#1a1a1a] mb-1">2.8k</div>
          <div className="text-xs text-gray-500">{tWorkout.caloriesBurned || 'Calories Burned'}</div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[#1a1a1a] mb-1">62</div>
          <div className="text-xs text-gray-500">{tWorkout.minutesPerWorkout || 'Min/Workout'}</div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-500" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[#1a1a1a] mb-1">3</div>
          <div className="text-xs text-gray-500">{tWorkout.activeGoals || 'Active Goals'}</div>
        </div>
      </div>

      {/* Main CTA */}
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-3xl p-8 mb-8 text-white">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-[#D4FF00] rounded-2xl flex items-center justify-center text-3xl">
            {'\u{1F3AF}'}
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-1">{tWorkout.selectObjective || 'Select Your Objective'}</h2>
            <p className="text-gray-400 text-sm">{tWorkout.selectObjectiveDesc || 'Choose your fitness goal to get started'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {objectives.map((obj) => {
            const label = language === 'pt' ? obj.label_pt : language === 'es' ? obj.label_es : obj.label_en;

            return (
              <button
                key={obj.id}
                onClick={() => handleObjectiveClick(obj.id)}
                className="group relative bg-white/5 hover:bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10 transition-all hover:scale-105 hover:border-[#D4FF00]"
              >
                <div className="text-4xl mb-3">{obj.emoji}</div>
                <p className="text-sm font-bold text-white">{label}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Goals */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#1a1a1a]">{tWorkout.yourGoals || 'Your Goals'}</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {mockGoals.map((goal) => (
            <div key={goal.id} className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#1a1a1a]">{goal.target}</h3>
                <span className="text-2xl font-bold text-[#D4FF00]">{goal.progress}%</span>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>{goal.current} kg</span>
                <ChevronRight className="w-4 h-4" />
                <span className="font-bold text-[#1a1a1a]">{goal.target_value} kg</span>
              </div>

              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#D4FF00] to-[#a8cc00] transition-all duration-500"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workout Plan Section */}
      <WorkoutPlan />

      {/* Wizard Modal */}
      {showWizard && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-[#1a1a1a]">{tWorkout.wizardTitle || 'Workout Wizard'}</h2>
                <button onClick={closeWizard} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-all">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`h-2 rounded-full flex-1 transition-all ${
                      step <= wizardStep ? 'bg-[#D4FF00]' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400">{tWorkout.objective || 'Objective'}</span>
                <span className="text-xs text-gray-400">{tWorkout.current || 'Current'}</span>
                <span className="text-xs text-gray-400">{tWorkout.target || 'Target'}</span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">

              {/* Step 1 - Objective */}
              {wizardStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <div className="text-6xl mb-4">{selectedObj?.emoji || '\u{1F3AF}'}</div>
                    <h3 className="text-2xl font-bold text-[#1a1a1a] mb-2">{getObjectiveLabel(wizardData.objective)}</h3>
                    <p className="text-gray-500">{tWorkout.wizardStep1Desc || 'Choose your primary fitness objective'}</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {objectives.map((obj) => {
                      const label = language === 'pt' ? obj.label_pt : language === 'es' ? obj.label_es : obj.label_en;
                      const isSelected = wizardData.objective === obj.id;

                      return (
                        <button
                          key={obj.id}
                          onClick={() => setWizardData({ ...wizardData, objective: obj.id })}
                          className={`p-6 rounded-2xl border-2 transition-all hover:scale-105 ${
                            isSelected
                              ? 'border-[#D4FF00] bg-[#D4FF00]/10'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-4xl mb-3">{obj.emoji}</div>
                          <p className="text-xs font-bold text-[#1a1a1a]">{label}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 2 - Current State */}
              {wizardStep === 2 && (
                <div className="space-y-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-[#1a1a1a] mb-2">{tWorkout.wizardStep2Title || 'Current State'}</h3>
                    <p className="text-gray-500">{tWorkout.wizardStep2Desc || 'Tell us about your current body composition'}</p>
                  </div>

                  {/* Bioimpedance Toggle */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                          <Activity className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#1a1a1a]">{tWorkout.haveBioimpedance || 'Have Bioimpedance?'}</p>
                          <p className="text-xs text-gray-500">{tWorkout.bioimpedanceDesc || 'Include advanced body composition data'}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setWizardData({ ...wizardData, hasBioimpedance: !wizardData.hasBioimpedance })}
                        className={`relative w-16 h-8 rounded-full transition-all ${
                          wizardData.hasBioimpedance ? 'bg-[#D4FF00]' : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                            wizardData.hasBioimpedance ? 'translate-x-8' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Current Weight */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-semibold text-[#1a1a1a]">{tWorkout.currentWeight || 'Current Weight'}</label>
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold text-[#1a1a1a]">{wizardData.currentWeight}</span>
                        <span className="text-sm text-gray-500">kg</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="150"
                      value={wizardData.currentWeight}
                      onChange={(e) => setWizardData({ ...wizardData, currentWeight: Number(e.target.value) })}
                      className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #D4FF00 0%, #D4FF00 ${((wizardData.currentWeight - 40) / 110) * 100}%, #e5e7eb ${((wizardData.currentWeight - 40) / 110) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>40 kg</span>
                      <span>150 kg</span>
                    </div>
                  </div>

                  {/* Current Body Fat */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-semibold text-[#1a1a1a]">{tWorkout.currentBodyFat || 'Current Body Fat'}</label>
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold text-[#1a1a1a]">{wizardData.currentBodyFat}</span>
                        <span className="text-sm text-gray-500">%</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={wizardData.currentBodyFat}
                      onChange={(e) => setWizardData({ ...wizardData, currentBodyFat: Number(e.target.value) })}
                      className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #D4FF00 0%, #D4FF00 ${((wizardData.currentBodyFat - 5) / 45) * 100}%, #e5e7eb ${((wizardData.currentBodyFat - 5) / 45) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>5%</span>
                      <span>50%</span>
                    </div>
                  </div>

                  {/* Bioimpedance Extra Fields */}
                  {wizardData.hasBioimpedance && (
                    <div className="space-y-6 p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                      <div className="flex items-center gap-2 mb-4">
                        <Activity className="w-5 h-5 text-blue-600" />
                        <p className="text-sm font-bold text-blue-900">{tWorkout.bioimpedanceData || 'Bioimpedance Data'}</p>
                      </div>

                      {/* Muscle Mass */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-semibold text-[#1a1a1a]">{tWorkout.muscleMass || 'Muscle Mass'}</label>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-purple-600">{wizardData.currentMuscleMass}</span>
                            <span className="text-sm text-gray-500">kg</span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min="20"
                          max="80"
                          value={wizardData.currentMuscleMass}
                          onChange={(e) => setWizardData({ ...wizardData, currentMuscleMass: Number(e.target.value) })}
                          className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, #9333ea 0%, #9333ea ${((wizardData.currentMuscleMass - 20) / 60) * 100}%, #e5e7eb ${((wizardData.currentMuscleMass - 20) / 60) * 100}%, #e5e7eb 100%)`
                          }}
                        />
                      </div>

                      {/* Visceral Fat */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-semibold text-[#1a1a1a]">{tWorkout.visceralFat || 'Visceral Fat'}</label>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-orange-600">{wizardData.currentVisceralFat}</span>
                            <span className="text-sm text-gray-500">n\u00EDvel</span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="30"
                          value={wizardData.currentVisceralFat}
                          onChange={(e) => setWizardData({ ...wizardData, currentVisceralFat: Number(e.target.value) })}
                          className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, #ea580c 0%, #ea580c ${((wizardData.currentVisceralFat - 1) / 29) * 100}%, #e5e7eb ${((wizardData.currentVisceralFat - 1) / 29) * 100}%, #e5e7eb 100%)`
                          }}
                        />
                      </div>

                      {/* Body Water */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-semibold text-[#1a1a1a]">{tWorkout.bodyWater || 'Body Water'}</label>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-blue-600">{wizardData.currentWater}</span>
                            <span className="text-sm text-gray-500">%</span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min="30"
                          max="70"
                          value={wizardData.currentWater}
                          onChange={(e) => setWizardData({ ...wizardData, currentWater: Number(e.target.value) })}
                          className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, #2563eb 0%, #2563eb ${((wizardData.currentWater - 30) / 40) * 100}%, #e5e7eb ${((wizardData.currentWater - 30) / 40) * 100}%, #e5e7eb 100%)`
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3 - Target & Preferences */}
              {wizardStep === 3 && (
                <div className="space-y-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-[#1a1a1a] mb-2">{tWorkout.wizardStep3Title || 'Target & Preferences'}</h3>
                    <p className="text-gray-500">{tWorkout.wizardStep3Desc || 'Set your goals and workout preferences'}</p>
                  </div>

                  {/* Target Weight */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-semibold text-[#1a1a1a]">{tWorkout.targetWeight || 'Target Weight'}</label>
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold text-[#D4FF00]">{wizardData.targetWeight}</span>
                        <span className="text-sm text-gray-500">kg</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="150"
                      value={wizardData.targetWeight}
                      onChange={(e) => setWizardData({ ...wizardData, targetWeight: Number(e.target.value) })}
                      className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #D4FF00 0%, #D4FF00 ${((wizardData.targetWeight - 40) / 110) * 100}%, #e5e7eb ${((wizardData.targetWeight - 40) / 110) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                  </div>

                  {/* Target Body Fat */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-semibold text-[#1a1a1a]">{tWorkout.targetBodyFat || 'Target Body Fat'}</label>
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold text-[#D4FF00]">{wizardData.targetBodyFat}</span>
                        <span className="text-sm text-gray-500">%</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={wizardData.targetBodyFat}
                      onChange={(e) => setWizardData({ ...wizardData, targetBodyFat: Number(e.target.value) })}
                      className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #D4FF00 0%, #D4FF00 ${((wizardData.targetBodyFat - 5) / 45) * 100}%, #e5e7eb ${((wizardData.targetBodyFat - 5) / 45) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                  </div>

                  {/* Deadline */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-semibold text-[#1a1a1a]">{tWorkout.deadline || 'Deadline'}</label>
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold text-[#1a1a1a]">{wizardData.deadline}</span>
                        <span className="text-sm text-gray-500">{tCommon.days || 'days'}</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="365"
                      step="30"
                      value={wizardData.deadline}
                      onChange={(e) => setWizardData({ ...wizardData, deadline: Number(e.target.value) })}
                      className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #D4FF00 0%, #D4FF00 ${((wizardData.deadline - 30) / 335) * 100}%, #e5e7eb ${((wizardData.deadline - 30) / 335) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>1 {tCommon.month || 'month'}</span>
                      <span>12 {tCommon.month || 'month'}s</span>
                    </div>
                  </div>

                  {/* Workouts per Week */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-semibold text-[#1a1a1a]">{tWorkout.workoutsPerWeek || 'Workouts/Week'}</label>
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold text-[#1a1a1a]">{wizardData.workoutsPerWeek}</span>
                        <span className="text-sm text-gray-500">x/{tCommon.week || 'week'}</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="7"
                      value={wizardData.workoutsPerWeek}
                      onChange={(e) => setWizardData({ ...wizardData, workoutsPerWeek: Number(e.target.value) })}
                      className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #D4FF00 0%, #D4FF00 ${((wizardData.workoutsPerWeek - 2) / 5) * 100}%, #e5e7eb ${((wizardData.workoutsPerWeek - 2) / 5) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                  </div>

                  {/* Experience Level */}
                  <div>
                    <label className="text-sm font-semibold text-[#1a1a1a] mb-3 block">{tWorkout.experience || 'Experience'}</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['beginner', 'intermediate', 'advanced'].map((level) => (
                        <button
                          key={level}
                          onClick={() => setWizardData({ ...wizardData, experience: level })}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            wizardData.experience === level
                              ? 'border-[#D4FF00] bg-[#D4FF00]/10'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <p className="text-sm font-bold text-[#1a1a1a]">{tWorkout[level as 'beginner' | 'intermediate' | 'advanced'] || level}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Equipment */}
                  <div>
                    <label className="text-sm font-semibold text-[#1a1a1a] mb-3 block">{tWorkout.equipment || 'Equipment'}</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setWizardData({ ...wizardData, equipment: 'gym' })}
                        className={`p-6 rounded-xl border-2 transition-all ${
                          wizardData.equipment === 'gym'
                            ? 'border-[#D4FF00] bg-[#D4FF00]/10'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Building2 className="w-8 h-8 mx-auto mb-2 text-[#1a1a1a]" />
                        <p className="text-sm font-bold text-[#1a1a1a]">{tWorkout.gym || 'Gym'}</p>
                      </button>
                      <button
                        onClick={() => setWizardData({ ...wizardData, equipment: 'home' })}
                        className={`p-6 rounded-xl border-2 transition-all ${
                          wizardData.equipment === 'home'
                            ? 'border-[#D4FF00] bg-[#D4FF00]/10'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Home className="w-8 h-8 mx-auto mb-2 text-[#1a1a1a]" />
                        <p className="text-sm font-bold text-[#1a1a1a]">{tWorkout.home || 'Home'}</p>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100">
              <div className="flex gap-3">
                {wizardStep > 1 && (
                  <button
                    onClick={() => setWizardStep(wizardStep - 1)}
                    className="px-6 py-3 bg-gray-100 text-[#1a1a1a] rounded-xl font-semibold hover:bg-gray-200 transition-all"
                  >
                    {tWorkout.previous || 'Previous'}
                  </button>
                )}

                {wizardStep < 3 ? (
                  <button
                    onClick={nextStep}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#1a1a1a] text-white rounded-xl font-semibold hover:bg-[#2a2a2a] transition-all"
                  >
                    <span>{tWorkout.next || 'Next'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={generatePlan}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#D4FF00] to-[#a8cc00] text-[#1a1a1a] rounded-xl font-bold hover:opacity-90 transition-all"
                  >
                    <Zap className="w-5 h-5" />
                    <span>{tWorkout.generatePlan || 'Generate Plan'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
