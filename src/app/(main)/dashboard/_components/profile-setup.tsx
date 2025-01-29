import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, Building2, FolderKanban } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";

const ProfileSetupComponets = () => {
  return (
    <Card className="shadow-xs">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Profile setup</CardTitle>
          <span className="bg-green-500/20 text-green-500 px-2 py-1 rounded text-sm">
            PRO
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>2 of 4 completed</span>
              <span className="text-gray-500">50% complete</span>
            </div>
            <Progress value={50} className="h-2" />
          </div>

          <p className="text-sm text-gray-500">
            Your profile needs to be at least 50% complete to be publicly
            visible.
          </p>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-100/5 rounded-lg">
              <div className="flex items-center gap-3">
                <Check className="text-green-500" size={20} />
                <span className="text-gray-400 line-through">
                  Download desktop app
                </span>
              </div>
              <Button variant="ghost" size="sm">
                Download
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-100/5 rounded-lg">
              <div className="flex items-center gap-3">
                <Building2 className="text-gray-400" size={20} />
                <span>Provide company details</span>
              </div>
              <Button variant="ghost" size="sm">
                Add now
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-100/5 rounded-lg">
              <div className="flex items-center gap-3">
                <Check className="text-green-500" size={20} />
                <span className="text-gray-400 line-through">
                  Invite 5 talents
                </span>
              </div>
              <Button variant="ghost" size="sm">
                Invite
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-100/5 rounded-lg">
              <div className="flex items-center gap-3">
                <FolderKanban className="text-gray-400" size={20} />
                <span>Add projects</span>
              </div>
              <Button variant="ghost" size="sm">
                Add now
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSetupComponets;
