import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MoreVertical, X, Copy } from 'lucide-react';

const InviteModal = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [invitees] = useState([
    {
      id: 1,
      name: 'James Collison',
      email: 'james@site.com',
      isYou: true,
      avatar: '/api/placeholder/32/32',
      role: 'Admin',
    },
    {
      id: 2,
      name: 'Liza Harrison',
      email: 'liza@site.com',
      avatar: 'L',
      role: 'Can view',
    },
    {
      id: 3,
      name: 'Daniel Hobbs',
      email: 'dhobbs@site.com',
      avatar: '/api/placeholder/32/32',
      role: 'Can edit',
    },
    {
      id: 4,
      name: 'Anna Richard',
      email: 'anna@site.com',
      avatar: '/api/placeholder/32/32',
      role: 'Can edit',
    },
  ]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[525px]"
        closebtnstyle="hidden"
      >
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Invite</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="rounded-full bg-gray-50"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invite Input Section */}
          <div>
            <h4 className="text-sm font-medium mb-3">Invite</h4>
            <div className="flex gap-2">
              <Input
                placeholder="Add name or emails"
                className="flex-1"
              />
              <Select defaultValue="view">
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Can view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">Can view</SelectItem>
                  <SelectItem value="edit">Can edit</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Button>Send</Button>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Checkbox id="notify" defaultChecked />
              <label
                htmlFor="notify"
                className="text-sm text-gray-500"
              >
                Notify recipients via email
              </label>
            </div>
          </div>

          {/* People Section */}
          <div>
            <h4 className="text-sm font-medium mb-3">
              From Htmlstream
            </h4>
            <div className="space-y-3">
              {invitees.map((invitee) => (
                <div
                  key={invitee.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      {typeof invitee.avatar === 'string' &&
                      invitee.avatar.length === 1 ? (
                        <div className="bg-blue-100 text-blue-600 w-full h-full flex items-center justify-center">
                          {invitee.avatar}
                        </div>
                      ) : (
                        <img
                          src={invitee.avatar}
                          alt={invitee.name}
                        />
                      )}
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {invitee.name}{' '}
                        {invitee.isYou && (
                          <span className="text-gray-500">(you)</span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">
                        {invitee.email}
                      </p>
                    </div>
                  </div>
                  <Select
                    defaultValue={invitee.role
                      .toLowerCase()
                      .replace(' ', '-')}
                  >
                    <SelectTrigger className="w-[110px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="can-edit">
                        Can edit
                      </SelectItem>
                      <SelectItem value="can-view">
                        Can view
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <MoreVertical className="h-4 w-4" />2 more people
              </div>
            </div>
          </div>

          {/* Share Link Section */}
          <div>
            <h4 className="text-sm font-medium mb-3">
              Share read-only link
            </h4>
            <div className="flex gap-2">
              <Input
                readOnly
                value="https://www.figma.com/community/file/1179068859697769656"
                className="flex-1 text-gray-500"
              />
              <Button variant="ghost" size="icon">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button variant="link" className="text-gray-500 h-auto p-0">
            Read more about share
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;
