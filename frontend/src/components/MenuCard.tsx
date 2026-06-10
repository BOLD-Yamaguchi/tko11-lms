import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ReactNode } from "react";

interface MenuCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

export function MenuCard({ icon, title, description, onClick }: MenuCardProps) {
  return (
    <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4 text-blue-600">
          {icon}
        </div>
        <CardTitle className="text-xl md:text-2xl mb-2">{title}</CardTitle>
        <CardDescription className="text-sm md:text-base text-gray-600">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center pb-6">
        <Button 
          onClick={onClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
        >
          開く
        </Button>
      </CardContent>
    </Card>
  );
}
