export  function WarningM({message}){
    return (<p className="text-lg text-warning">{message}</p>)
}

export function ErrorM({message}){
    return (<p className="text-lg text-error">{message}</p>)
}

export default function SuccessM({message}){
    return (<p className="text-lg text-success">{message}</p>)
}