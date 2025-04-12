import { useEffect } from "react";

export default function NotFound() {
  useEffect(()=>{
    document.title = '404, Page not Found';
  },[])
    return (
      <>
        <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
          <div className="text-center">
            <p className="text-base font-semibold text-primary">404</p>
            <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-5xl">Page not found</h2>
            <p className="mt-6 text-base leading-7 text-gray-600">The page you are looking for does not exist.</p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="/"
                className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-edit_color_2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Go back home
              </a>
            </div>
          </div>
        </main>
      </>
    )
  }
  