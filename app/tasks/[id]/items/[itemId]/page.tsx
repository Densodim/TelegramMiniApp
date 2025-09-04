import Link from "next/link";
import {auth} from "@/auth";
import prisma from "@/lib/prisma";
import {notFound} from "next/navigation";

export default async function Item({params}: { params: Promise<{ id: string, itemId: string }> }) {
    const {id, itemId} = await params
    const session = await auth();

    const task = await prisma.shoppingList.findUnique({where: {id: parseInt(id)}, include: {user: true}});
    const item = await prisma.item.findUnique({where: {id: parseInt(itemId)}})
    console.log(item)
    if (!task || !item) {
        notFound()
    }

    const isUser = session?.user?.email === task.user.email;
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <article>
                        <header className="mb-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-4xl font-bold text-gray-900">{item.name}</h2>
                                {isUser && (
                                    <Link href={`/tasks/${item.id}/edit`}
                                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-l-lg font-medium transition-colors">
                                        Edit task
                                    </Link>
                                )}
                            </div>

                            {!task.published && (
                                <div className="mb-6 bg-yellow-50 text-yellow-800 px-4 py-2">
                                    This task is currently a draft
                                </div>
                            )}

                        </header>
                    </article>

                </div>
            </div>
        </div>
    )
}