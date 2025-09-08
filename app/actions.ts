"use server";

import {auth} from "@/auth";
import prisma from "@/lib/prisma";
import {containsProfanity} from "@/lib/utils";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

export async function publishPost(formData: FormData) {
    const session = await auth();
    if (!session?.user) {
        redirect("/");
    }

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const postId = formData.get("postId") as string;

    if (!title?.trim()) {
        throw new Error("Title is required");
    }

    if (containsProfanity(content)) {
        throw new Error("Content contains profanity");
    }

    const post = await prisma.post.upsert({
        where: {
            id: parseInt(postId ?? "-1"),
            author: {
                email: session.user.email!,
            },
        },
        update: {
            title: title.trim(),
            content: content?.trim(),
            published: true,
        },
        create: {
            title: title.trim(),
            content: content?.trim(),
            published: true,
            author: {
                connect: {
                    email: session.user.email!,
                },
            },
        },
    });

    revalidatePath(`/posts/${post.id}`);
    revalidatePath("/posts");
    redirect(`/posts/${post.id}`);
}

export async function saveDraft(formData: FormData) {
    const session = await auth();
    if (!session?.user) {
        redirect("/");
    }

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const postId = formData.get("postId") as string;

    if (!title?.trim()) {
        throw new Error("Title is required");
    }

    if (containsProfanity(content)) {
        throw new Error("Content contains profanity");
    }

    const post = await prisma.post.upsert({
        where: {
            id: parseInt(postId ?? "-1"),
            author: {
                email: session.user.email!,
            },
        },
        update: {
            title: title.trim(),
            content: content?.trim(),
            published: false,
        },
        create: {
            title: title.trim(),
            content: content?.trim(),
            published: false,
            author: {
                connect: {
                    email: session.user.email!,
                },
            },
        },
    });

    revalidatePath(`/posts/${post.id}`);
    revalidatePath("/posts");
    redirect(`/posts/${post.id}`);
}

export async function updateBoughtStatus(formData: FormData) {
    const session = await auth();
    if (!session?.user) {
        redirect("/");
    }

    const itemId = Number(formData.get("itemId"));
    const taskId = Number(formData.get("taskId"));
    const bought = formData.get("bought") === 'true';
    await prisma.item.update({
        where: {id: itemId},
        data: {bought}
    })
    revalidatePath(`/tasks/${taskId}/items/${itemId}`);
    revalidatePath("/items")
    redirect(`/tasks/${taskId}`)
}

export async function publishTask(formData: FormData) {
    const session = await auth();
    if (!session?.user) {
        redirect("/");
    }
    const id = formData.get('id') as string;
    const itemId = formData.get("itemId") as string;
    const taskId = formData.get("taskId") as string;
    const name = formData.get("name") as string;
    const price = formData.get("price") as string;
    const store = formData.get("store") as string;
    const comment = formData.get("comment") as string;
    const vatRefundable = formData.get("vatRefundable") === "true"

    if (!name?.trim()) {
        throw new Error("Name is required");
    }

    if (itemId) {
        await prisma.shoppingList.update({
            where: {
                id: parseInt(taskId ?? "-1"),
            },
            data: {
                items: {
                    update: {
                        where: {id: parseInt(itemId ?? "-1")},
                        data: {
                            name: name.trim(),
                            price: price ? parseFloat(price) : null,
                            comment: comment?.trim(),
                            store: store.trim(),
                            vatRefundable: vatRefundable,
                        }
                    }
                }
            },
            include: {items: true}
        })
        revalidatePath(`/tasks/${taskId}/items/${itemId}`);
        revalidatePath("/items")
        redirect(`/tasks/${taskId}`)
    } else {
        await prisma.shoppingList.update({
            where: {
                id: parseInt(id ?? "-1"),
            },
            data: {
                items: {
                    create: {
                        name: name.trim(),
                        price: price ? parseFloat(price) : null,
                        comment: comment?.trim(),
                        store: store.trim(),
                        vatRefundable: vatRefundable,
                    }
                }
            },
            include: {items: true}
        })
        revalidatePath("/items")
        redirect(`/tasks/${id}`)
    }
}

export async function saveDraftItem(formData: FormData) {
    const session = await auth();
    if (!session?.user) {
        redirect("/");
    }
    console.log(formData)
}
