import {brand, colors} from "./constants"
export function Logo({href}){
    return (
        <div className="">
            <a href={href ? href : '/'} className="">
                <img src="/logo.svg" alt={brand} className="h-10 w-32" />
            </a>
        </div>)
}
export default function Header({ href }) {
    return (
       <header className="bg-none lg:p-5 w-full flex justify-start">
            <nav >
                <Logo href={href ? href : '/'}/>
            </nav>
        </header>
    );
  }