import { useState } from "react";
import { Dialog } from "./UI/dialog";
import { Button } from "./UI/button";
import { Input } from "./UI/input";
import { Label } from "./UI/label";
import { Loader2 } from "lucide-react";

interface CreateRentalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (rental: { unitId: string; unitStatus: string }) => Promise<void>;
}

const CreateRentalModal = ({ isOpen, onClose, onCreate }: CreateRentalModalProps) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        unitId: "",
        unitStatus: "Vacant",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onCreate({
                unitId: formData.unitId,
                unitStatus: formData.unitStatus,
            });
            setFormData({ unitId: "", unitStatus: "Vacant" }); // Reset form
            onClose();
        } catch (error) {
            console.error("Failed to create rental", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title="Add New Rental Unit"
            description="Enter the details of the rental unit you want to manage."
        >
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                    <Label htmlFor="unitId">Unit ID</Label>
                    <Input
                        id="unitId"
                        placeholder="e.g. A-101, B-202"
                        value={formData.unitId}
                        onChange={(e) => setFormData({ ...formData, unitId: e.target.value })}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="unitStatus">Unit Status</Label>
                    <select
                        id="unitStatus"
                        value={formData.unitStatus}
                        onChange={(e) => setFormData({ ...formData, unitStatus: e.target.value })}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        required
                    >
                        <option value="Vacant">Vacant</option>
                        <option value="Occupied">Occupied</option>
                    </select>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Unit
                    </Button>
                </div>
            </form>
        </Dialog>
    );
};

export default CreateRentalModal;
