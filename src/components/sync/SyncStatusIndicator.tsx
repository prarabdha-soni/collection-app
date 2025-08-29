import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { RefreshCw, Wifi, WifiOff, Clock } from "lucide-react";
import { useCollectionPortalSync } from "@/hooks/useCollectionPortalSync";
import { formatDistanceToNow } from "date-fns";

export function SyncStatusIndicator() {
  const { syncStatus, manualSync } = useCollectionPortalSync();

  const handleManualSync = async () => {
    await manualSync();
  };

  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant={syncStatus.isConnected ? "default" : "destructive"}
            className="flex items-center gap-1"
          >
            {syncStatus.isConnected ? (
              <Wifi className="w-3 h-3" />
            ) : (
              <WifiOff className="w-3 h-3" />
            )}
            {syncStatus.isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p>Collection Portal Sync Status</p>
            <p>Synced records: {syncStatus.syncCount}</p>
            {syncStatus.lastSync && (
              <p>Last sync: {formatDistanceToNow(syncStatus.lastSync, { addSuffix: true })}</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleManualSync}
            className="h-6 w-6 p-0"
          >
            <RefreshCw className="w-3 h-3" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          Manual sync with Collection Portal
        </TooltipContent>
      </Tooltip>

      {syncStatus.lastSync && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(syncStatus.lastSync, { addSuffix: true })}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            Last successful sync
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}