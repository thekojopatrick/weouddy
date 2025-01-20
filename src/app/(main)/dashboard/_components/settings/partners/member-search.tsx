import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Send } from 'lucide-react';

export function MemberSearch() {
  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1">
        <Input
          placeholder="Search by name or email"
          className="pl-8"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </div>
      <Button variant="outline" className="gap-2">
        <Download className="h-4 w-4" />
        Download CSV
      </Button>
      <Button className="gap-2">
        <Send className="h-4 w-4" />
        Send Invite
      </Button>
    </div>
  );
}
