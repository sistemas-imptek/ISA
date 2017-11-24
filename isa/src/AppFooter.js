import React, { Component } from 'react';

export class AppFooter extends Component {

    render() {
        return  <div className="layout-footer">
                    <span className="footer-text-left">
                        <img alt="Logo" src="assets/layout/images/logo-dark.png" />
                    </span>
                    <span className="footer-text-right">
                        <a><i className="fa fa-facebook"></i></a>
                        <a><i className="fa fa-twitter"></i></a>
                        <a><i className="fa fa-github"></i></a>
                    </span>
                </div>
    }
}