import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Infinity } from "lucide-react";

type CapacityFieldProps = {
  unlimited: boolean;
  value: string;
  onUnlimitedChange: (unlimited: boolean) => void;
  onValueChange: (value: string) => void;
  className?: string;
};

export function CapacityField({
  unlimited,
  value,
  onUnlimitedChange,
  onValueChange,
  className,
}: CapacityFieldProps) {
  return (
    <div className={cn("space-y-3", className)}>
        <div className="flex items-center justify-between gap-4 rounded-xl border border-border/40 bg-muted/5 px-4 py-3">
          <div className="flex items-center gap-2 min-w-0">
            <Infinity className="h-4 w-4 text-primary shrink-0" />
            <div>
              <Label htmlFor="capacity-unlimited" className="text-sm font-bold cursor-pointer">
                Unlimited capacity
              </Label>
              <p className="text-[11px] text-muted-foreground">
                No limit on how many people can attend
              </p>
            </div>
          </div>
          <Switch
            id="capacity-unlimited"
            checked={unlimited}
            onCheckedChange={onUnlimitedChange}
          />
        </div>
        {!unlimited && (
          <div className="grid gap-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Maximum attendees
            </Label>
            <Input
              type="number"
              min={1}
              value={value}
              onChange={(e) => onValueChange(e.target.value)}
              placeholder="e.g. 500"
              className="h-11 rounded-xl border-border/50 bg-muted/5"
            />
          </div>
        )}
    </div>
  );
}
