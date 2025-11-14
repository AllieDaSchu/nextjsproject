//import '../style/myForm.css'
import {useRef} from "react"
//import { useEffect, useContext, useReducer, useRef, memo } from 'react';
//import { useNavigate } from "react-router-dom"
//import {initialState, formReducer} from '../reducers/formReducer.js'
import useForm from "../hooks/useFormHook.js"

const stripTags = (s) => String(s ?? "").replace(/<\/?[^>]+>/g, "");
const trimCollapse = (s) =>
    String(s ?? "")
        .trim()
        .replace(/\s+/g, " ");

const MyForm = () => {
    const nameRef = useRef(null)
    const {name, title, email, bio, img, isSubmitting, errors, success, onChange, handleSubmit} = useForm(nameRef)

    

    return (
        <div>
            <form className="form-container" onSubmit={handleSubmit}>
                <h2>Add Profile</h2>
                <label htmlFor="name">Name: </label>
                <input ref={nameRef} type="text" name="name" id="name" required value={name} onChange={onChange} />
                <label htmlFor="title">Title: </label>
                <input type="text" name="title" id="title" required value={title} onChange={onChange} />
                <label htmlFor="email">Email: </label>
                <input type="email" name="email" id="email" required value={email} onChange={onChange} />
                <label htmlFor="bio">Bio: </label>
                <textarea name="bio" id="bio" placeholder="Add bio..." required value={bio} onChange={onChange} />
                <label htmlFor="img">Image: </label>
                <input type="file" name="img" id="img" required accept="image/png, image/jpeg, image/jpg, image/gif" onChange={onChange} />
                {errors && <p className="errors">{errors}</p>}
                <button
                    id="submit"
                    type="submit"
                    disabled={
                        isSubmitting ||
                        !stripTags(trimCollapse(name)) ||
                        !stripTags(trimCollapse(title)) ||
                        !stripTags(trimCollapse(email)) ||
                        !stripTags(trimCollapse(bio)) ||
                        !img }>
                            Add Profile
                            
                        </button>
                {success && <p className="success">{success}</p>}
            </form>
        </div>
        
    )
}

export default MyForm;