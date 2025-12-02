import { useState } from "react";
import { Dialog } from "./UI/dialog";
import { Button } from "./UI/button";
import { Input } from "./UI/input";
import { Label } from "./UI/label";
import { Loader2 } from "lucide-react";

interface CreatePropertyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (property: { property_name: string; location: string }) => Promise<void>;
}

const CreatePropertyModal = ({ isOpen, onClose, onCreate }: CreatePropertyModalProps) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        property_name: "",
        location: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onCreate({
                property_name: formData.property_name,
                location: formData.location,
            });
            setFormData({ property_name: "", location: "" }); // Reset form
            onClose();
        } catch (error) {
            console.error("Failed to create property", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title="Add New Property"
            description="Enter the details of the property you want to manage."
        >
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                    <Label htmlFor="property_name">Property Name</Label>
                    <Input
                        id="property_name"
                        placeholder="e.g. Sunset Apartments, Downtown Plaza"
                        value={formData.property_name}
                        onChange={(e) => setFormData({ ...formData, property_name: e.target.value })}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                        id="location"
                        placeholder="e.g. 123 Main St, Downtown"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Property
                    </Button>
                </div>
            </form>
        </Dialog>
    );
};

export default CreatePropertyModal;
