import { ImageUp } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useCreateUserMutation } from "../authApi";
import { useSelector } from "react-redux";
import { RootState } from "../../../../app/store";
import { Navigate } from "react-router-dom";

function LoginForm() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { sessionId } = useSelector((state: RootState) => state.session);
  const [createUser, { isLoading, error, isSuccess }] = useCreateUserMutation();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      alert("Please fill in both first and last name");
      return;
    }
    try {
      const userData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        sessionId: sessionId ?? "",
        profilePicture,
      };
      await createUser(userData).unwrap();
    } catch (err) {
      console.error("Failed to create user:", err);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (isAuthenticated) {
    return <Navigate to={`/user/${sessionId}/team-formation`} replace />;
  }

  return (
    <div className="relative flex justify-center items-center w-full p-4">
      <div className="flex-1 bg-[#111111]/40 rounded-[24px] flex justify-center items-center shadow-[0_0_15px_1px_white]/30 p-4">
        <h1 className="absolute -top-1/4 text-[32px] font-bold font-mono text-white">
          Team Formation
        </h1>

        <form
          onSubmit={handleSubmit}
          className="w-[247px] h-[301px] flex flex-col justify-between"
        >
          <div className="flex justify-center flex-col items-center gap-2">
            <div
              className="w-[78px] h-[78px] bg-[#1E89E0] rounded-full mx-auto flex justify-center items-center cursor-pointer hover:bg-[#1E89E0]/80 transition-colors relative overflow-hidden"
              onClick={handleImageUploadClick}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profile preview"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <ImageUp size={36} color="#ffffff" />
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            <h1 className="font-bold text-[12px] text-white tracking-widest">
              Upload your Selfie
            </h1>
          </div>

          <div className="flex flex-col gap-[15px]">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your First Name"
              className="h-[40px] w-[100%] bg-[#D8FEFF]/90 rounded-[4px] pl-3 font-mono text-[12px]"
              disabled={isLoading}
              required
            />

            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your Last Name"
              className="h-[40px] w-[100%] bg-[#D8FEFF]/90 rounded-[4px] pl-3 font-mono text-[12px]"
              disabled={isLoading}
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-[100%] h-[40px] rounded-[12px] bg-[#1E89E0] text-white font-mono text-[12px] mt-3 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1E89E0]/90 transition-colors"
            >
              {isLoading ? "Creating..." : "Start"}
            </button>

            {error && (
              <p className="text-red-400 text-[10px] font-mono text-center mt-1">
                {"data" in error
                  ? (error.data as any)?.message || "Failed to create user"
                  : "Something went wrong"}
              </p>
            )}

            {isSuccess && (
              <p className="text-green-400 text-[10px] font-mono text-center mt-1">
                User created successfully!
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
