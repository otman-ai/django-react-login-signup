export default function MainButton({ type, label, onClick, IsClicked, disabled }) {
    return (<button
        disabled={disabled}
        onClick={onClick ? () => onClickonClick():null}
        type={type}
        className="flex space-x-1 text-white font-normal bg-primary px-5 py-3 rounded-lg hover:text-black"              >
        {IsClicked ? <div className="spinner"></div> : null}
        <p>{label}</p>
    </button>)
}

export  function SecondButton({  label, onClick }) {
    return (<button className="text-transparent-black font-normal hover:text-color_3 items-center flex justify-center h-full" onClick={() => onClick()} >
        {label}</button>)
}