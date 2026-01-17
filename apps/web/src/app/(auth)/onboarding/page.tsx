'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card } from '@/components/ui';
import { ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';

type LifeStage = 'single_building' | 'partnered_no_kids' | 'new_parent' | 'established_family' | 'empty_nester' | 'approaching_retirement';
type FinancialGoal = 'get_organized' | 'save_more' | 'reduce_debt' | 'protect_family' | 'plan_retirement' | 'build_wealth';
type PainPoint = 'dont_know_where_to_start' | 'overwhelmed' | 'no_time' | 'partner_disagreements' | 'shame_embarrassment' | 'lack_of_knowledge';

const LIFE_STAGES: { value: LifeStage; label: string; description: string }[] = [
  { value: 'single_building', label: 'Single & Building', description: 'Focused on career and personal growth' },
  { value: 'partnered_no_kids', label: 'Partnered, No Kids', description: 'Building a life together' },
  { value: 'new_parent', label: 'New Parent', description: 'Navigating life with young children' },
  { value: 'established_family', label: 'Established Family', description: 'Kids are growing, planning ahead' },
  { value: 'empty_nester', label: 'Empty Nester', description: 'Kids have left, new chapter beginning' },
  { value: 'approaching_retirement', label: 'Approaching Retirement', description: 'Planning for the next phase' },
];

const FINANCIAL_GOALS: { value: FinancialGoal; label: string }[] = [
  { value: 'get_organized', label: 'Get organized' },
  { value: 'save_more', label: 'Save more money' },
  { value: 'reduce_debt', label: 'Reduce debt' },
  { value: 'protect_family', label: 'Protect my family' },
  { value: 'plan_retirement', label: 'Plan for retirement' },
  { value: 'build_wealth', label: 'Build wealth' },
];

const PAIN_POINTS: { value: PainPoint; label: string }[] = [
  { value: 'dont_know_where_to_start', label: "I don't know where to start" },
  { value: 'overwhelmed', label: "I feel overwhelmed by it all" },
  { value: 'no_time', label: "I never have time to deal with this" },
  { value: 'partner_disagreements', label: "My partner and I disagree about money" },
  { value: 'shame_embarrassment', label: "I feel embarrassed about my finances" },
  { value: 'lack_of_knowledge', label: "I don't understand financial stuff" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [lifeStage, setLifeStage] = useState<LifeStage | null>(null);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [painPoints, setPainPoints] = useState<PainPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const totalSteps = 3;

  const toggleGoal = (goal: FinancialGoal) => {
    setGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const togglePainPoint = (point: PainPoint) => {
    setPainPoints((prev) =>
      prev.includes(point) ? prev.filter((p) => p !== point) : [...prev, point]
    );
  };

  const canProceed = () => {
    if (step === 1) return lifeStage !== null;
    if (step === 2) return goals.length > 0;
    if (step === 3) return painPoints.length > 0;
    return false;
  };

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      setIsLoading(true);
      try {
        const response = await fetch('/api/onboarding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lifeStage,
            goals,
            painPoints,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to save onboarding data');
        }

        router.push('/dashboard');
      } catch (error) {
        console.error('Onboarding error:', error);
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="animate-fade-in">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-text-secondary">Step {step} of {totalSteps}</span>
          <span className="text-sm text-text-secondary">{Math.round((step / totalSteps) * 100)}% complete</span>
        </div>
        <div className="h-2 bg-surface-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-green transition-all duration-500"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Life Stage */}
      {step === 1 && (
        <div>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-text-primary mb-2">Where are you in life?</h1>
            <p className="text-text-secondary">
              This helps us personalize your financial tasks
            </p>
          </div>

          <div className="grid gap-3">
            {LIFE_STAGES.map((stage) => (
              <Card
                key={stage.value}
                hover
                padding="md"
                className={`cursor-pointer transition-all ${
                  lifeStage === stage.value
                    ? 'border-brand-green ring-2 ring-brand-green/20'
                    : ''
                }`}
                onClick={() => setLifeStage(stage.value)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-text-primary">{stage.label}</p>
                    <p className="text-sm text-text-secondary">{stage.description}</p>
                  </div>
                  {lifeStage === stage.value && (
                    <div className="w-6 h-6 bg-brand-green rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Goals */}
      {step === 2 && (
        <div>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-text-primary mb-2">What are your goals?</h1>
            <p className="text-text-secondary">
              Select all that apply
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {FINANCIAL_GOALS.map((goal) => (
              <Card
                key={goal.value}
                hover
                padding="md"
                className={`cursor-pointer transition-all ${
                  goals.includes(goal.value)
                    ? 'border-brand-green ring-2 ring-brand-green/20'
                    : ''
                }`}
                onClick={() => toggleGoal(goal.value)}
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-text-primary text-sm">{goal.label}</p>
                  {goals.includes(goal.value) && (
                    <div className="w-5 h-5 bg-brand-green rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Pain Points */}
      {step === 3 && (
        <div>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-text-primary mb-2">What&apos;s holding you back?</h1>
            <p className="text-text-secondary">
              We&apos;ll help you overcome these challenges
            </p>
          </div>

          <div className="grid gap-3">
            {PAIN_POINTS.map((point) => (
              <Card
                key={point.value}
                hover
                padding="md"
                className={`cursor-pointer transition-all ${
                  painPoints.includes(point.value)
                    ? 'border-brand-green ring-2 ring-brand-green/20'
                    : ''
                }`}
                onClick={() => togglePainPoint(point.value)}
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-text-primary">{point.label}</p>
                  {painPoints.includes(point.value) && (
                    <div className="w-6 h-6 bg-brand-green rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-8">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={step === 1}
          className={step === 1 ? 'invisible' : ''}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          isLoading={isLoading}
        >
          {step === totalSteps ? (
            <>
              <Sparkles className="w-4 h-4" />
              Create My Plan
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
