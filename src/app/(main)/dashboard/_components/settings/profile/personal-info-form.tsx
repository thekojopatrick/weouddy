"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function PersonalInfoForm() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Personal info</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Enter full name" />
          <p className="text-sm text-muted-foreground">
            Enter your full name, or a display name you are comfortable with.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" placeholder="Enter username" />
          <p className="text-sm text-muted-foreground">Enter your display name for public forums.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="Enter email address" />
          <p className="text-sm text-muted-foreground">Enter the email address you want to use to log in.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Select>
            <SelectTrigger id="location">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="ca">Canada</SelectItem>
              {/* Add more countries as needed */}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-4">
          <Button>Save changes</Button>
          <Button variant="outline">Cancel</Button>
        </div>
      </div>
    </div>
  )
}

