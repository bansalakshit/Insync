
import React from 'react';
import { Container, Row } from 'reactstrap';
import { connect } from 'react-redux'
import { withRouter } from 'next/router'

import Head from './head'
import Header from './header'
import Footer from './footer'

class Layout extends React.Component {

    componentDidMount() {
        if(this.props.private && !this.props.loggedIn)
            localStorage.setItem('redirect', this.props.router.asPath)
    }

    render() {
        const { children } = this.props;

        return (
            <React.Fragment>
                <Head />
                <Header />
                <Container>
                    { children }
                </Container>
                <Footer />
            </React.Fragment>
        )

    }

    // render() {
    //                         const { children } = this.props;

        
    //                         if(this.props.private && !this.props.loggedIn) {
    //                             return (
    //                                 <React.Fragment>
    //                                     <Head />
    //                                     <Header />
    //                                     <Container>
    //                                         <Row className="page-content login">
    //                                             <Login />
    //                                         </Row>
    //                                     </Container>
    //                                 </React.Fragment>
    //                             )
    //                         } else {
    //                             return (
    //                                 <React.Fragment>
    //                                     <Head />
    //                                     <Header />
    //                                     <Container>
    //                                         { children }
    //                                     </Container>
    //                                 </React.Fragment>
    //                             )
    //                         }

    
    // }

}

function mapStateToProps(state) {
    const { loggedIn } = state.authentication
    return {
        loggedIn: loggedIn
    }
}

export default withRouter(connect(mapStateToProps)(Layout))