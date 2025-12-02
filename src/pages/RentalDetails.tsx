import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Home, Edit, Trash2, Users, DollarSign, Calendar } from "lucide-react";
import { Button } from "@/components/UI/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { useRentals } from "@/hooks/useRentals";
import { useDeleteRental } from "@/hooks/useDeleteRental";

const RentalDetails = () => {
    const { rentalId } = useParams<{ rentalId: string }>();
    const navigate = useNavigate();
    const { data: rentals = [], isLoading } = useRentals();
    const deleteRentalMutation = useDeleteRental();

    // Find the specific rental
    const rental = rentals.find((r) => r.$id === rentalId);

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this rental unit?")) {
            deleteRentalMutation.mutate(rentalId!, {
                onSuccess: () => {
                    navigate("/dashboard");
                },
            });
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-500">Loading rental details...</div>
            </div>
        );
    }

    if (!rental) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Rental not found</h2>
                <Button onClick={() => navigate("/dashboard")} variant="outline">
                    Back to Dashboard
                </Button>
            </div>
        );
    }

    const isVacant = rental["unit-status"] === "Vacant";

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                onClick={() => navigate("/dashboard")}
                                className="flex items-center gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </Button>
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                    <Home className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{rental["unit-id"]}</h1>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${isVacant ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-700"
                                                }`}
                                        >
                                            {rental["unit-status"]}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button variant="outline" className="flex items-center gap-2">
                                <Edit className="h-4 w-4" />
                                Edit
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleDelete}
                                className="flex items-center gap-2 text-red-600 hover:bg-red-50 border-red-200"
                                disabled={deleteRentalMutation.isPending}
                            >
                                <Trash2 className="h-4 w-4" />
                                {deleteRentalMutation.isPending ? "Deleting..." : "Delete"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Rental Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Home className="h-5 w-5" />
                                    Rental Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Unit ID</label>
                                        <p className="mt-1 text-base text-gray-900">{rental["unit-id"]}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Status</label>
                                        <p className="mt-1 text-base text-gray-900">{rental["unit-status"]}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Created</label>
                                        <p className="mt-1 text-base text-gray-900">
                                            {new Date(rental.$createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Last Updated</label>
                                        <p className="mt-1 text-base text-gray-900">
                                            {new Date(rental.$updatedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tenants Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Tenants
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8">
                                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-sm text-gray-500">No tenants assigned yet</p>
                                    <Button className="mt-4" variant="outline">
                                        Add Tenant
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment History */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="h-5 w-5" />
                                    Payment History
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8">
                                    <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-sm text-gray-500">No payments recorded yet</p>
                                    <Button className="mt-4" variant="outline">
                                        Add Payment
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Quick Stats */}
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Stats</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm text-gray-600">Occupancy</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900">
                                        {isVacant ? "0 days" : "N/A"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm text-gray-600">Total Tenants</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900">0</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm text-gray-600">Total Revenue</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900">UGX 0</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Activity */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-6">
                                    <p className="text-sm text-gray-500">No recent activity</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RentalDetails;
