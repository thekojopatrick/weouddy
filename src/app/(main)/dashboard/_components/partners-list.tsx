import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AvatarImage, Avatar } from "@/components/ui/avatar";
import React from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const PartnersList = () => {
  return (
    <Card className="shadow-xs">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Partners</CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Status:</span>
              <Button variant="outline" className="gap-2">
                All
                <ChevronDown size={16} />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort:</span>
              <Button variant="outline" className="gap-2">
                Newest
                <ChevronDown size={16} />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Partners Cards */}
          <div className="grid gap-4">
            <div className="flex items-center justify-between p-4 bg-gray-100/5 rounded-lg">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage
                    width={100}
                    height={100}
                    src="/placeholder.svg"
                    alt="Amanda Harvey"
                  />
                </Avatar>
                <div>
                  <h3 className="font-semibold">Amanda Harvey</h3>
                  <p className="text-sm text-gray-500">
                    Front-End Developer | (892) 312-5483 | amanda@email.com
                  </p>
                </div>
              </div>
              <span className="bg-green-500/20 text-green-500 px-2 py-1 rounded text-sm">
                PRO
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-100/5 rounded-lg">
              <div className="flex items-center gap-4">
                <Avatar className="bg-pink-200">
                  <span className="text-pink-700">D</span>
                </Avatar>
                <div>
                  <h3 className="font-semibold">Daniel Hobbs</h3>
                  <p className="text-sm text-gray-500">
                    Mobile Developer | +1 000-00-00 | bob@email.com
                  </p>
                </div>
              </div>
            </div>

            {/* Add more talent cards as needed */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PartnersList;
