import {auth} from "@/auth";
import prisma from "@/lib/prisma";
import {notFound} from "next/navigation";
import Link from "next/link";
import {formatName} from "@/lib/utils";

export default async function Task({params}: { params: Promise<{ id: string }> }) {

    const {id} = await params;
    const session = await auth();

    const task = await prisma.shoppingList.findUnique({
        where: {id: parseInt(id)},
        include: {
            user: true,
            items: true,
        }
    })

    if (!task) {
        notFound()
    }

    console.log(task)
    const isUser = session?.user?.email === task.user.email;


    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-4xl font-bold text-gray-900">
                        {task.name}
                    </h2>
                    <Link href={'/tasks/new'}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        New Task
                    </Link>
                </div>
                {isUser && (
                    <div className="space-y-4">
                        {task.items.map((item) => (
                            <Link key={item.id} href={`/tasks/${task.id}/items/${item.id}`}
                                  className="block transition-transform hover:scale-[1.01]">
                                <article
                                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-transform">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                        {item.name}
                                    </h2>
                                    <div className="text-sm text-gray-500">
                                        by {formatName(task.user.name)}
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}

            </div>
        </div>
        // <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        //     <div className="max-w-4xl mx-auto px-4 py-16">
        //         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        //             <article>
        //                 <header className="mb-8">
        //                     <div className="flex items-center justify-between mb-6">
        //                         <h2 className="text-4xl font-bold text-gray-900">{task.name}</h2>
        //                         {isUser && (
        //                             <Link href={`/tasks/${task.id}/edit`}
        //                                   className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-l-lg font-medium transition-colors">
        //                                 Edit task
        //                             </Link>
        //                         )}
        //                     </div>
        //
        //                     {task.published && (
        //                         <div className="mb-6 bg-yellow-50 text-yellow-800 px-4 py-2">
        //                             This task is currently a draft
        //                         </div>
        //                     )}
        //
        //                 </header>
        //             </article>
        //
        //         </div>
        //     </div>
        // </div>
    )
}