import React from 'react';

const Card = ({name, title, email, bio, img}) => {
    console.log("Card Rendered")
    return (
        <div className="column">
            <div className="card">
                <img className="profile-image" src={img} />
                <h2 className="name">{name}</h2>
                <h3 className="title">{title}</h3>
                <h5 className="email">{email}</h5>
                <p className="desc">{bio}</p>
            </div>
        </div>
    )
}

export default Card;