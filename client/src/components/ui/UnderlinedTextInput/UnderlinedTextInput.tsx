import { TextField } from "@mui/material";
import "./UnderlinedTextInput.css"

interface UnderlinedTextInputProps {
  value: string;
  name: string;
  isMandatory?: boolean;
  handleChange: () => (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const UnderlinedTextInput: React.FC<UnderlinedTextInputProps> = ({
  name,
  value,
  isMandatory,
  handleChange,
}) => {
  const placeholder =
    name.charAt(0).toUpperCase() + name.slice(1) + (isMandatory ? "*" : "");
  const fieldName = name.toLowerCase().replace(" ", "_");
  
  return (
    <TextField
      id={name}
      name={fieldName}
      className={`${isMandatory?"":"not-mandate"}`}
      variant="standard"
      placeholder={placeholder}
      value={value}
      onChange={handleChange()}
      sx={{width:"100%"}}
    />
  );
};

export default UnderlinedTextInput;
