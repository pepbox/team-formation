import { useState } from "react";
import OTPInput from "../../../../components/ui/OTPInput";
import { useSelector } from "react-redux";
import { RootState } from "../../../../app/store";
import { useLoginAdminMutation } from "../adminAuthApi";
import { Navigate } from "react-router-dom";
import useAdminSessionNavigate from "../../../../hooks/useAdminNavigate";

const AdminLoginForm = () => {
  const [pin, setPin] = useState("");
  const { isAuthenticated } = useSelector(
    (state: RootState) => state.adminAuth
  );
  const { adminSessionBasePath } = useAdminSessionNavigate();
  const { sessionId } = useSelector((state: RootState) => state.session);
  const [loginAdmin, { isLoading, error }] = useLoginAdminMutation();

  const handlePinChange = (value: string) => {
    setPin(value);
  };

  const handlePinComplete = (completedPin: string) => {
    console.log("PIN completed:", completedPin);
  };

  const handleLogin = async () => {
    if (pin.length !== 4) {
      alert("Please enter a 4-digit PIN");
      return;
    }
    loginAdmin({ password: pin, sessionId: sessionId });
  };

  if (isAuthenticated) {
    return <Navigate to={`${adminSessionBasePath}/dashboard`} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-4xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Admin Login
        </h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
            Enter 4-digit PIN
          </label>

          <OTPInput
            length={4}
            value={pin}
            onChange={handlePinChange}
            onComplete={handlePinComplete}
            autoFocus={true}
            disabled={isLoading}
            className="mb-4"
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={isLoading || pin.length !== 4}
          className="w-full bg-[#111111] text-white py-3 px-4 rounded-2xl font-medium cursor-pointer transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
        {error && (
          <div className="mt-4 text-red-600 text-center">
            {"data" in error
              ? (error.data as any)?.message ||
                "Login failed. Please try again."
              : ("error" in error ? error.error : error.message) ||
                "Login failed. Please try again."}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLoginForm;
