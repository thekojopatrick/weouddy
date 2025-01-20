import { Card } from '@/components/ui/card';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { getNameInitials } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: number;
  members?: { name: string; image?: string }[];
}

function StatCard({ label, value, members }: StatCardProps) {
  return (
    <Card className="p-6 shadow-none">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-3xl font-bold">{value}</div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </div>
        {members && members.length > 0 && (
          <div className="flex -space-x-2">
            {members.map((member, i) => (
              <Avatar
                key={i}
                className="border-2 border-background w-8 h-8"
              >
                {member.image ? (
                  <AvatarImage src={member.image} alt={member.name} />
                ) : (
                  <AvatarFallback>
                    {getNameInitials(member.name)}
                  </AvatarFallback>
                )}
              </Avatar>
            ))}
            {members.length > 3 && (
              <Avatar className="border-2 border-background w-8 h-8">
                <AvatarFallback>+{members.length - 3}</AvatarFallback>
              </Avatar>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

interface MemberStatsProps {
  stats: {
    admins: {
      count: number;
      members: { name: string; image?: string }[];
    };
    members: {
      count: number;
      members: { name: string; image?: string }[];
    };
    limited: { count: number };
    pending: { count: number };
  };
}

export function MemberStats({ stats }: MemberStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <StatCard
        label="Admin"
        value={stats.admins.count}
        members={stats.admins.members}
      />
      <StatCard
        label="Members"
        value={stats.members.count}
        members={stats.members.members}
      />
      <StatCard
        label="Limited access members"
        value={stats.limited.count}
      />
      <StatCard label="Pending invites" value={stats.pending.count} />
    </div>
  );
}
