import {useContext, useReducer, useState, useEffect} from 'react'
//import ProfilesContext from '../contexts/ProfilesContext.jsx'
//import {initialState, formReducer} from '../reducers/formReducer.js'
import {useRouter} from "next/navigation"

const stripTags = (s) => String(s ?? "").replace(/<\/?[^>]+>/g, "");
const trimCollapse = (s) =>
    String(s ?? "")
        .trim()
        .replace(/\s+/g, " ");

const initialValues =  {
    name: "",
    title: "",
    email: "",
    bio: "",
    img: null,
    existingImgURL: ""
}

const useForm = ({ initialData }) => {
    const router = useRouter();

    const [values, setValues] = useState(initialValues)
    const [errors, setErrors] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState("")

    useEffect(() => {
        if (!initialData) return

        setValues ({
            name: initialData.name,
            title: initialData.title,
            email: initialData.email,
            bio: initialData.bio,
            img: null, 
            existingImgURL: initialData.image_url
        });
    }, [initialData?.id])
    
    const {name, title, email, bio, img, existingImgURL} = values

    const onChange = (event) => {
        if (event.target.name === "img") {
            const file = event.target.files[0];
           const isFileOk = file && file.size < 1024*1024
           if (isFileOk) {
            setValues({...values, [event.target.name]: file})
           } else {
            setErrors("File size must be less than 1MB")
           }
        } else {
            const {name, value} = event.target;
            setValues({...values, [name]: value})
            setErrors("")
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget
        setIsSubmitting(true)
        try {
            const formData = new FormData()
            formData.append("name", stripTags(trimCollapse(name)))
            formData.append("title", stripTags(trimCollapse(title)))
            formData.append("email", stripTags(trimCollapse(email)))
            formData.append("bio", stripTags(bio).trim())
            if (img) {
                formData.append("img", img)
            }
            if (existingImgURL) {
                formData.append("existingImgURL", existingImgURL)
            }
            
            const method = initialData?.id ? "PUT" : "POST";
            const fetchURL = initialData?.id ? `/api/profiles/${initialData.id}` : "/api/profiles"

            const response = await fetch(fetchURL, {
                method: method,
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error||"Failed to submit form")
            }

            setIsSubmitting(false)
            setSuccess("Profiles added successfully")
            
            form.reset();
            if (!initialData?.id) {
                setValues(initialValues)
            }
            const fileInput = document.getElementById("img")
            if (fileInput) {
                fileInput.value = "";
            }
            const redirect = initialData?.id ? `/profile/${initialData.id}` : "/"
            console.log(redirect)
            setTimeout(() => {
                setSuccess("")
                router.push(redirect, {replace: true})
            }, 100)
        } catch (error) {
            setErrors(error.message || "There is an error")
        } finally {
            setIsSubmitting(false)
        }
    };
    return {name, title, email, bio, img, isSubmitting, errors, success, onChange, handleSubmit, existingImgURL}
}

export default useForm;