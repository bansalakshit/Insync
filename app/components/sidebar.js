import React from 'react'
import { Media, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import classnames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

import SidebarTasksList from '../components/sidebar-tasks-list'
import Chat from '../components/chat/chat'
import UnseenMessages from '../components/chat/unseen-messages'

class LiveSidebar extends React.Component {

    constructor(props) {
        super(props)
        this.close = this.close.bind(this)
        this.toggle = this.toggle.bind(this)
        this.state = {
            activeTab: 'tasks',
            width: {
                width: '500px'
            }
        }
    }

    componentDidMount() {
        if(screen.width < 500)
            this.setState({
                width: {
                    width: '100%'
                }
            })
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            })
        }
    }

    close() {
        this.props.closeCallback()
    }

    render() {
        return (
            <div className="live-sidebar" style={this.state.width}>
                <span className="pointer btn-close" onClick={this.close}><FontAwesomeIcon icon={faTimesCircle}/></span>
                <Media className="user-info">
                    <Media>
                        <img src={this.props.user && this.props.user.img ? this.props.user.img : 'static/img/no-image.png'} />
                    </Media>
                    <Media body>
                        <Media heading>
                            {this.props.user.first_name} {this.props.user.last_name}
                        </Media>
                    </Media>
                </Media>
                <br />
                <div className="tasks-list">
                    <Nav tabs>
                        <NavItem className="pointer">
                            <NavLink
                            className={classnames({ active: this.state.activeTab === 'tasks' })}
                            onClick={() => { this.toggle('tasks'); }}
                            >
                            Tasks
                            </NavLink>
                        </NavItem>
                        <NavItem className="pointer">
                            <NavLink
                            className={classnames({ active: this.state.activeTab === 'chat' })}
                            onClick={() => { this.toggle('chat'); }}
                            >
                            Chat <UnseenMessages 
                                    userId={this.props.user._id}
                                    jobId={this.props.jobId}
                                />
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <div className="sidebar-content">
                            {
                                (()=> {
                                    if(this.state.activeTab === 'tasks')
                                        return <SidebarTasksList
                                                    userId={this.props.user._id}
                                                />
                                    if(this.state.activeTab === 'chat')
                                        return <Chat
                                                    userId={this.props.user._id}
                                                    jobId={this.props.jobId}
                                                />
                                })()
                            }

                    </div>
                </div>
            </div>
        )
    }

}


export default LiveSidebar
