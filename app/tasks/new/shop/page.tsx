import Form from "next/form";
import {createShop} from "@/app/actions";
import {InputForm} from "@/components/item";
import {SubmitButton} from "@/components/SubmitButton";

export default function CreateShop() {
    return (
        <>
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-sm border-gray-100 py-6 ">
                        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                            Create a new shop
                        </h1>
                        <p className="text-sm text-gray-500 mb-6">
                            Fill in the details below to create your shop.
                        </p>

                        <Form
                            action={createShop}
                            className="space-y-6"
                        >

                            <InputForm
                                type={"text"}
                                id={"name"}
                                label={"Shop name"}
                                placeholder={"Enter shop name"}
                            />
                            <div className="flex justify-end px-4">
                                <SubmitButton/>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    )
}

