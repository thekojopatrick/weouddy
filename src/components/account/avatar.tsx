'use client';

import { Camera, Trash2, Upload, UserCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { supabase } from '@/utils/supabase/client';

export default function Avatar({
  uid,
  url,
  size = 150,
  onUploadAction,
  onDeleteAction,
}: {
  uid: string | null;
  url: string | null;
  size?: number;
  onUploadAction: (url: string) => void;
  onDeleteAction?: () => void;
}) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(url);
  const [uploading, setUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!url?.startsWith('https://lh3.googleusercontent.com')) {
      async function downloadImage(path: string) {
        try {
          const { data, error } = await supabase.storage
            .from('avatars')
            .download(path);

          if (error) {
            throw error;
          }

          const url = URL.createObjectURL(data);
          setAvatarUrl(url);
        } catch (error) {
          console.log('Error downloading image: ', error);
        }
      }

      if (url) downloadImage(url);
    }
  }, [url]);

  const uploadAvatar: React.ChangeEventHandler<
    HTMLInputElement
  > = async (event) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${uid}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      onUploadAction(filePath);
      setIsDialogOpen(false);
    } catch (error: Error | unknown) {
      console.error('Error uploading image: ', error);
      alert('Error uploading avatar!');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (onDeleteAction) {
      onDeleteAction();
      setAvatarUrl(null);
      setIsDialogOpen(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <div className="relative group">
        <DialogTrigger asChild>
          <div className="cursor-pointer hover:opacity-70 transition-opacity duration-300">
            {avatarUrl ? (
              <Image
                width={size}
                height={size}
                src={avatarUrl}
                alt="Avatar"
                className="rounded-full object-cover shadow-md group-hover:shadow-lg transition-shadow duration-300"
                style={{
                  height: size,
                  width: size,
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div
                className="bg-gray-200 flex items-center justify-center rounded-full shadow-md group-hover:shadow-lg transition-shadow duration-300"
                style={{
                  height: size,
                  width: size,
                }}
              >
                <UserCircle2
                  className="text-gray-500"
                  size={size * 0.7}
                />
              </div>
            )}
            <div
              className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 shadow-md group-hover:scale-110 transition-transform duration-300"
              style={{
                transform: 'translate(25%, 25%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Camera size={16} />
            </div>
          </div>
        </DialogTrigger>
      </div>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Profile Picture</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4">
          {avatarUrl && (
            <Image
              width={250}
              height={250}
              src={avatarUrl}
              alt="Large Avatar Preview"
              className="rounded-full object-cover shadow-lg"
            />
          )}

          <div className="flex space-x-4">
            <Button
              variant="outline"
              className="flex items-center"
              asChild
            >
              <label
                htmlFor="avatar-upload"
                className="cursor-pointer flex items-center"
              >
                <Upload className="mr-2 h-4 w-4" />
                {uploading ? 'Uploading...' : 'Upload New'}
                <input
                  id="avatar-upload"
                  style={{ display: 'none' }}
                  type="file"
                  accept="image/*"
                  onChange={uploadAvatar}
                  disabled={uploading}
                />
              </label>
            </Button>

            {avatarUrl && (
              <Button
                variant="destructive"
                onClick={handleDeleteAvatar}
                className="flex items-center"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
