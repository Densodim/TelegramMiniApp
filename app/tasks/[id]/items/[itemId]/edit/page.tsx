import {auth} from "@/auth";
import {redirect} from "next/navigation";

export default async function EditTask({params}: { params: Promise<{ id: string, itemId: string }> }) {
    const session = await auth();
    if (!session?.user) {
        redirect("/");
    }
    const {id, itemId} = await params
    return (
        <div className="block py-16 px-4">
            Edit Task
        </div>
    )
}