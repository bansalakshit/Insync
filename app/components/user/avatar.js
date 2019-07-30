import React from 'react'

const Avatar = (props) => {

    return (
        <img src={props.img ? props.img : '/static/img/no-image.png'} />
    )

}

export default Avatar