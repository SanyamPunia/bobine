import { docPages, sections } from "@/lib/docs"
import { audioRecipes, examplesIntro, examplesSections, videoRecipes } from "@/lib/examples"

export type SearchItem = {
  group: "Pages" | "Sections" | "Links"
  title: string
  /** the muted line under the title */
  hint: string
  href: string
  /** extra words cmdk matches on, beyond the title */
  keywords: string[]
  external?: boolean
}

/**
 * Everything the command menu can jump to. Built on the server from the docs
 * data and passed down as plain items, so the client never loads the docs copy
 * itself. A new page or section in lib/docs.ts shows up here with no change.
 */
export function searchItems(): SearchItem[] {
  const pages: SearchItem[] = docPages.map((page) => ({
    group: "Pages",
    title: page.title,
    hint: page.description,
    href: page.href,
    // title only: a page description names every topic on the page, so it
    // would outrank the section the reader actually typed
    keywords: [],
  }))

  const sectionItems: SearchItem[] = docPages.flatMap((page) =>
    page.sections.map((id) => ({
      group: "Sections" as const,
      title: sections[id].title,
      hint: page.title,
      href: `${page.href}#${id}`,
      keywords: [sections[id].description, page.title],
    }))
  )

  const examplesPage: SearchItem = {
    group: "Pages",
    title: examplesIntro.title,
    hint: examplesIntro.description,
    href: "/examples",
    keywords: [],
  }

  /* the examples page's sections, then each recipe on it */
  const exampleItems: SearchItem[] = [
    ...Object.values(examplesSections).map((section) => ({
      group: "Sections" as const,
      title: section.title,
      hint: examplesIntro.title,
      href: `/examples#${section.id}`,
      keywords: [section.description, examplesIntro.title],
    })),
    ...[...Object.values(videoRecipes), ...Object.values(audioRecipes)].map((recipe) => ({
      group: "Sections" as const,
      title: recipe.title,
      hint: examplesIntro.title,
      href: `/examples#${recipe.id}`,
      keywords: [recipe.description, "example", "recipe"],
    })),
  ]

  const links: SearchItem[] = [
    { group: "Links", title: "Registry", hint: "registry.json", href: "/r/registry.json", keywords: ["shadcn", "install"], external: true },
    { group: "Links", title: "npm", hint: "reel-media", href: "https://www.npmjs.com/package/reel-media", keywords: ["package", "install"], external: true },
    { group: "Links", title: "GitHub", hint: "SanyamPunia/reel", href: "https://github.com/SanyamPunia/reel", keywords: ["source", "repo"], external: true },
    { group: "Links", title: "llms.txt", hint: "Docs index for agents", href: "/llms.txt", keywords: ["ai", "agent", "markdown"], external: true },
  ]

  return [...pages, examplesPage, ...sectionItems, ...exampleItems, ...links]
}
