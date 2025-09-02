export default async function Task({params}: { params: Promise<{ id: string }> }) {

    const {id} = await params;
    console.log(id)
}