import { Calculator, Dumbbell, Hourglass, ListCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <>
        <div
            className="hero h-[75vh] rounded-md"
            style={{
                backgroundImage: "url(imgs/hero.jpg)",
            }}>
        <div className="hero-overlay bg-opacity-75 rounded-lg"></div>
            <div className="hero-content text-neutral-content text-center">
                <div className="max-w-xl">
                    <h1 className="mb-5 text-3xl">
                        Empower Your Fitness Journey with TeleFit
                    </h1>
                    <p className="mb-5">
                        Unlock personalized health insights and achieve your goals with AI-driven fitness solutions
                    </p>
                    <button className="px-3 py-2 border rounded-md text-sm">
                        Learn more
                    </button>
                </div>
            </div>
        </div>

        <div className="h-[75vh] border mt-10 rounded-md">
            <iframe 
                src="https://www.youtube.com/embed/w_g1i6tzNGk?si=B2cxb0fMud6IsDcO"
                className="w-full h-full"
            />
        </div>


        <h2 className="text-center text-2xl mt-10 mb-5">
            Check out our useful tools
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:gap-5 gap-2 mb-20">
            <Link to="/bmi" className="p-5 bg-gray-50/75 border h-fit rounded-md hover:bg-blue-50 cursor-pointer">
                <Calculator/>
                <h1 className="text-lg font-semibold mt-3">BMI Calculator</h1>
                <p className="text-sm">Calculate your BMI</p>
            </Link>

            <div className="p-5 bg-gray-50/75 border h-fit rounded-md hover:bg-blue-50 cursor-pointer">
                <Dumbbell/>
                <h1 className="text-lg font-semibold mt-3">Workout Routines</h1>
                <p className="text-sm">Update this???</p>
            </div>

            <div className="p-5 bg-gray-50/75 border h-fit rounded-md hover:bg-blue-50 cursor-pointer">
                <ListCheck/>
                <h1 className="text-lg font-semibold mt-3">Calorie Counter</h1>
                <p className="text-sm">Calculate your calorie intake</p>
            </div>

            <div className="p-5 bg-gray-50/75 border h-fit rounded-md hover:bg-blue-50 cursor-pointer">
                <Hourglass/>
                <h1 className="text-lg font-semibold mt-3">Progress</h1>
                <p className="text-sm">Update this???</p>
            </div>
        </div>

    </>
  )
}
