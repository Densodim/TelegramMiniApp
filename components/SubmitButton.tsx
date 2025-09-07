'use client'
import {useFormStatus} from "react-dom";
import {saveDraftItem} from "@/app/actions";

export function SubmitButton({isPublished}: { isPublished?: boolean }) {
    const {pending} = useFormStatus();

    return (
        <div className="flex gap-4">
            <button
                type="submit"
                disabled={pending}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
                {isPublished ? "Update Item" : "Add Item"}
            </button>
            {!isPublished && (
                <button
                    formAction={saveDraftItem}
                    disabled={pending}
                    className="bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
                >
                    Save as Draft
                </button>
            )}
        </div>
    )
}

