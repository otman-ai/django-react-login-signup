import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { colors } from "./constants";


export default function InputField({ label, icon, type, name, placeholder, onChange, rightIcon }) {
    return (
      <div className="mt-3 relative">
        <FontAwesomeIcon icon={icon} color={colors["transparent-black"]} className="absolute pt-5 pl-3" />
        <label htmlFor={name}>{label}</label>

        <input
          type={type}
          placeholder={placeholder}
          required
          name={name}
          id={name}
          onChange={onChange}
          className="form-input mt-1 block w-full focus:outline-none border border-color_5 py-4 px-3 rounded-2xl pl-9 focus:border-primary"
        />
        {rightIcon && <div className="absolute right-3 top-1/2 transform -translate-y-1/2">{rightIcon}</div>}
      </div>
    );
}
  