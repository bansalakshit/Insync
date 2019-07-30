import React from 'react'
import { Provider } from 'react-redux'
import App, { Container } from 'next/app'
import withRedux from 'next-redux-wrapper'
import { store } from '../helpers'
import Layout from '../components/layout'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../css/styles.css'
import '../css/chat.css'

export default withRedux(store)(
    class MyApp extends App {
        static async getInitialProps({ Component, ctx }) {
            return {
                pageProps: Component.getInitialProps ?
                    await Component.getInitialProps(ctx) :
                    {}
            }
        }

        render() {
            const { Component, pageProps, store } = this.props
            return ( 
                <React.Fragment>

                    <script src="http://cdn.emitter.io/js/emitter.min.js"></script>
                    
                    <Container >
                        <Provider store = { store } >
                            <Layout>
                                <Component { ...pageProps } /> 
                            </Layout>
                        </Provider> 
                    </Container>
                    
                </React.Fragment>
            )
        }
    }
)