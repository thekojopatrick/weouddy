'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  AlertTriangle,
  Edit2,
  Save,
  User as UserIcon,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import Avatar from './avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from '@supabase/supabase-js';
import { useAccount } from '@/hooks/account/use-account';
import { useState } from 'react';

export default function AccountForm({ user }: { user: User | null }) {
  const { accountData, loading, updateProfile } = useAccount();
  const [isEditing, setIsEditing] = useState(false);
  const [localData, setLocalData] = useState({
    fullname: accountData?.fullname ?? '',
    username: accountData?.username ?? '',
  });
  const [updateStatus, setUpdateStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleSave = async () => {
    const result = await updateProfile({
      name: localData.fullname,
      username: localData.username,
    });

    if (result?.success) {
      setUpdateStatus({
        type: 'success',
        message: result.message,
      });
      setIsEditing(false);
    } else {
      setUpdateStatus({
        type: 'error',
        message: result?.message ?? 'Update failed',
      });
    }
  };

  const handleAvatarUpload = async (url: string) => {
    await updateProfile({ avatarUrl: url });
  };

  return (
    <Card className="max-w-md mx-auto shadow-lg mt-16">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 pb-4">
        <CardTitle className="flex items-center">
          <UserIcon className="mr-2" /> Account Settings
        </CardTitle>
        <CardDescription>
          Manage your profile and preferences
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-6">
        <div className="flex justify-center mb-4">
          <Avatar
            uid={user?.id ?? null}
            url={accountData?.avatarUrl as never}
            size={150}
            onUploadAction={handleAvatarUpload}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={accountData?.email ?? ''}
            disabled
            className="bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="fullName">Full Name</Label>
            {!isEditing ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit2 className="h-4 w-4 mr-2" /> Edit
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Click to edit your profile
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : null}
          </div>
          <Input
            id="fullName"
            value={
              isEditing
                ? localData.fullname
                : (accountData?.fullname ?? '')
            }
            onChange={(e) =>
              setLocalData((prev) => ({
                ...prev,
                fullname: e.target.value,
              }))
            }
            disabled={!isEditing}
            className={
              isEditing
                ? 'border-blue-500 focus:ring-2 focus:ring-blue-200'
                : 'bg-gray-100 cursor-not-allowed'
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={
              isEditing
                ? localData.username
                : (accountData?.username ?? '')
            }
            onChange={(e) =>
              setLocalData((prev) => ({
                ...prev,
                username: e.target.value,
              }))
            }
            disabled={!isEditing}
            className={
              isEditing
                ? 'border-blue-500 focus:ring-2 focus:ring-blue-200'
                : 'bg-gray-100 cursor-not-allowed'
            }
          />
        </div>

        {isEditing && (
          <div className="flex space-x-2">
            <Button
              onClick={handleSave}
              disabled={loading}
              className="w-full"
            >
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        )}

        {updateStatus.type && (
          <div
            className={`p-3 rounded-md ${
              updateStatus.type === 'success'
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {updateStatus.message}
          </div>
        )}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to sign out?
              </AlertDialogTitle>
              <AlertDialogDescription>
                You will need to log in again to access your account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <form action="/auth/signout" method="post">
                <AlertDialogAction type="submit">
                  Sign Out
                </AlertDialogAction>
              </form>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
