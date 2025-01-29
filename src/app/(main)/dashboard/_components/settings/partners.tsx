import { MemberSearch } from "./partners/member-search";
import { MemberStats } from "./partners/member-stats";
import { MemberTable } from "./partners/member-table";

const memberStats = {
  admins: {
    count: 1,
    members: [{ name: "James Collins", image: "/placeholder.svg" }],
  },
  members: {
    count: 5,
    members: [
      { name: "James Collins", image: "/placeholder.svg" },
      { name: "Daniel Hobbs", image: "/placeholder.svg" },
      { name: "Brian Warner", image: "/placeholder.svg" },
    ],
  },
  limited: { count: 2 },
  pending: { count: 0 },
};

const members = [
  {
    name: "James Collins",
    image: "/placeholder.svg",
    role: "Admin",
    email: "james@site.com",
    lastActivity: "Today",
    status: "active" as const,
  },
  {
    name: "James Collins",
    role: "Can view",
    email: "liza@site.com",
    lastActivity: "2 days ago",
    status: "inactive" as const,
  },
  {
    name: "Daniel Hobbs",
    image: "/placeholder.svg",
    role: "Can edit",
    email: "dhobbs@site.com",
    lastActivity: "Today",
    status: "inactive" as const,
  },
  {
    name: "Brian Warner",
    image: "/placeholder.svg",
    role: "Can edit",
    email: "brian@site.com",
    lastActivity: "1 months ago",
    status: "active" as const,
  },
  {
    name: "Ols Shols",
    role: "Can view",
    email: "olsshols@site.com",
    lastActivity: "6 days ago",
    status: "inactive" as const,
  },
];

export default function MembersPage() {
  return (
    <div className="space-y-8">
      <MemberStats stats={memberStats} />
      <MemberSearch />
      <MemberTable members={members} />
    </div>
  );
}
