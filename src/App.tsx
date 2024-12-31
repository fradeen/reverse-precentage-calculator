import { useCallback, useMemo, useState } from "react"

type Result = {
  originalNumber: number,
  percentage: number,
  percentageValue: number
}

type Results = Result[]

function App() {

  const [input, setInput] = useState(1000)
  const [percentage, setPercentage] = useState(10)
  const [results, setResults] = useState<Results>([])
  const round = useCallback((n: number, k: number, resolution: number): number => {
    const precision = Math.pow(10, Math.trunc(resolution))
    return Math.round(
      Math.round(((n + Number.EPSILON) * precision) / k) * k
    ) / precision
  }, [])
  const result = useMemo(() => {
    if (!input || !percentage)
      return undefined
    const originalNumber = round((input * 100 / (percentage + 100)), 1, 2)
    const percentageValue = round((originalNumber * percentage / 100), 1, 2)
    return {
      originalNumber: originalNumber,
      percentage: percentage,
      percentageValue: percentageValue
    }
  }, [input, percentage, round])
  const [isResultAdded, setResultAdded] = useState(false)
  const grandTotal = useMemo(() => {
    if (!results || results.length === 0)
      return undefined
    return results.reduce((total, result) => {
      return {
        originalValueTotal: round(total.originalValueTotal + result.originalNumber, 1, 2),
        total: round(total.total + result.originalNumber + result.percentageValue, 1, 2),
        totalPercentageValue: round(total.totalPercentageValue + result.percentageValue, 1, 2)
      }
    }, { originalValueTotal: 0, total: 0, totalPercentageValue: 0 })
  }, [results, round])
  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-semibold">Calculate reverse percentage</h1>
      <div className="flex flex-col gap-2 border-2 border-gray-500 rounded-lg p-4 items-center justify-center">
        <div className="flex gap-2">
          <div>
            <label htmlFor="number">Number: </label>
            <input
              id="number"
              type="number"
              value={input}
              onChange={event => {
                setInput(Number(event.target.value))
                if (isResultAdded)
                  setResultAdded(false)
              }
              }
              className="outline-none p-1 border-2 border-gray-500 focus:border-none rounded-lg focus:ring-2 ring-green-600 dark:bg-gray-800 dark:text-gray-300 transition-all duration-200 ease-in-out"
            />
          </div>
          <div>
            <label htmlFor="percentage">%: </label>
            <input
              id="percentage"
              type="number"
              value={percentage}
              onChange={event => {
                setPercentage(Number(event.target.value))
                if (isResultAdded)
                  setResultAdded(false)
              }
              }
              className="outline-none p-1 border-2 border-gray-500 focus:border-none rounded-lg focus:ring-2 ring-green-600 h-9 w-16 dark:bg-gray-800 dark:text-gray-300 transition-all duration-200 ease-in-out"
            />
          </div>
        </div>
        <div className="flex w-full justify-between">
          {
            !!result &&
            <div className="flex gap-2 ">
              <div>
                <label htmlFor="originalValue" className="font-semibold">original Val: </label>
                <span id="originalValue">{result?.originalNumber}</span>
              </div>
              <div>
                <label htmlFor="percentValue" className="font-semibold">% Val: </label>
                <span id="percentValue">{result?.percentageValue}</span>
              </div>
            </div>
          }
          <button
            type="button"
            disabled={isResultAdded}
            onClick={() => {
              if (result && !isResultAdded)
                setResults(prev => [...prev, result])
              setResultAdded(true)
            }}
            className="border-2 border-gray-500 rounded-lg p-1"
          >Append to results</button>
        </div>
      </div>
      <div className="flex flex-col gap-2 border-2 border-gray-500 rounded-lg p-4 items-center justify-center">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-xl font-semibold">Results</h2>
          <button
            type="button"
            onClick={() => setResults([])}
            className="border-2 border-gray-500 rounded-lg p-1"
          >Clear results</button>
        </div>
        {results && results.length > 0 &&
          <table className=" max-h-96 overflow-y-auto">
            <thead>
              <tr>
                <th>Origianl Number</th>
                <th>% Value</th>
                <th>%</th>
                <th>total</th>
              </tr>
            </thead>
            <tbody>
              {
                results.map((result, index) => (
                  <tr key={`${result.originalNumber}_${index}`}>
                    <td>{result.originalNumber}</td>
                    <td>{result.percentageValue}</td>
                    <td>{result.percentage}</td>
                    <td>{result.originalNumber + result.percentageValue}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        }
        {
          !!grandTotal &&
          <div className="flex items-center justify-between gap-2 w-full">
            <div>
              <label htmlFor="totalOriginalValue" className="font-semibold">∑ original Val: </label>
              <span id="totalOriginalValue">{grandTotal?.originalValueTotal}</span>
            </div>
            <div>
              <label htmlFor="totalPercentValue" className="font-semibold">∑ % Val: </label>
              <span id="totalPercentValue">{grandTotal?.totalPercentageValue}</span>
            </div>
            <div>
              <label htmlFor="grandTotal" className="font-semibold">∑ : </label>
              <span id="grandTotal">{grandTotal?.total}</span>
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default App
