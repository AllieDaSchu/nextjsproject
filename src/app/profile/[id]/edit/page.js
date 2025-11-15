
import MyForm from "@/components/AddProfile.jsx"
import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient()

export default async function EditProfilePage({params}) {

    const {id} = await params;
    const profile = await prisma.profiles.findUnique ({
        where: {
            id: parseInt(id),
        },
    })

    return(
        <>
            <MyForm profile={profile} />
        </>
    )
}