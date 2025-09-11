"use server";

import {auth} from "@/auth";
import prisma from "@/lib/prisma";
import {containsProfanity} from "@/lib/utils";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {saveOrUpdateItem} from "@/lib/items";

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

async function baseSaveItem(formData: FormData, published: boolean) {
    const session = await auth();
    if (!session?.user) {
        redirect("/");
    }

    const itemId = formData.get("itemId") as string;
    const taskId = formData.get("taskId") as string;
    const name = formData.get("name") as string;
    const price = formData.get("price") as string;
    const storeId = Number(formData.get("store"));
    const comment = formData.get("comment") as string;
    const vatRefundable = formData.get("vatRefundable") === "true"

    if (!name?.trim()) {
        throw new Error("Name is required");
    }

    const storeName = await prisma.store.findFirst({
        where: {
            id: storeId
        }
    })

    let shoppingList = await prisma.shoppingList.findFirst({
        where: {
            storeId,
            user: {email: session.user.email!},
        }
    })

    if (!shoppingList) {
        shoppingList = await prisma.shoppingList.create({
            data: {
                name: storeName?.name ?? '',
                storeId,
                userId: Number(session.user.id),
            },
        });
    }


    const listId = shoppingList.id;

    await saveOrUpdateItem({
        itemId: itemId ?? undefined,
        listId,
        name,
        price,
        comment,
        vatRefundable,
        published
    })

    if (taskId) {
        revalidatePath("/items")
        redirect(`/tasks/${taskId}`);
    } else {
        revalidatePath("/items")
        redirect(`/tasks`)
    }
}


export async function saveDraftItem(formData: FormData) {
    return baseSaveItem(formData, false)
}

export async function publishTask(formData: FormData) {
    return baseSaveItem(formData, true)
}

export async function deleteItem(itemId: number, taskId: number) {
    await prisma.item.delete({
        where: {id: itemId}
    })
    revalidatePath("/tasks")
    revalidatePath(`/tasks/${taskId}`);
}
