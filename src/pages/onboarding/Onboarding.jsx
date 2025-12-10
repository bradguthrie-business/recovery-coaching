import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "../../firebase/auth";
import { RECOVERY_PATHS } from "../../constants/recovery";
import { toast } from "react-toastify";
import { getUserData, saveUserRecoveryPath } from "../../services/services";

const Onboarding = () => {
  const { state } = useLocation();
  const [selectedPath, setSelectedPath] = useState(state?.recoveryPath);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    const loadExisting = async () => {
      if (!user) {
        setInitializing(false);
        return;
      }
      try {
        const existing = await getUserData({ userId: user.uid });
        if (existing?.recoveryPath) {
          setSelectedPath(existing.recoveryPath);
        }
      } catch (error) {
        console.warn("Unable to load existing recovery path", error);
      } finally {
        setInitializing(false);
      }
    };

    loadExisting();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPath) return;

    setLoading(true);
    const user = getCurrentUser();

    try {
      // Save user's recovery path to DynamoDB via Lambda
      await saveUserRecoveryPath({
        userId: user.uid,
        email: user.email,
        recoveryPath: selectedPath,
        createdAt: new Date().toISOString(),
      });

      navigate("/dashboard");
    } catch (error) {
      toast.error("We could not save your path right now, please try again.");
      console.error("Error saving recovery path:", error);
      // Still navigate to dashboard even if Lambda call fails
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Recovery Path
          </h1>
          <p className="text-xl text-gray-600">
            Choose your preferred type of recovery to get the best support for
            your journey.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {RECOVERY_PATHS.map((path) => {
              const Icon = path.icon;
              const isSelected = selectedPath === path.id;

              return (
                <button
                  key={path.id}
                  type="button"
                  onClick={() => setSelectedPath(path.id)}
                  className={`
                    card p-6 text-left transition-all duration-200 cursor-pointer
                    ${
                      isSelected
                        ? "ring-2 ring-recovery-DEFAULT shadow-lg transform scale-105"
                        : "hover:shadow-lg hover:scale-[1.02]"
                    }
                  `}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`${path.color} p-3 rounded-lg text-white`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {path.label}
                      </h3>
                    </div>
                    {isSelected && (
                      <div className="text-recovery-DEFAULT">
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={!selectedPath || loading || initializing}
              className={`
                btn-primary text-lg px-8 py-3
                ${!selectedPath || loading || initializing ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              {loading ? "Setting up your journey..." : "Continue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
