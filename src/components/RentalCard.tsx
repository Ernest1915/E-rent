import { Card, CardContent, CardHeader, CardTitle } from "./UI/card";
import { Home, CheckCircle, XCircle } from "lucide-react";
import { Button } from "./UI/button";

interface RentalCardProps {
    unitId: string;
    unitStatus: string;
    onClick: () => void;
}

const RentalCard = ({ unitId, unitStatus, onClick }: RentalCardProps) => {
    const isVacant = unitStatus === "Vacant";

    return (
        <Card
            className="hover:shadow-md transition-shadow cursor-pointer group"
            onClick={onClick}
        >
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold group-hover:text-blue-600 transition-colors flex items-center gap-2">
                        <Home className="h-5 w-5" />
                        {unitId}
                    </CardTitle>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${isVacant
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}>
                        {isVacant ? (
                            <CheckCircle className="h-3.5 w-3.5" />
                        ) : (
                            <XCircle className="h-3.5 w-3.5" />
                        )}
                        {unitStatus}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <Button variant="outline" className="w-full text-xs h-8">
                        Manage Unit
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default RentalCard;
