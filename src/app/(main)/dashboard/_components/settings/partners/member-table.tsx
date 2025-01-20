import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Member {
  name: string
  image?: string
  role: string
  email: string
  lastActivity: string
  status: "active" | "inactive"
}

interface MemberTableProps {
  members: Member[]
}

export function MemberTable({ members }: MemberTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Member</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Last activity</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member, i) => (
          <TableRow key={i}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar>
                  {member.image ? (
                    <AvatarImage src={member.image} alt={member.name} />
                  ) : (
                    <AvatarFallback>{member.name.charAt(0).toUpperCase()}</AvatarFallback>
                  )}
                </Avatar>
                <div>{member.name}</div>
              </div>
            </TableCell>
            <TableCell>{member.role}</TableCell>
            <TableCell>{member.email}</TableCell>
            <TableCell>{member.lastActivity}</TableCell>
            <TableCell>
              <Badge variant={member.status === "active" ? "success" : "secondary"}>{member.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

