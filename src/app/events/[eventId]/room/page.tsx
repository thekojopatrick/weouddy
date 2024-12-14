'use client'

import { useState } from 'react'
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, MapPin, Users, MessageCircle, Plus } from 'lucide-react'
import Image from 'next/image'

interface Post {
  id: string
  image: string
  author: {
    name: string
    avatar: string
  }
  caption: string
  likes: number
  comments: number
  isPrivate: boolean
  type: 'Member' | 'Host'
}

const posts: Post[] = [
  {
    id: '1',
    image: '/placeholder.svg',
    author: {
      name: 'Sophie Lee',
      avatar: '/placeholder.svg',
    },
    caption: 'We outside free food day',
    likes: 20,
    comments: 5,
    isPrivate: false,
    type: 'Member',
  },
  // Add more posts...
]

export default function EventRoomPage() {
  const [hoveredPost, setHoveredPost] = useState<string | null>(null)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Sweet 16 Birthday</h1>
            <div className="flex items-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Friday, 12 August 2023</span>
                <span className="text-muted-foreground">9:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>East Legon hills</span>
                <span className="text-muted-foreground">Accra, Ghana</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>8 Members</span>
                <span className="text-muted-foreground">100 posts</span>
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="relative group"
                onMouseEnter={() => setHoveredPost(post.id)}
                onMouseLeave={() => setHoveredPost(null)}
              >
                <div className="relative aspect-square">
                  <Badge
                    variant="secondary"
                    className="absolute left-4 top-4 z-10"
                  >
                    {post.type}
                  </Badge>
                  {post.isPrivate && (
                    <Badge
                      variant="outline"
                      className="absolute right-4 top-4 z-10"
                    >
                      Private
                    </Badge>
                  )}
                  <Image
                    src={post.image}
                    alt={post.caption}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div
                  className={`absolute inset-0 bg-black/60 flex flex-col justify-end p-4 rounded-lg transition-opacity
                    ${hoveredPost === post.id || window.innerWidth < 768 ? 'opacity-100' : 'opacity-0'}`}
                >
                  <div className="flex items-center gap-2 text-white">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <span>{post.author.name}</span>
                  </div>
                  <p className="text-white mt-2">{post.caption}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-1 text-white">
                      <span>{post.likes}</span>
                      <span>likes</span>
                    </div>
                    <div className="flex items-center gap-1 text-white">
                      <span>{post.comments}</span>
                      <span>comments</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <div className="fixed bottom-8 right-8 flex flex-col gap-4">
        <Button size="lg" className="rounded-full shadow-lg">
          <MessageCircle className="mr-2 h-5 w-5" />
          Join Chatroom
        </Button>
        <Button size="lg" className="rounded-full shadow-lg">
          <Plus className="mr-2 h-5 w-5" />
          Create Post
        </Button>
      </div>
    </div>
  )
}

