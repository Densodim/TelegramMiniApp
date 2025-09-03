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