import { Button } from '@/shared_components/ui/button';
import { PackageX, Search, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: 'search' | 'package';
  onAction?: () => void;
  actionText?: string;
}

export default function EmptyState({
  title,
  description,
  icon = 'search',
  onAction,
  actionText,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-cine-card/50 p-8 text-center font-sora">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cine-cyan/10 border border-cine-cyan/20">
        {icon === 'search' ? (
          <Search className="h-10 w-10 text-cine-cyan" />
        ) : (
          <PackageX className="h-10 w-10 text-cine-cyan" />
        )}
      </div>

      <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-2 mb-6 max-w-sm text-sm text-gray-500">{description}</p>

      {onAction && (
        <Button
          onClick={onAction}
          variant="outline"
          className="gap-2 border-cine-cyan/30 text-cine-cyan hover:bg-cine-cyan/10 bg-transparent"
        >
          <RotateCcw className="h-4 w-4" />
          {actionText}
        </Button>
      )}
    </div>
  );
}
