import React from 'react'
import { ListGroup, ListGroupItem } from 'reactstrap'

const Referrals = (props) => {

    return (
        <ListGroup>
            {props.list.map((_ref, _index) => {
                return <ListGroupItem key={_ref._id} className="justify-content-between">{_ref.email}</ListGroupItem>
            })}
        </ListGroup>
    )

}

export default Referrals

