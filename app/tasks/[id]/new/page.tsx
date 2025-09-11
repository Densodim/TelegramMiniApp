import {auth} from "@/auth";
import {redirect} from "next/navigation";
import {ItemForm} from "@/components/item";

export default async function NewTask() {
    const session = await auth();

    if (!session?.user) {
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 ">
            <div className="max-w-2xl mx-auto px-4">
                <ItemForm/>
            </div>
        </div>
    )
}