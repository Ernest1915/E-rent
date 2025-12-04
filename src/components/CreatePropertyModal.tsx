import { useState, useRef } from "react";
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

    // Track in-flight requests to prevent React StrictMode duplicates
    const isSubmittingRef = useRef(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prevent duplicate submissions (including StrictMode double-calls)
        if (loading || isSubmittingRef.current) {
            console.log("Submission blocked - already in progress");
            return;
        }

        isSubmittingRef.current = true;
        setLoading(true);

        try {
            console.log("📝 CreatePropertyModal: Submitting property creation...");
            await onCreate({
                property_name: formData.property_name,
                location: formData.location,
            });

            console.log("✅ CreatePropertyModal: Property created successfully!");
            setFormData({ property_name: "", location: "" }); // Reset form
            onClose();
        } catch (error: any) {
            console.error("❌ CreatePropertyModal: Error in handleSubmit", error);
            console.error("Error type:", typeof error);
            console.error("Error object:", error);

            // Show user-friendly error for duplicates
            if (error?.message?.includes("already exists")) {
                alert(`Property "${formData.property_name}" already exists. Please use a different name.`);
            } else {
                // Log detailed error information for debugging
                console.error("Non-duplicate error:", {
                    message: error?.message,
                    name: error?.name,
                    cause: error?.cause,
                });
                alert("Failed to create property. Please try again.");
            }
        } finally {
            setLoading(false);
            isSubmittingRef.current = false;
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
