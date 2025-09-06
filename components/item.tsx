import {Item} from "@prisma/client";

export function ItemForm({item}: ItemFormProps) {
    console.log(item);
}

type ItemFormProps = {
    item?: Item;
}