import { Link } from "react-router-dom";

export default function Navbar() {
  return (
        <div className="navbar bg-base-100">
            <div className="flex-1">
                <Link to="/" className="text-2xl text-blue-700 font-bold">TeleFit</Link>
            </div>
            <div className="flex-none">
                <button type="button" className="bg-blue-700 px-3 py-2 rounded-md text-sm text-white me-2">
                    Login
                </button>
                <button type="button" className="bg-blue-200 px-3 py-2 rounded-md text-sm text-black">
                    Register
                </button>
            </div>
        </div>
  )
}
