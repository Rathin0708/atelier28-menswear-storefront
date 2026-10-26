import { useState } from 'react'
import { CloseButton } from '@/components/ui/Controls'
import { Overlay } from '@/components/ui/Overlay'
import { sizeChartFor } from '@/data/sizeGuide'
import { useUI } from '@/store/ui'
import type { CategorySlug } from '@/types'

export function SizeChart({ category }: { category?: CategorySlug }) {
  const [unit, setUnit] = useState<'cm' | 'in'>('cm')
  const charts = sizeChartFor(category)
  const conv = (cm: number) => (unit === 'cm' ? String(cm) : (cm / 2.54).toFixed(1))
  return (
    <div>
      <div role="group" aria-label="Measurement unit" className="mb-6 inline-flex border border-line">
        {(['cm', 'in'] as const).map((u) => (
          <button key={u} type="button" aria-pressed={unit === u} onClick={() => setUnit(u)} className={`label min-h-11 min-w-16 px-4 ${unit === u ? 'bg-ink text-bone' : ''}`}>
            {u === 'cm' ? 'cm' : 'inches'}
          </button>
        ))}
      </div>
      {charts.length === 0 && <p className="text-stone">Accessories are sized as listed on the product page.</p>}
      {charts.map((c) => (
        <div key={c.title} className="mb-8 overflow-x-auto">
          <table className="w-full min-w-[320px] text-left text-sm">
            <caption className="label pb-3 text-left">{c.title}</caption>
            <thead>
              <tr className="hairline-b label text-stone">
                <th scope="col" className="py-2 pr-4 font-medium">Size</th>
                {c.columns.map((col) => (
                  <th key={col} scope="col" className="py-2 pr-4 font-medium">{col} ({unit})</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {c.rows.map((r) => (
                <tr key={r.size} className="hairline-b">
                  <th scope="row" className="py-3 pr-4 font-medium">{r.size}</th>
                  {r.cm.map((v, i) => (
                    <td key={i} className="num py-3 pr-4">{conv(v)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      <p className="text-sm text-stone">Measurements are of the garment, laid flat. Between sizes? Size up for a relaxed fit, down for a closer one.</p>
    </div>
  )
}

export function SizeGuideModal() {
  const { overlay, closeOverlay } = useUI()
  const open = overlay?.name === 'sizeguide'
  const category = overlay?.payload as CategorySlug | undefined
  return (
    <Overlay open={open} onClose={() => closeOverlay('sizeguide')} label="Size guide" variant="modal" maxWidth="640px">
      <div className="flex items-center justify-between pl-6">
        <h2 className="display display-md">Size guide</h2>
        <CloseButton onClick={() => closeOverlay('sizeguide')} className="m-2" />
      </div>
      <div className="overflow-y-auto p-6 pt-4">
        <SizeChart category={category} />
      </div>
    </Overlay>
  )
}
