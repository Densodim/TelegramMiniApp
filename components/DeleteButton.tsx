'use client'
import {PropsWithChildren} from "react";
import {deleteItem} from "@/app/actions";
import {useFormStatus} from "react-dom";


export function DeleteButton({itemId, children, taskId}: Props) {
    const {pending} = useFormStatus();

    const handleDelete = async () => {
        await deleteItem(itemId, taskId)
    }
    return (
        <>
            <button
                type="button"
                className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                disabled={pending}
                onClick={handleDelete}
            >
                {children}
            </button>
        </>
    )
}

type Props = {
    itemId: number
    taskId: number
} & PropsWithChildren