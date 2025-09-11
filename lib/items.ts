import prisma from "@/lib/prisma";


export async function saveOrUpdateItem({
                                           itemId,
                                           name,
                                           price,
                                           comment,
                                           vatRefundable,
                                           listId,
                                           published,
                                       }: {
    itemId?: string;
    name: string;
    price?: string;
    comment?: string;
    vatRefundable: boolean;
    listId: number;
    published: boolean;
}) {
    if (itemId) {
        return prisma.item.update({
            where: {id: parseInt(itemId, 10)},
            data: {
                name: name.trim(),
                price: price ? parseFloat(price) : null,
                comment: comment?.trim() ?? null,
                vatRefundable,
                published,
                listId,
            },
        });
    } else {
        return prisma.item.create({
            data: {
                name: name.trim(),
                price: price ? parseFloat(price) : null,
                comment: comment?.trim() ?? null,
                vatRefundable,
                published,
                listId,
            },
        });
    }
}