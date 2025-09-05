import Link from "next/link";
import {auth} from "@/auth";
import prisma from "@/lib/prisma";
import {notFound, redirect} from "next/navigation";
import {clsx} from "clsx";
import Form from "next/form";
import {updateBoughtStatus} from "@/app/actions";

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
                        <section className="mb-8">
                            <div className="flex justify-between items-center px-2 py-6">
                                <p>{item.comment}</p>
                                <p>{item.price}</p>
                                <p>{item.store}</p>
                            </div>
                            <fieldset
                                className={clsx("space-y-4 border rounded-2xl p-6 bg-gray-50", item.bought ? "border-green-500" : "border-red-500")}>
                                <legend className="text-lg font-semibold text-gray-800 mb-2">Bought status</legend>

                                <Form action={updateBoughtStatus} className="flex items-center gap-2">
                                    <input type="hidden" name="itemId" value={item.id}/>
                                    <input type="hidden" name="taskId" value={task.id}/>
                                    <input id="bought" className="peer/bougth" type="radio" name="bought" value="true"
                                           defaultChecked={item.bought}/>
                                    <label htmlFor="bought" className="peer-checked/bougth:text-sky-500">Bought</label>

                                    <input id="noBougth" className="peer/noBougth" type="radio" name="bought"
                                           value="false"
                                           defaultChecked={!item.bought}/>
                                    <label htmlFor="noBougth" className="peer-checked/noBougth:text-sky-500">Not yet
                                        bought</label>
                                    <div className="hidden peer-checked/bougth:block">This item is marked as bought.
                                    </div>
                                    <div className="hidden peer-checked/noBougth:block">This item is not bought yet.
                                    </div>

                                    <button
                                        type="submit"
                                        className="ml-6 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                                    >
                                        Save
                                    </button>
                                </Form>

                            </fieldset>
                        </section>
                    </article>

                </div>
            </div>
        </div>
    )
}