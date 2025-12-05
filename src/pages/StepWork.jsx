import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../firebase/auth';
import { BookOpen, ArrowLeft, Save, CheckCircle, Circle } from 'lucide-react';
import { RECOVERY_LABELS, STEP_PROMPTS } from '../constants/recovery';
import { toast } from 'react-toastify';
import { getUserData, getStepWork, saveStepWork } from '../services/services';

const StepWork = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [userData, setUserData] = useState(null);
  const [selectedStep, setSelectedStep] = useState(null);
  const [stepWork, setStepWork] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const data = await getUserData({ userId: user.uid });
        setUserData(data);

        const stepData = await getStepWork({ userId: user.uid });
        if (stepData && stepData.stepWork) {
          setStepWork(stepData.stepWork);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const recoveryPath = userData?.recoveryPath || 'aa';
  const steps = STEP_PROMPTS[recoveryPath] || STEP_PROMPTS.aa;

  const handleStepSelect = (step) => {
    setSelectedStep(step);
    if (!stepWork[step.step]) {
      setStepWork({
        ...stepWork,
        [step.step]: {
          prompt: step.prompt,
          response: '',
          completed: false,
          date: new Date().toISOString()
        }
      });
    }
  };

  const handleSave = async () => {
    if (!user || !selectedStep) return;

    setSaving(true);
    try {
      await saveStepWork({
        userId: user.uid,
        step: selectedStep.step,
        stepWork: stepWork[selectedStep.step]
      });
      toast.success('Step work saved successfully');
    } catch (error) {
      console.error('Error saving step work:', error);
      toast.error('Error saving step work. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const toggleComplete = (stepNum) => {
    setStepWork({
      ...stepWork,
      [stepNum]: {
        ...stepWork[stepNum],
        completed: !stepWork[stepNum]?.completed
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-recovery-DEFAULT"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Steps List */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <BookOpen className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Step Work</h1>
                  <p className="text-sm text-gray-600">
                    {RECOVERY_LABELS[recoveryPath] || 'Recovery Path'}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {steps.map((step) => {
                  const isCompleted = stepWork[step.step]?.completed;
                  const isSelected = selectedStep?.step === step.step;

                  return (
                    <button
                      key={step.step}
                      onClick={() => handleStepSelect(step)}
                      className={`
                        w-full text-left p-4 rounded-lg border-2 transition-all
                        ${isSelected
                          ? 'border-recovery-DEFAULT bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }
                        ${isCompleted ? 'bg-green-50' : ''}
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400" />
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">{step.title}</p>
                            <p className="text-xs text-gray-600 line-clamp-2">{step.prompt}</p>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Step Work Editor */}
          <div className="lg:col-span-2">
            {selectedStep ? (
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedStep.title}</h2>
                    <p className="text-gray-600 mt-1">{selectedStep.prompt}</p>
                  </div>
                  <button
                    onClick={() => toggleComplete(selectedStep.step)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                      ${stepWork[selectedStep.step]?.completed
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {stepWork[selectedStep.step]?.completed ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Completed
                      </>
                    ) : (
                      <>
                        <Circle className="w-5 h-5" />
                        Mark Complete
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Response
                    </label>
                    <textarea
                      value={stepWork[selectedStep.step]?.response || ''}
                      onChange={(e) => {
                        setStepWork({
                          ...stepWork,
                          [selectedStep.step]: {
                            ...stepWork[selectedStep.step],
                            response: e.target.value,
                            prompt: selectedStep.prompt,
                            date: new Date().toISOString()
                          }
                        });
                      }}
                      className="input-field min-h-[300px]"
                      placeholder="Reflect on this step and write your response..."
                    />
                  </div>

                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full btn-primary flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {saving ? 'Saving...' : 'Save Step Work'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="card">
                <p className="text-gray-600 text-center py-12">
                  Select a step from the list to begin your step work.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepWork;

