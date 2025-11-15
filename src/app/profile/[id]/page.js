import Image from 'next/image';
import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient()
import Link from "next/link"
import DeleteButton from "@/components/DeleteButton.js"
import Wrapper from "@/components/Wrapper.jsx"

async function fetchProfileData(id) {
    const profile = prisma.profiles.findUnique({ 
        where: {
            id: parseInt(id), 
        },
    });

    if (!profile) {
        throw new Error("Profile Not Found")
    }
    return profile;
}

export default async function generateProfile({params}) {
    const {id} = await params;

    const profile = await fetchProfileData(id);
    console.log(profile)

    return (
        profile ? 
        <Wrapper>
            <Link href="/" className="homePage">&lt; Back to home page</Link>
            <div className="individualProfileContent">
                <div className="individualColumns">
                    <div className="imgContainer">
                        <img srcSet={profile.image_url} />
                    </div>
                    <div className="infoContainer">
                        <h1>Profile of {profile.name}</h1>
                        <p>{profile.title}</p>
                        <p>{profile.email}</p>
                        <p>{profile.bio}</p>
                    </div>
                </div>
                <div className="btnContainer">
                    <Link href={`/profile/${id}/edit`} className="infoButton">Edit Profile</Link>
                    <DeleteButton id={id} />
                </div>
            </div>
        </Wrapper>
        
        : 
        <div>
            <p>Loading...</p>
        </div>
    )
}