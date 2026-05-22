import React, { useState, useEffect, useMemo } from "react";
import { Popover, PopoverContent, PopoverAnchor } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

function parseTimeString(val: string) {
  const normalized = (val || "").trim().replace(/\s+/g, " ").toUpperCase();
  
  const defaultStart = { hour: "10", minute: "00", amPm: "AM" as const };
  const defaultEnd = { hour: "08", minute: "00", amPm: "PM" as const };
  
  if (!normalized) {
    return {
      isRange: true,
      start: defaultStart,
      end: defaultEnd
    };
  }
  
  const parts = normalized.split(/\s*[-–—]|\s+TO\s+/);
  
  const parsePart = (part: string, fallback: typeof defaultStart) => {
    const isPm = part.includes("PM");
    const isAm = part.includes("AM");
    const amPm = isPm ? ("PM" as const) : isAm ? ("AM" as const) : fallback.amPm;
    
    // Extract numbers
    const match = part.match(/(\d+)(?::(\d+))?/);
    if (match) {
      let hour = parseInt(match[1], 10);
      let minute = match[2] ? parseInt(match[2], 10) : 0;
      
      // Keep within bounds
      if (hour < 1 || hour > 12) hour = parseInt(fallback.hour, 10);
      if (minute < 0 || minute > 59) minute = 0;
      
      return {
        hour: hour.toString(),
        minute: minute.toString().padStart(2, "0"),
        amPm
      };
    }
    return fallback;
  };
  
  if (parts.length >= 2) {
    return {
      isRange: true,
      start: parsePart(parts[0], defaultStart),
      end: parsePart(parts[1], defaultEnd)
    };
  } else {
    // Single time
    return {
      isRange: false,
      start: parsePart(normalized, defaultStart),
      end: defaultEnd
    };
  }
}

