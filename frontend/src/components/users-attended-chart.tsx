import { Bar, BarChart, Cell, Tooltip, XAxis, YAxis } from 'recharts'
import type { ChartConfig } from '@/components/ui/chart'
import { ChartContainer } from '@/components/ui/chart'

const chartData = [
  { month: 'Janeiro', quantity: 8 },
  { month: 'Fevereiro', quantity: 12 },
  { month: 'Março', quantity: 15 },
  { month: 'Abril', quantity: 10 },
  { month: 'Maio', quantity: 18 },
  { month: 'Junho', quantity: 13 },
  { month: 'Julho', quantity: 11 },
  { month: 'Agosto', quantity: 14 },
  { month: 'Setembro', quantity: 17 },
  { month: 'Outubro', quantity: 16 },
  { month: 'Novembro', quantity: 19 },
  { month: 'Dezembro', quantity: 20 },
]

export function UsersAttendedChart() {
  const maxValue = Math.max(...chartData.map((item) => item.quantity))

  const chartConfig = {
    quantity: {
      label: 'Quantidade',
      color: '#2563eb',
    },
  } satisfies ChartConfig

  return (
    <ChartContainer
      config={chartConfig}
      className="min-h-[180px] sm:min-h-[200px] w-full"
      data-qa="users-attended-chart"
    >
      <BarChart
        accessibilityLayer
        data={chartData}
        margin={{ top: 20, right: 5, bottom: 5, left: 5 }}
      >
        <Tooltip />
        <YAxis
          tickLine={false}
          tickMargin={8}
          axisLine={false}
          width={30}
          label={{
            value: 'Quant.',
            position: 'top',
            offset: 5,
            className: 'text-[10px] sm:text-xs font-semibold text-950',
          }}
        />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={8}
          axisLine={false}
          tickFormatter={(value: string) => value.slice(0, 3)}
          angle={-45}
          textAnchor="end"
          height={60}
          tick={{ fontSize: 10 }}
        />
        <Bar dataKey="quantity" fill="var(--color-quantity)" radius={1}>
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                entry.quantity === maxValue
                  ? '#00A91C'
                  : 'var(--color-quantity)'
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
