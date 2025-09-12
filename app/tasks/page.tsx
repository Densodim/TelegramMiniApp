import prisma from "@/lib/prisma";
import {formatName} from "@/lib/utils";
import Link from "next/link";


export default async function Tasks() {

    const tasks = await prisma.shoppingList.findMany({
        include: {
            user: true,
        },
        where: {
            published: true,
        },
        orderBy: {
            createdAt: "desc",
        }
    })

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">
                        Tasks
                    </h2>
                    <div className="inline-flex rounded-md shadow-xs" role="group">

                        <Link
                            href={"/tasks/new/shop"}
                            className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
                        >
                            New Shop
                        </Link>
                        <Link
                            href={"/tasks/new/shoppingList"}
                            className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
                        >
                            New Shopping List
                        </Link>
                    </div>
                </div>


                {tasks.map(el => (
                    <Link href={`/tasks/${el.id}`} key={el.id}
                          className="block transition-transform hover:scale-[1.01]">
                        <article
                            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                {el.name}
                            </h2>
                            <div className="text-sm text-gray-500">
                                by {formatName(el.name)}
                            </div>
                        </article>
                    </Link>
                ))}
            </div>
        </div>
    )
}