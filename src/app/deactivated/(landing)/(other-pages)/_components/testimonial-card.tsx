import { Avatar, AvatarImage } from "@/components/ui/avatar";

export const TestimonialCard = ({
  quote,
  author,
  role,
}: {
  quote: string;
  author: string;
  role: string;
}) => (
  <div className="flex gap-4 mb-8">
    <Avatar>
      <AvatarImage
        alt={author}
        src="/placeholder.svg"
        className="w-12 h-12 rounded-full"
      />
    </Avatar>
    <div>
      <p className="mb-2 text-gray-700">{quote}</p>
      <p className="font-medium">{author}</p>
      <p className="text-gray-500 text-sm">{role}</p>
    </div>
  </div>
);
