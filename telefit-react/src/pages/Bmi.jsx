import { useState } from "react"

export default function Bmi() {

  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [bmi, setBmi] = useState(0);
  const [bmiColor, setBmiColor] = useState("");

  function countBmi() {
    const calculatedBmi = ((weight / ((height / 100) * (height / 100))) * 10).toFixed(2);
    setBmi(calculatedBmi);
    if (calculatedBmi < 18) {
      setBmiColor("text-orange-400");
    } 
    else if (calculatedBmi >= 18 && calculatedBmi < 23) {
      setBmiColor("text-green-700");
    } 
    else if (calculatedBmi >= 23) {
      setBmiColor("text-red-600");
    }
  }

  useState(() => {
    setBmi(0);
  }, []);

  return (
    <>
      <h1 className="text-2xl text-center mb-5 mt-10">BMI Calculator</h1>

      <div className="border p-5 rounded-md mx-auto max-w-lg bg-gray-50">

        <div className="mb-5 flex">
            <div className="flex text-sm me-5">
                <div className="rounded-full bg-orange-400 h-3 w-3 me-2 mt-1"></div>
                Underweight ({"< 18"})
            </div>
            <div className="flex text-sm me-5">
                <div className="rounded-full bg-green-600 h-3 w-3 me-2 mt-1"></div>
                Normal ({"18 - 23"})
            </div>
            <div className="flex text-sm">
                <div className="rounded-full bg-red-600 h-3 w-3 me-2 mt-1"></div>
                Overweight ({"> 23"})
            </div>
        </div>

        <label htmlFor="height" className="text-sm">Height (cm)</label>
        <input 
            type="number" 
            className="border input-bordered py-2 px-3 rounded-md w-full block mt-1 mb-5" 
            onChange={(e) => {
                setHeight(e.target.value);
                countBmi();
            }}
        />

        <label htmlFor="weight" className="text-sm">Weight (kg)</label>
        <input 
            type="number" 
            className="border input-bordered py-2 px-3 rounded-md w-full block mt-1 mb-5" 
            onChange={(e) => {
                setWeight(e.target.value);
                countBmi();
            }}
        />

        <p className="text-center text-sm">Your BMI is:</p>
        <h2 className="text-center text-3xl font-medium">
            {bmi != "NaN" ? (
                <>
                    <span className={bmiColor}>{bmi}</span>
                </>
            ) : (
                ""
            )}
        </h2>
      </div>

    </>
  )
}
