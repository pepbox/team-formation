import { ImageUp, Camera, Upload, X } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
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
  const [showOptions, setShowOptions] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);
  const { sessionId } = useSelector((state: RootState) => state.session);
  const [createUser, { isLoading, error, isSuccess }] = useCreateUserMutation();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create preview URL for uploaded file
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreviewUrl(e.target.result as string);
          setProfilePicture(file);
          setShowOptions(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUploadClick = () => {
    setShowOptions(true);
  };

  const handleUploadFromGallery = () => {
    fileInputRef.current?.click();
  };

  const startCamera = () => {
    setShowCamera(true);
    setShowOptions(false);
  };

  const stopCamera = () => {
    setShowCamera(false);
    setCapturedImage(null);
  };

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
    }
  }, [webcamRef]);

  const confirmPhoto = async () => {
    if (!capturedImage) return;

    try {
      // Convert base64 to File object
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      const file = new File([blob], "camera-photo.jpg", {
        type: "image/jpeg",
      });

      setProfilePicture(file);
      setPreviewUrl(capturedImage);
      stopCamera();
    } catch (error) {
      console.error("Error preparing image data:", error);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
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
      if (previewUrl && previewUrl.startsWith("blob:")) {
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
              Upload/Click your Selfie
            </h1>

            {/* Options Modal */}
            {showOptions && (
              <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                <div className="bg-[#111111] rounded-[16px] p-6 flex flex-col gap-4 shadow-lg">
                  <div className="flex justify-between items-center">
                    <h2 className="text-white font-mono text-[14px] font-bold">
                      Choose Option
                    </h2>
                    <button
                      onClick={() => setShowOptions(false)}
                      className="text-white hover:text-gray-300"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <button
                    onClick={startCamera}
                    className="flex items-center gap-3 bg-[#1E89E0] text-white px-4 py-3 rounded-[8px] hover:bg-[#1E89E0]/80 transition-colors"
                  >
                    <Camera size={20} />
                    <span className="font-mono text-[12px]">Take Photo</span>
                  </button>

                  <button
                    onClick={handleUploadFromGallery}
                    className="flex items-center gap-3 bg-[#1E89E0] text-white px-4 py-3 rounded-[8px] hover:bg-[#1E89E0]/80 transition-colors"
                  >
                    <Upload size={20} />
                    <span className="font-mono text-[12px]">
                      Upload from Gallery
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Camera Modal */}
            {showCamera && (
              <div className="fixed inset-0 bg-black/90 flex justify-center items-center z-50">
                <div className="bg-[#111111] rounded-[16px] p-6 flex flex-col gap-4 shadow-lg max-w-sm w-full mx-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-white font-mono text-[14px] font-bold">
                      Take Your Selfie
                    </h2>
                    <button
                      onClick={stopCamera}
                      className="text-white hover:text-gray-300"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="relative">
                    {capturedImage ? (
                      <img
                        src={capturedImage}
                        alt="Captured"
                        className="w-full h-[300px] object-cover rounded-[12px]"
                      />
                    ) : (
                      <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        width={320}
                        height={300}
                        className="w-full h-[300px] object-cover rounded-[12px]"
                        videoConstraints={{
                          width: 640,
                          height: 480,
                          facingMode: "user",
                        }}
                      />
                    )}
                  </div>

                  {capturedImage ? (
                    <div className="flex gap-2">
                      <button
                        onClick={retakePhoto}
                        className="flex-1 bg-gray-600 text-white px-4 py-3 rounded-[12px] hover:bg-gray-700 transition-colors font-mono text-[12px]"
                      >
                        Retake
                      </button>
                      <button
                        onClick={confirmPhoto}
                        className="flex-1 bg-[#1E89E0] text-white px-4 py-3 rounded-[12px] hover:bg-[#1E89E0]/80 transition-colors font-mono text-[12px]"
                      >
                        Confirm
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={capturePhoto}
                      className="bg-[#1E89E0] text-white px-4 py-3 rounded-[12px] hover:bg-[#1E89E0]/80 transition-colors font-mono text-[12px]"
                    >
                      Capture Photo
                    </button>
                  )}
                </div>
              </div>
            )}
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
