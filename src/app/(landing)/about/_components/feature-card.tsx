import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

export const FeatureCard = ({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image: string;
}) => (
  <Card className="mb-8 shadow-sm">
    <CardContent className="p-6">
      <Image
        src={image}
        alt={title}
        className="w-full h-48 object-cover rounded-lg mb-4"
        width={200}
        height={200}
      />
      <div className="text-blue-500 text-sm mb-2">For hiring</div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </CardContent>
  </Card>
);
