'use client';

import * as z from 'zod';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  updateFollowSettings,
  updateProfile,
} from '@/server/actions/user/profile';

import Avatar from './avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { updateUserPrivacy } from '@/server/actions/user/privacy';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

// Validation schema
const profileSchema = z.object({
  avatarUrl: z.string().optional(),
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' }),
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters' }),
  bio: z
    .string()
    .max(500, { message: 'Bio cannot exceed 500 characters' })
    .optional(),
});

const privacySchema = z.object({
  allowFollowers: z.boolean(),
  isPrivateProfile: z.boolean(),
});

interface AccountFormProps {
  user: {
    id: string;
    name?: string;
    username?: string;
    email?: string;
    bio?: string;
    avatarUrl?: string;
    allowFollowers?: boolean;
    isPrivateProfile?: boolean;
  };
}

export default function AccountForm({ user }: AccountFormProps) {
  const [isEditing, setIsEditing] = useState(false);

  // Profile form
  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name ?? '',
      username: user.username ?? '',
      bio: user.bio ?? '',
      avatarUrl: user.avatarUrl ?? '',
    },
  });

  // Privacy form
  const privacyForm = useForm<z.infer<typeof privacySchema>>({
    resolver: zodResolver(privacySchema),
    defaultValues: {
      allowFollowers: user.allowFollowers ?? true,
      isPrivateProfile: user.isPrivateProfile ?? false,
    },
  });

  const handleProfileSubmit = async (
    data: z.infer<typeof profileSchema>
  ) => {
    try {
      await updateProfile(user.id, data);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    }
  };

  const handlePrivacySubmit = async (
    data: z.infer<typeof privacySchema>
  ) => {
    try {
      await Promise.all([
        updateFollowSettings(data.allowFollowers),
        updateUserPrivacy(data.isPrivateProfile),
      ]);
      toast.success('Privacy settings updated');
    } catch (error) {
      toast.error('Failed to update privacy settings');
      console.error(error);
    }
  };

  const handleAvatarUpload = async (url: string) => {
    const data = {
      name: user.name ?? '',
      username: user.username ?? '',
      bio: user.bio ?? '',
      avatarUrl: user.avatarUrl ?? url,
    };

    if (user.avatarUrl !== url) {
      await updateProfile(user.id, data);
      toast.success('Profile picture updated successfully');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <h1 className="text-xl font-bold tracking-tight mb-6">
        Account Settings
      </h1>

      <div className="flex justify-center mb-4">
        <Avatar
          uid={user?.id ?? null}
          url={user.avatarUrl ?? ''}
          size={150}
          onUploadAction={handleAvatarUpload}
        />
      </div>

      {/* Profile Information Section */}
      <Form {...profileForm}>
        <form
          onSubmit={profileForm.handleSubmit(handleProfileSubmit)}
          className="space-y-6"
        >
          <FormField
            control={profileForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your full name"
                    {...field}
                    disabled={!isEditing}
                    className="h-10 shadow-xs text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={profileForm.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Choose a unique username"
                    {...field}
                    disabled={!isEditing}
                    className="h-10 shadow-xs text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={profileForm.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about yourself"
                    {...field}
                    disabled={!isEditing}
                    className="shadow-xs h-40 text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4">
            {!isEditing ? (
              <Button
                type="button"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </>
            )}
          </div>
        </form>
      </Form>

      {/* Privacy Settings Section */}
      <div className="mt-8 border-t pt-6">
        <h2 className="text-lg tracking-tight font-semibold mb-4">
          Privacy Settings
        </h2>
        <Form {...privacyForm}>
          <form
            onSubmit={privacyForm.handleSubmit(handlePrivacySubmit)}
            className="space-y-6"
          >
            <FormField
              control={privacyForm.control}
              name="allowFollowers"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Allow Followers</FormLabel>
                    <FormDescription>
                      Enable or disable the ability for others to
                      follow you
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={privacyForm.control}
              name="isPrivateProfile"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Private Profile</FormLabel>
                    <FormDescription>
                      When enabled, only approved followers can see
                      your profile
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" variant="secondary">
              Update Privacy Settings
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
