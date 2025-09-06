import {Item} from "@prisma/client";
import Link from "next/link";
import Form from "next/form";
import {publishPost} from "@/app/actions";

export function ItemForm({item}: ItemFormProps) {
    console.log(item);

    if (!item) {
        return <p>No item found</p>;
    }

    return (
        <>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    {!item ? "Create New Item" : "Edit Item"}
                </h1>
                {!!item && (
                    <Link href={`/`} className="text-gray-600 hover:text-gray-800 font-medium transition-colors">
                        Cancel
                    </Link>
                )}
            </div>
            <div className="bg-white rounded-xl shadow-sm border-gray-100 p-6">
                <Form action={publishPost} className="space-y-6">

                </Form>
            </div>
        </>
    )
}

type ItemFormProps = {
    item?: Item;
}