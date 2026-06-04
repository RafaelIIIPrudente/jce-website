import { PageHeader } from "@/components/jce/page-header";
import { EmptyState } from "@/components/jce/empty-state";
import { ModuleIcon } from "@/components/jce/module-icon";

// Throwaway "built in Part N" placeholder for module routes not yet implemented,
// so RBAC nav resolves without 404s. Replaced by each module's own part.

export function ModulePlaceholder({
  kicker,
  title,
  part,
  icon,
}: {
  kicker: string;
  title: string;
  part: string;
  icon: string;
}) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <PageHeader kicker={kicker} title={title} />
      <div className="glass rounded-(--r-glass) p-8">
        <EmptyState
          icon={<ModuleIcon icon={icon} className="size-7" />}
          title={`Built in ${part}`}
          description={`The ${title} module is part of the sequenced JCE System rollout. This placeholder is replaced when ${part} ships.`}
        />
      </div>
    </div>
  );
}
