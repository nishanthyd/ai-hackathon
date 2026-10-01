export const isMobileWidth = () => window.innerWidth <= 768

export const clampValue = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

export const getSectionOffset = (element: HTMLElement) => {
  return element.getBoundingClientRect().top + window.scrollY
}
