"use client"

import * as React from "react"

import { themeRecipeCode } from "@/lib/examples"
import { cn } from "@/lib/utils"
import { AudioPlayer } from "@/components/ui/audio-player"
import { CodeBlock } from "@/components/site/code-block"
import { Demo } from "@/components/site/demo"
import { recipeCode, recipeStage } from "@/components/site/recipe-card"
import { Segmented } from "@/components/site/segmented"

type Choice = "app" | "light" | "dark"

const choices = [
  { value: "app", label: "App theme" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
] as const satisfies readonly { value: Choice; label: string }[]

/**
 * The theme recipe's card. A switch on the stage sets the wrapper's theme
 * class, and the code below follows it, so the two always match.
 */
export function ThemeRecipe() {
  const [theme, setTheme] = React.useState<Choice>("light")

  return (
    <>
      <Demo className={cn("flex-col gap-6", recipeStage)}>
        <Segmented label="Player theme" options={choices} value={theme} onChange={setTheme} />

        {/* the wrapper scopes the tokens, as the code below shows */}
        <div className={cn("w-full max-w-md", theme !== "app" && theme)}>
          <AudioPlayer src="/media/track.mp3" title="Morning Drift" description="Demo track" />
        </div>
      </Demo>
      <CodeBlock code={themeRecipeCode(theme)} className={recipeCode} />
    </>
  )
}
