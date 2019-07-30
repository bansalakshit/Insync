import React from 'react'
import { Button } from 'reactstrap'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

import { apiConfig } from '../../config'
import copy from 'copy-text-to-clipboard'

class InviteLink extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            url: '',
            caption: 'Copy'
        }

        this.doCopy = this.doCopy.bind(this)
    }

    componentWillMount() {
        this.setState({
            url: `${apiConfig.rootUrl}/join?j=${this.props.jobId}`
        })
    }

    doCopy() {
        if(copy(this.state.url)) {
            this.setState({caption: 'Copied'})
            setTimeout(() => {
                this.setState({caption: 'Copy'})
            }, 2000)
        }
    }

    render() {
        return (
            <Button onClick={this.doCopy}> 
                <FontAwesomeIcon
                    icon={faCopy}
                />{' '}
                {this.state.caption}
            </Button>
        )
    }

}

export default InviteLink
