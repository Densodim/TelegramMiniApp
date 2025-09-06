import Link from "next/link";
import {auth} from "@/auth";
import prisma from "@/lib/prisma";
import {notFound, redirect} from "next/navigation";
import {clsx} from "clsx";
import Form from "next/form";
import {updateBoughtStatus} from "@/app/actions";
import React from "react";

export default async function Item({params}: { params: Promise<{ id: string, itemId: string }> }) {
    const {id, itemId} = await params
    const session = await auth();
    if (!session?.user) {
        redirect("/");
    }

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
                                    <Link href={`/tasks/${item.id}/items/${item.id}/edit`}
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
                    <article className="mb-8">
                        <div className="flex justify-between items-center px-2 py-6">
                            <p>{item.comment}</p>
                            <p>{item.price}</p>
                            <p>{item.store}</p>
                        </div>
                        <fieldset
                            className={clsx("space-y-4 border rounded-2xl p-6 bg-gray-50", item.bought ? "border-green-500" : "border-red-500")}>
                            <legend className="text-lg font-semibold text-gray-800 mb-2">Bought status</legend>

                            <Form action={updateBoughtStatus} className="space-y-4">
                                <input type="hidden" name="itemId" value={item.id}/>
                                <input type="hidden" name="taskId" value={task.id}/>

                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    <label htmlFor="bought" className="flex items-center gap-2">
                                        <input
                                            id="bought"
                                            className="peer/bought"
                                            type="radio"
                                            name="bought"
                                            value="true"
                                            defaultChecked={item.bought}
                                        />
                                        <span className="peer-checked/bought:text-sky-500 font-medium">Bought</span>
                                    </label>

                                    <label htmlFor="noBought" className="flex items-center gap-2">
                                        <input
                                            id="noBought"
                                            className="peer/noBought"
                                            type="radio"
                                            name="bought"
                                            value="false"
                                            defaultChecked={!item.bought}
                                        />
                                        <span
                                            className="peer-checked/noBought:text-sky-500 font-medium">Not yet bought</span>
                                    </label>
                                </div>

                                <div className="text-sm text-gray-600">
                                    {item.bought
                                        ? "This item is marked as bought."
                                        : "This item is not bought yet."}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
                                >
                                    Save
                                </button>
                            </Form>

                        </fieldset>
                    </article>
                </div>
            </div>
        </div>
    )
}