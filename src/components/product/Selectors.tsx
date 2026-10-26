import type { ColorVariant, SizeOption } from '@/types'

interface SwatchProps {
  colors: ColorVariant[]
  value: number
  onChange: (index: number) => void
  name: string
  size?: 'sm' | 'md'
}

/** Radio-group of colour swatches; arrow keys work natively. */
export function SwatchSelector({ colors, value, onChange, name, size = 'md' }: SwatchProps) {
  const dim = size === 'sm' ? 'h-5 w-5' : 'h-8 w-8'
  return (
    <fieldset className="m-0 flex flex-wrap items-center gap-1 border-0 p-0">
      <legend className="sr-only">Colour</legend>
      {colors.map((c, i) => (
        <label key={c.name} className="relative grid h-11 w-8 cursor-pointer place-items-center" title={c.name}>
          <input
            type="radio"
            name={name}
            value={c.name}
            checked={value === i}
            onChange={() => onChange(i)}
            className="peer absolute inset-0 m-0 cursor-pointer opacity-0"
            aria-label={c.name}
          />
          <span
            aria-hidden="true"
            className={`${dim} rounded-full border border-ink/25 ring-offset-2 ring-offset-paper transition-shadow peer-checked:ring-1 peer-checked:ring-ink peer-focus-visible:ring-2 peer-focus-visible:ring-oxblood`}
            style={{ background: c.hex }}
          />
        </label>
      ))}
    </fieldset>
  )
}

interface SizeProps {
  sizes: SizeOption[]
  value: string | null
  onChange: (size: string) => void
  name: string
  invalid?: boolean
  describedBy?: string
}

export function SizeSelector({ sizes, value, onChange, name, invalid, describedBy }: SizeProps) {
  return (
    <fieldset className="m-0 border-0 p-0" aria-describedby={describedBy}>
      <legend className="sr-only">Size</legend>
      <div className="flex flex-wrap gap-2">
        {sizes.map((s) => (
          <label
            key={s.label}
            title={s.inStock ? undefined : `${s.label} — out of stock`}
            className={`relative ${s.inStock ? 'cursor-pointer' : 'cursor-not-allowed'}`}
          >
            <input
              type="radio"
              name={name}
              value={s.label}
              disabled={!s.inStock}
              checked={value === s.label}
              onChange={() => onChange(s.label)}
              className="peer absolute inset-0 m-0 opacity-0"
              aria-label={s.inStock ? s.label : `${s.label}, out of stock`}
            />
            <span
              className={`label num grid min-h-11 min-w-[52px] place-items-center border px-3 transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-bone peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-oxblood peer-disabled:text-stone-soft peer-disabled:line-through ${
                invalid ? 'border-oxblood' : 'border-line hover:border-ink'
              }`}
            >
              {s.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
