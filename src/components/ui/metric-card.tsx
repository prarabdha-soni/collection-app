import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  variant?: "default" | "success" | "warning" | "destructive";
  className?: string;
}

export function MetricCard({ 
  title, 
  value, 
  subtitle, 
  variant = "default",
  className 
}: MetricCardProps) {
  const variantStyles = {
    default: "bg-metric-bg",
    success: "bg-success-light border-success/20",
    warning: "bg-warning-light border-warning/20",
    destructive: "bg-destructive/10 border-destructive/20"
  };

  return (
    <Card className={cn(
      "p-4 text-center transition-all duration-200",
      variantStyles[variant],
      className
    )}>
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </Card>
  );
}