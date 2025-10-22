"use client"

import { useState } from "react"

export default function ComponentsShowcase() {
  const [email, setEmail] = useState("")
  const [checkboxValues, setCheckboxValues] = useState<string[]>([])
  const [radioValue, setRadioValue] = useState("")
  const [interests, setInterests] = useState<string[]>([])
  const [toggle1, setToggle1] = useState(false)
  const [toggle2, setToggle2] = useState(true)
  const [sliderValue, setSliderValue] = useState(25)
  const [ageRange, setAgeRange] = useState(30)
  const [selectValue, setSelectValue] = useState("")

  return (
    <main className="min-h-screen bg-background p-6 md:p-12">
      <div className="mx-auto max-w-4xl space-y-12">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-balance">UI Components Showcase</h1>
          <p className="text-lg text-muted-foreground text-pretty">
            Componentes reutilizáveis inspirados em design moderno de apps
          </p>
        </div>
      </div>
    </main>
  )
}
