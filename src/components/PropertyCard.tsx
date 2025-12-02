import { useState } from "react";
import { MapPin, Building2, Trash2 } from "lucide-react";
import { Button } from "./UI/button";
import { useDeleteProperty } from "@/hooks/useDeleteProperty";

interface PropertyCardProps {
    propertyId: string;
    propertyName: string;
    location: string;
}

const PropertyCard = ({ propertyId, propertyName, location }: PropertyCardProps) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const deletePropertyMutation = useDeleteProperty();

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${propertyName}"?`)) {
            return;
        }

        setIsDeleting(true);
        try {
            await deletePropertyMutation.mutateAsync(propertyId);
        } catch (error) {
            console.error("Failed to delete property:", error);
            alert("Failed to delete property. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{propertyName}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                            <MapPin className="h-4 w-4" />
                            <span>{location}</span>
                        </div>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>

            <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Unit Types</span>
                    <span className="font-medium text-gray-700">0</span>
                </div>
            </div>
        </div>
    );
};

export default PropertyCard;
