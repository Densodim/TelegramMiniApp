import {Item, ShoppingList} from "@prisma/client";
import Link from "next/link";
import Form from "next/form";
import {publishTask} from "@/app/actions";
import prisma from "@/lib/prisma";
import {SubmitButton} from "@/components/SubmitButton";

export async function ItemForm({task, item}: ItemFormProps) {
    const shoppingList = await prisma.shoppingList.findMany({})
    console.log(item);
    if (!task || !item || !shoppingList) {
        return <p>No item found</p>;
    }

    return (
        <>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    {!item ? "Create New Item" : "Edit Item"}
                </h1>
                {!!item && (
                    <Link href={`/tasks/${task.id}/items/${item.id}`}
                          className="text-gray-600 hover:text-gray-800 font-medium transition-colors">
                        Cancel
                    </Link>
                )}
            </div>
            <div className="bg-white rounded-xl shadow-sm border-gray-100 p-6">
                <Form action={publishTask} className="space-y-6">
                    {task && <input type="hidden" name="itemId" value={item.id}/>}
                    {task && <input type="hidden" name="taskId" value={task.id}/>}

                    <InputForm type={'text'} id={"name"} defaultValue={item.name} required={true}
                               placeholder={"Enter your product name"} label={"Product Name"}/>
                    <InputForm type={"number"} id={"price"} defaultValue={item.price} label={"Price"}/>
                    <InputForm type={"select"} id={""} defaultValue={item.store} label={"Select Store"}
                               option={shoppingList}/>
                    <InputForm type={"text"} id={"comment"} label={"Comment"} defaultValue={item.comment}
                               placeholder={"Enter your comment"}/>
                    <CheckboxForm id={"vatRefundable"} label={"vatRefundable"} defaultChecked={item.vatRefundable}/>
                    <div className="flex justify-end px-4">
                        <SubmitButton isPublished={item && item.published}/>
                    </div>
                </Form>
            </div>
        </>
    )
}


function InputForm({type, placeholder, id, defaultValue, required, label, option}: InputFormProps) {
    return (
        <>
            <div>
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                {type === "select" ? (
                    <select
                        id={id}
                        name={id}
                        required={required}
                        defaultValue={defaultValue ?? ""}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                    >
                        <option value="" disabled>-- Select an Store --</option>
                        {option?.map((option) => (
                            <option key={option.id} value={option.name}>{option.name}</option>
                        ))}
                    </select>
                ) : (
                    <input
                        type={type}
                        id={id}
                        name={id}
                        required={required}
                        defaultValue={defaultValue ?? ""}
                        placeholder={placeholder}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                    />
                )}
            </div>
        </>
    )
}


function CheckboxForm({id, label, defaultChecked}: CheckboxFormProps) {
    return (
        <div className="flex items-center gap-2">
            <input
                type="checkbox"
                id={id}
                name={id}
                defaultChecked={defaultChecked}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor={id} className="text-sm font-medium text-gray-700">
                {label}
            </label>
        </div>
    );
}


type ItemFormProps = {
    task?: ShoppingList;
    item?: Item;
}

type InputFormProps = {
    type: "text" | "number" | "select";
    id: string;
    label: string;
    required?: boolean;
    placeholder?: string;
    defaultValue: string | number | null;
    option?: ShoppingList[];
}

type CheckboxFormProps = {
    id: string;
    label: string;
    defaultChecked?: boolean;
};