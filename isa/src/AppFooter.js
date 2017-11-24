import React, { Component } from 'react';

export class AppFooter extends Component {

    render() {
        return  <div className="layout-footer">
                    <span className="footer-text-left">
                        <img alt="Logo" src="assets/layout/images/logo-imptek.svg" />
                    </span>
                    <span className="footer-text-right">
                        <a href="https://www.facebook.com/Imptek/" target="_blank"><i className="fa fa-facebook"></i></a>
                        <a href="https://www.youtube.com/channel/UCQDmw6T0fwrel1ENc_g9e1Q" target="_blank"><i className="fa fa-youtube-play"></i></a>                        
                        <a href="https://twitter.com/Imptek_Ecuador" target="_blank"><i className="fa fa-twitter"></i></a>
                        <a href="https://www.linkedin.com/company/3639767" target="_blank"><i className="fa fa-linkedin"></i></a>
                        <a href="https://www.instagram.com/imptek_ecuador/" target="_blank"><i className="fa fa-instagram"></i></a>
                    </span>
                </div>
    }
}