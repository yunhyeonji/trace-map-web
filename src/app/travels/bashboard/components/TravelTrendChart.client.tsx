'use client';

import { Line, LineChart, ResponsiveContainer,Tooltip, XAxis, YAxis } from 'recharts';

type Props = {
  data: { month: number; count: number }[];
};

export default function TravelTrendChart({ data }: Props) {
  return (
    <div className="h-60 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
          <XAxis dataKey="month" tickFormatter={(m) => `${m}월`} interval={0} />
          <YAxis allowDecimals={false} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;

              return (
                <div className="bg-background rounded-md border px-3 py-2 text-sm shadow">
                  {label}월에 {payload[0].value}번 여행했어요 ✈️
                </div>
              );
            }}
          />

          <Line
            type="monotone"
            dataKey="count"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
