import { GlassCard } from "@/components/ui/glass-card";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-slate-900">
          Account Settings
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure notifications, scanner API keys, and team access rules.
        </p>
      </div>

      <GlassCard className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <div className="max-w-md">
          <h3 className="text-xl font-semibold tracking-tight text-foreground">
            Configuration Dashboard
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Update scan frequencies, billing info, profiles, and API tokens here.
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
