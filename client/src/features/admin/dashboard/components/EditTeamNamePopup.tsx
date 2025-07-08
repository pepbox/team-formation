import { useState } from "react";
import { useChangeTeamNameMutation } from "../dashboardApi";

interface EditTeamNamePopupProps {
  isOpen: boolean;
  teamId: string;
  onClose: () => void;
}

const EditTeamNamePopup: React.FC<EditTeamNamePopupProps> = ({
  isOpen,
  teamId,
  onClose,
}) => {
  const [changeTeamName] = useChangeTeamNameMutation();
  const [teamName, setTeamname] = useState("");

  const handleChangeTeamname = () => {
    if (!teamName.trim()) {
      alert("Team name cannot be empty");
      return;
    }
    changeTeamName({ teamName, teamId })
      .unwrap()
      .then(() => onClose());
  };
  if (!isOpen || !teamId) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Edit Team Name</h2>
        <form>
          <div className="mb-4">
            <label
              htmlFor="teamName"
              className="block text-sm font-medium mb-2"
            >
              New Team Name
            </label>
            <input
              type="text"
              id="teamName"
              value={teamName}
              onChange={(e) => setTeamname(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter new team name"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleChangeTeamname}
              className="bg-black rounded-lg text-white px-4 py-2 mr-2"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border-1 cursor-pointer border-black"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTeamNamePopup;
