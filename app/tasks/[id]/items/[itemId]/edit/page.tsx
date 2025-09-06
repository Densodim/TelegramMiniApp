import {auth} from "@/auth";
import {notFound, redirect} from "next/navigation";
import prisma from "@/lib/prisma";
import {ItemForm} from "@/components/item";

export default async function EditTask({params}: { params: Promise<{ id: string, itemId: string }> }) {
    const session = await auth();
    if (!session?.user) {
        redirect("/");
    }
    const {id, itemId} = await params

    const task = await prisma.shoppingList.findUnique({
        where: {id: parseInt(id)},
        include: {user: true, items: {where: {id: parseInt(itemId)}}}
    })

    if (!task) {
        notFound();
    }

    if (task.user.email !== session.user.email) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-14">
            <div className="max-w-2xl mx-auto px-4">
                <ItemForm item={task.items[0]}/>
            </div>
        </div>
    )
}