import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabase';
import { StepProfile } from './StepProfile';
import { StepHealth } from './StepHealth';
import { StepGoals } from './StepGoals';
import { StepSupplement } from './StepSupplement';

const STEP_LABELS = ['Profile', 'Health', 'Goals', 'Supplement'];

interface OnboardingData {
  display_name: string;
  age: number | '';
  gender: string;
  height_cm: number | '';
  weight_kg: number | '';
  waist_cm: number | '';
  activity_level: string;
  health_goals: string[];
  supplement_brand: string;
  supplement_product: string;
  supplement_dosage: string;
  daily_servings: number;
  skip_supplement: boolean;
}

export function OnboardingFlow() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    display_name: '',
    age: '',
    gender: '',
    height_cm: '',
    weight_kg: '',
    waist_cm: '',
    activity_level: '',
    health_goals: [],
    supplement_brand: '',
    supplement_product: '',
    supplement_dosage: '',
    daily_servings: 1,
    skip_supplement: false,
  });

  function handleChange(field: string, value: unknown) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  function handleBack() {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }

  function handleNext() {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  }

  async function handleComplete() {
    if (!user) return;
    setSaving(true);

    try {
      const profileUpdate: Record<string, unknown> = {
        display_name: data.display_name || undefined,
        age: data.age || undefined,
        gender: data.gender || undefined,
        height_cm: data.height_cm || undefined,
        weight_kg: data.weight_kg || undefined,
        waist_cm: data.waist_cm || undefined,
        activity_level: data.activity_level || undefined,
        health_goals: data.health_goals.length > 0 ? data.health_goals : undefined,
        onboarding_completed: true,
      };

      // Remove undefined values
      Object.keys(profileUpdate).forEach((key) => {
        if (profileUpdate[key] === undefined) {
          delete profileUpdate[key];
        }
      });

      const { error } = await supabase
        .from('profiles')
        .update(profileUpdate)
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
      }

      await refreshProfile();
      navigate('/');
    } catch (err) {
      console.error('Error completing onboarding:', err);
    } finally {
      setSaving(false);
    }
  }

  function renderStep() {
    switch (currentStep) {
      case 0:
        return <StepProfile data={data} onChange={handleChange} />;
      case 1:
        return <StepHealth data={data} onChange={handleChange} />;
      case 2:
        return <StepGoals data={data} onChange={handleChange} />;
      case 3:
        return <StepSupplement data={data} onChange={handleChange} />;
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl border border-gray-200/50 p-8 shadow-sm">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#D4FF00] rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-black" />
            </div>
            <h1 className="text-2xl font-bold text-[#1a1a1a] tracking-tight">
              Life Balance
            </h1>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-3 mb-2">
            {STEP_LABELS.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentStep
                    ? 'bg-[#D4FF00] scale-110'
                    : index < currentStep
                      ? 'bg-[#1a1a1a]'
                      : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Step Labels */}
          <div className="flex items-center justify-center gap-6 mb-8">
            {STEP_LABELS.map((label, index) => (
              <span
                key={label}
                className={`text-xs font-medium transition-colors ${
                  index === currentStep
                    ? 'text-[#1a1a1a]'
                    : 'text-gray-400'
                }`}
              >
                {label}
              </span>
            ))}
          </div>

          {/* Step Content */}
          <div className="mb-8">{renderStep()}</div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Back
            </button>

            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-[#D4FF00] text-black font-bold rounded-xl hover:bg-[#c5f000] active:scale-[0.98] transition-all"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={saving}
                className="px-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-900 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Complete Setup'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
