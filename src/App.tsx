import { useCallback, useMemo, useState } from "react"
import { ThemeProvider } from "./components/theme-provider"
import { ModeToggle } from "./components/mode-toggle"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card"
import { Label } from "./components/ui/label"
import { Input } from "./components/ui/input"
import { Button } from "./components/ui/button"
import { Plus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table"

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
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Card className="p-2 relative">
        <CardHeader>
          <ModeToggle />
          <CardTitle><h1 className="text-3xl">Calculate reverse percentage.</h1></CardTitle>
          <CardDescription>Calculate reverse percentage i.e calculate value before percent addition/subtraction; given value after percent addition/subtraction</CardDescription>
        </CardHeader>
        <CardContent className="space-x-2 space-y-2">
          <div className="flex gap-2">
            <div>
              <Label htmlFor="number">Number: </Label>
              <Input
                id="number"
                type="number"
                value={input}
                onChange={event => {
                  setInput(Number(event.target.value))
                  if (isResultAdded)
                    setResultAdded(false)
                }
                }
              />
            </div>
            <div>
              <Label htmlFor="percentage">%: </Label>
              <Input
                id="percentage"
                type="number"
                value={percentage}
                onChange={event => {
                  setPercentage(Number(event.target.value))
                  if (isResultAdded)
                    setResultAdded(false)
                }
                }
              />
            </div>
          </div>
          <div className="flex w-full justify-between items-center">
            {
              !!result &&
              <div className="flex gap-2 ">
                <div>
                  <Label htmlFor="originalValue" className="font-semibold">Original Val: </Label>
                  <span id="originalValue">{result?.originalNumber}</span>
                </div>
                <div>
                  <Label htmlFor="percentValue" className="font-semibold">% Val: </Label>
                  <span id="percentValue">{result?.percentageValue}</span>
                </div>
              </div>
            }
            <Button
              type="button"
              disabled={isResultAdded}
              onClick={() => {
                if (result && !isResultAdded)
                  setResults(prev => [...prev, result])
                setResultAdded(true)
              }}
              className="space-x-1 space-y-1"
            ><Plus /><span>Add to results</span></Button>
          </div>
        </CardContent>
        {results && results.length > 0 &&
          <CardFooter className="flex-col" >
            <div className="flex items-center justify-between w-full">
              <h2 className="text-xl font-semibold">Results</h2>
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  setResults([])
                  setResultAdded(false)
                }
                }
              >Clear results</Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-4/12">Original Number</TableHead>
                  <TableHead className="w-3/12">% Value</TableHead>
                  <TableHead className="w-1/12">%</TableHead>
                  <TableHead className="w-4/12">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                  results.map((result, index) => (
                    <TableRow key={`${result.originalNumber}_${index}`}>
                      <TableCell>{result.originalNumber}</TableCell>
                      <TableCell>{result.percentageValue}</TableCell>
                      <TableCell>{result.percentage}</TableCell>
                      <TableCell>{result.originalNumber + result.percentageValue}</TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
            {
              !!grandTotal &&
              <div className="flex items-center justify-between gap-2 w-full">
                <div>
                  <Label htmlFor="totalOriginalValue" className="font-semibold">∑ Original Val: </Label>
                  <span id="totalOriginalValue">{grandTotal?.originalValueTotal}</span>
                </div>
                <div>
                  <Label htmlFor="totalPercentValue" className="font-semibold">∑ % Val: </Label>
                  <span id="totalPercentValue">{grandTotal?.totalPercentageValue}</span>
                </div>
                <div>
                  <Label htmlFor="grandTotal" className="font-semibold">∑ : </Label>
                  <span id="grandTotal">{grandTotal?.total}</span>
                </div>
              </div>
            }
          </CardFooter>
        }
      </Card>
    </ThemeProvider>
  )
}

export default App