export function TimePicker({ value, onChange, placeholder = "e.g. 10:00 AM - 8:00 PM", className }: TimePickerProps) {
  const [open, setOpen] = useState(false);
  
  const parsed = useMemo(() => parseTimeString(value), [value]);

  const [isRange, setIsRange] = useState(true);
  const [startHour, setStartHour] = useState("10");
  const [startMinute, setStartMinute] = useState("00");
  const [startAmPm, setStartAmPm] = useState<"AM" | "PM">("AM");
  
  const [endHour, setEndHour] = useState("08");
  const [endMinute, setEndMinute] = useState("00");
  const [endAmPm, setEndAmPm] = useState<"AM" | "PM">("PM");

  // Keep state in sync with parsed prop value when popover opens or value changes
  useEffect(() => {
    setIsRange(parsed.isRange);
    setStartHour(parsed.start.hour);
    setStartMinute(parsed.start.minute);
    setStartAmPm(parsed.start.amPm);
    setEndHour(parsed.end.hour);
    setEndMinute(parsed.end.minute);
    setEndAmPm(parsed.end.amPm);
  }, [parsed, open]);

  const handleApply = () => {
    const startStr = `${startHour.padStart(2, "0")}:${startMinute} ${startAmPm}`;
    let finalValue = startStr;
    
    if (isRange) {
      const endStr = `${endHour.padStart(2, "0")}:${endMinute} ${endAmPm}`;
      finalValue = `${startStr} - ${endStr}`;
    }
    
    onChange(finalValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className="relative flex items-center w-full">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={cn("pr-10", className)}
            onClick={() => setOpen(true)}
            onFocus={() => setOpen(true)}
          />
          <button
            type="button"
            className="absolute right-3 p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 active:scale-95 transition-all"
            title="Open time picker"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((prev) => !prev);
            }}
          >
            <Clock className="h-4 w-4" />
          </button>
        </div>
      </PopoverAnchor>
      
      <PopoverContent 
        className="w-80 p-4 bg-background/95 backdrop-blur-md border border-border/50 rounded-2xl shadow-xl z-[100]" 
        align="start"
        side="bottom"
        sideOffset={8}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-display font-bold text-sm text-foreground">Select Event Time</h4>
          </div>
          
          {/* Range vs Single toggle */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-muted/30 rounded-xl border border-border/40">
            <button
              type="button"
              onClick={() => setIsRange(false)}
              className={cn(
                "py-1.5 text-xs font-bold rounded-lg transition-all",
                !isRange 
                  ? "bg-background text-foreground shadow-sm border border-border/30 font-black" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Single Time
            </button>
            <button
              type="button"
              onClick={() => setIsRange(true)}
              className={cn(
                "py-1.5 text-xs font-bold rounded-lg transition-all",
                isRange 
                  ? "bg-background text-foreground shadow-sm border border-border/30 font-black" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Time Range
            </button>
          </div>

          <div className="space-y-4">
            {/* Start Time Section */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                {isRange ? "Start Time" : "Time"}
              </span>
              <div className="flex items-center gap-2">
                <Select value={startHour} onValueChange={setStartHour}>
                  <SelectTrigger className="w-20 h-10 rounded-xl border-border/50 bg-muted/5 font-bold">
                    <SelectValue placeholder="Hour" />
                  </SelectTrigger>
                  <SelectContent className="border-border/50 z-[110]">
                    {Array.from({ length: 12 }, (_, i) => (i + 1).toString()).map((h) => (
                      <SelectItem key={h} value={h}>
                        {h.padStart(2, "0")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <span className="font-bold text-muted-foreground">:</span>

                <Select value={startMinute} onValueChange={setStartMinute}>
                  <SelectTrigger className="w-20 h-10 rounded-xl border-border/50 bg-muted/5 font-bold">
                    <SelectValue placeholder="Min" />
                  </SelectTrigger>
                  <SelectContent className="border-border/50 z-[110]">
                    {Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, "0")).map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-center rounded-xl border border-border/50 bg-muted/5 p-1 h-10 ml-auto">
                  <button
                    type="button"
                    onClick={() => setStartAmPm("AM")}
                    className={cn(
                      "px-3 h-full text-xs font-black rounded-lg transition-all",
                      startAmPm === "AM" 
                        ? "bg-primary text-primary-foreground shadow-glow" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    AM
                  </button>
                  <button
                    type="button"
                    onClick={() => setStartAmPm("PM")}
                    className={cn(
                      "px-3 h-full text-xs font-black rounded-lg transition-all",
                      startAmPm === "PM" 
                        ? "bg-primary text-primary-foreground shadow-glow" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    PM
                  </button>
                </div>
              </div>
            </div>

            {/* End Time Section (Range mode only) */}
            {isRange && (
              <div className="space-y-2 pt-3 border-t border-border/20">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  End Time
                </span>
                <div className="flex items-center gap-2">
                  <Select value={endHour} onValueChange={setEndHour}>
                    <SelectTrigger className="w-20 h-10 rounded-xl border-border/50 bg-muted/5 font-bold">
                      <SelectValue placeholder="Hour" />
                    </SelectTrigger>
                    <SelectContent className="border-border/50 z-[110]">
                      {Array.from({ length: 12 }, (_, i) => (i + 1).toString()).map((h) => (
                        <SelectItem key={h} value={h}>
                          {h.padStart(2, "0")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <span className="font-bold text-muted-foreground">:</span>

                  <Select value={endMinute} onValueChange={setEndMinute}>
                    <SelectTrigger className="w-20 h-10 rounded-xl border-border/50 bg-muted/5 font-bold">
                      <SelectValue placeholder="Min" />
                    </SelectTrigger>
                    <SelectContent className="border-border/50 z-[110]">
                      {Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, "0")).map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex items-center rounded-xl border border-border/50 bg-muted/5 p-1 h-10 ml-auto">
                    <button
                      type="button"
                      onClick={() => setEndAmPm("AM")}
                      className={cn(
                        "px-3 h-full text-xs font-black rounded-lg transition-all",
                        endAmPm === "AM" 
                          ? "bg-primary text-primary-foreground shadow-glow" 
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      AM
                    </button>
                    <button
                      type="button"
                      onClick={() => setEndAmPm("PM")}
                      className={cn(
                        "px-3 h-full text-xs font-black rounded-lg transition-all",
                        endAmPm === "PM" 
                          ? "bg-primary text-primary-foreground shadow-glow" 
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      PM
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Button
            type="button"
            onClick={handleApply}
            className="w-full mt-4 h-11 bg-brand-gradient text-xs font-bold uppercase tracking-widest text-white rounded-xl shadow-glow transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            Apply Time
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
