'use client'

import {useState} from "react"
import {useRouter} from "next/navigation"

export default function DeleteButton({id}) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter();
    const handleClicked = async () => {
        setIsDeleting(true)
        setError("")
        try {
            console.log(id)
            const response = await fetch(`/api/profiles/${id}`, {
                method: "DELETE"
            })
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error||"Faield to dDelete profile")
            }
            router.push("/")
        } catch (error) {
            setError(error.message)
            setIsDeleting(false)
            /* if (error.code === "P2002") {
                return Response.json({error: "Profile not found"}, {status: 404})
            } if (error.code === 'P2025') {
                return Response.json({error: "Profile not found"}, {status: 404})
            }
            return Response.json({error: "Failed to update profile"}, {status: 500}) */
        }
    }

    return (
        <>
            <button className="infoButton" onClick={handleClicked} disabled={isDeleting}>Delete</button>
            {error && <p>{error}</p>}
        </>
    )
}