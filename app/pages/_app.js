import React from "react";
import { Provider } from "react-redux";
import App, { Container } from "next/app";
import withRedux from "next-redux-wrapper";

import "bootstrap/scss/bootstrap.scss";
import "../scss/app.scss";

import { store } from "../helpers";
import AlertMessage from "../components/alert";
import TaskCompleteNotification from "../components/task-complete-notification";

export default withRedux(store)(
    class MyApp extends App {
        static async getInitialProps({ Component, ctx }) {
            return {
                pageProps: Component.getInitialProps ? await Component.getInitialProps(ctx) : {}
            };
        }

        render() {
            const { Component, pageProps, store } = this.props;
            return (
                <Container>
                    <Provider store={store}>
                        <TaskCompleteNotification />
                        <AlertMessage />
                        <Component {...pageProps} />
                    </Provider>
                </Container>
            );
        }
    }
);
