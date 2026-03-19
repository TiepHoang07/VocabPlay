import { Trash2, AlertTriangle, Loader2 } from "lucide-react"

interface DeleteWordModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    wordName: string
    isDeleting?: boolean
}

export default function DeleteWordModal({
    isOpen,
    onClose,
    onConfirm,
    wordName,
    isDeleting = false
}: DeleteWordModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with motion-safe blur */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />
            
            {/* Modal Container */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
                <div className="p-8">
                    <div className="flex flex-col items-center text-center">
                        {/* Warning Icon Container */}
                        <div className="mb-6 rounded-full bg-red-50 p-4 transition-colors">
                            <AlertTriangle className="h-10 w-10 text-red-500" />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Delete Word?</h2>
                        <p className="text-gray-600 mb-10 leading-relaxed">
                            Are you sure you want to delete <span className="font-semibold text-gray-900">"{wordName}"</span>? 
                            This action will permanently remove it from your dictionary.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 w-full">
                            <button
                                onClick={onClose}
                                disabled={isDeleting}
                                className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-100 text-gray-600 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={isDeleting}
                                className="flex-1 px-6 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 shadow-lg shadow-red-200 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {isDeleting ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="h-5 w-5" />
                                        Delete Word
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Subtle bottom accent */}
                <div className="h-1.5 bg-red-500/10 w-full" />
            </div>
        </div>
    )
}