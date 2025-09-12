import {auth} from "@/auth";
import prisma from "@/lib/prisma";
import {notFound} from "next/navigation";
import Link from "next/link";
import {clsx} from "clsx";
import {formatName} from "@/lib/utils";
import {DeleteButton} from "@/components/DeleteButton";

export default async function Task({params}: { params: Promise<{ id: string }> }) {

    const {id} = await params;
    const session = await auth();

    const task = await prisma.shoppingList.findUnique({
        where: {id: parseInt(id)},
        include: {
            user: true,
            items: true
        }
    })
    const currency = await prisma.currency.findUnique({
        where: {
            code: "USD"
        },
        include: {
            ratesTo: true
        }
    });

    if (!task || !currency) {
        notFound()
    }

    const isUser = session?.user?.email === task.user.email;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-4xl font-bold text-gray-900">
                        {task.name}
                    </h2>
                    <p className="text-sm text-gray-900 p-6">
                        {currency.name}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 italic">
                        Date: {new Date(currency.ratesTo[0].createdAt).toLocaleDateString("en-US")}
                    </p>
                    <Link href={`/tasks/${task.id}/new`}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        New Task
                    </Link>
                </div>
                {isUser && (
                    <div className="space-y-4">
                        {task.items.map((item) => (
                            <div
                                key={item.id}
                                className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 bg-white rounded-xl p-6 shadow-sm border
                            hover:shadow-md transition-transform
                            hover:scale-[1.01]
                            group"
                            >
                                <Link href={`/tasks/${task.id}/items/${item.id}`}
                                      className="flex-1 block">
                                    <article
                                        className={clsx("transition-transform", item.bought ? "border-green-500" : "border-red-500")}>
                                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                            {item.name}
                                        </h2>
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="text-sm text-gray-500">
                                                by {formatName(task.user.name)}
                                            </div>
                                            <div>
                                                {item.price}-{currency.code}
                                            </div>
                                            <div>
                                                {item.comment && (
                                                    <p className="text-sm text-gray-500 italic">
                                                        {item.comment}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                {item.vatRefundable ? "✅ VAT refundable" : "❌ No VAT refund"}
                                            </div>
                                        </div>
                                        {!item.published && (
                                            <div
                                                className="mb-6 bg-yellow-50 text-yellow-800 px-4 py-2 rounded-md text-sm">
                                                This post is currently a draft
                                            </div>
                                        )}

                                    </article>
                                </Link>
                                <DeleteButton itemId={item.id} taskId={task.id}>Delete</DeleteButton>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    )
}