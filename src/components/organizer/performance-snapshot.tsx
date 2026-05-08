import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { name: "Mon", revenue: 4000, tickets: 240 },
  { name: "Tue", revenue: 3000, tickets: 139 },
  { name: "Wed", revenue: 2000, tickets: 980 },
  { name: "Thu", revenue: 2780, tickets: 390 },
  { name: "Fri", revenue: 1890, tickets: 480 },
  { name: "Sat", revenue: 2390, tickets: 380 },
  { name: "Sun", revenue: 3490, tickets: 430 },
];

export function PerformanceSnapshot() {
  return (
    <div className="rounded-3xl border border-border/50 bg-muted/20 p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">Performance Snapshot</h2>
          <p className="text-sm text-muted-foreground">Weekly revenue and ticket sales trend</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tickets</span>
          </div>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--brand-primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--brand-primary)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} 
              dy={10}
            />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "var(--background)", 
                border: "1px solid var(--border)", 
                borderRadius: "12px",
                fontSize: "12px"
              }}
              itemStyle={{ fontWeight: "bold" }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="var(--brand-primary)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
            <Area
              type="monotone"
              dataKey="tickets"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorTickets)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
