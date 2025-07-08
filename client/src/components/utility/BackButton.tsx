import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ className }) => {
  const navigate = useNavigate();
  return (
    <button
      className={`p-2 rounded-full hover:bg-gray-200/50 ${className}`}
      onClick={() => navigate(-1)}
    >
      <ArrowLeft />
    </button>
  );
};

export default BackButton;
