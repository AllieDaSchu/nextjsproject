'use client'
import MyForm from '@/components/AddProfile.jsx'
import Wrapper from '@/components/Wrapper.jsx'


function AddProfile () {
    return (
        <Wrapper id="addProfile">
            <MyForm profile={null} />
        </Wrapper>
    )
}

export default AddProfile;