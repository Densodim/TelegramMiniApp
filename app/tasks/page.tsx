import prisma from "@/lib/prisma";
import {formatName} from "@/lib/utils";

export default async function Tasks() {
    const tasks = await prisma.shoppingList.findMany({})
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <h2>Task Page</h2>
            {tasks.map(el => (
                <article key={el.id}
                         className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {el.name}
                    </h2>
                    <div className="text-sm text-gray-500">
                        by {formatName(el.name)}
                    </div>
                </article>
            ))}
        </div>
    )
}