import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
    description?: string;
}

export const Dialog: React.FC<DialogProps> = ({
    isOpen,
    onClose,
    children,
    title,
    description,
}) => {
    const dialogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Content */}
            <div
                ref={dialogRef}
                className="relative z-50 w-full max-w-lg transform rounded-lg bg-white p-6 shadow-lg transition-all animate-in fade-in zoom-in-95 duration-200 sm:rounded-xl"
            >
                <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-4">
                    {title && <h2 className="text-lg font-semibold leading-none tracking-tight">{title}</h2>}
                    {description && <p className="text-sm text-gray-500">{description}</p>}
                </div>

                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100 data-[state=open]:text-gray-500"
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </button>

                {children}
            </div>
        </div>,
        document.body
    );
};
