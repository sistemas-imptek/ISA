import React, { Component } from 'react';
import './Documentation.css';

export class Documentation extends Component {

    constructor() {
        super();
        this.state = {};
    }

    render() {
        return (
            <div className="ui-g">
                <div className="ui-g-12">
                    <div className="card docs">
                        <h1>Getting Started</h1>
                        <p>Avalon is an application template for React based on the popular <a href="https://github.com/facebookincubator/create-react-app">create-react-app</a> which allows
                            creating React apps with no configuration. To get started extract the contents of the zip bundle and install the dependencies 
                            with npm or yarn.</p>
<pre>
{
`npm install
`}
</pre>

or 

<pre>
{
`yarn
`}
</pre>

                        <p>Next step is running the application using the start script and navigate to <b>http://localhost:3000/</b> to view the application. 
                        That is it, you may now start with the development of your application using the Avalon template.</p>

<pre>
{
`npm start
`}
</pre>

or 

<pre>
{
`yarn start
`}
</pre>

                        <h1>React Scripts</h1>
                        <p>Following commands are derived from create-app-app.</p>
<pre>
{
`"npm start" or "yarn start": Starts the development server
"npm test" or "yarn test": Runs the tests.
"npm run build" or "yarn run build": Creates a production build.
`}
</pre>

                        <h1>Structure</h1>
                        <p>Avalon consists of 3 main parts; the application layout, layout resources and theme resources for PrimeReact components. <b>App.js</b> inside src folder is the main component containing the template for the base layout
                            whereas required resources for the layout are placed inside the <b>public/assets/layout</b> folder and similarly theme resources are inside <b>public/assets/theme</b> folder.
                        </p>

                        <h1>Template</h1>
                        <p>Main layout is the JSX of the App.js, it is divided into a couple of child components such as topbar, profile, menu and footer. Here is render method of the
                            App.js component that implements the logic such as menu state, layout modes and so on.
                        </p>

<pre>
{
`render() {
    let layoutClassName = classNames('layout-wrapper', {
        'menu-layout-static': this.state.layoutMode !== 'overlay',
        'menu-layout-overlay': this.state.layoutMode === 'overlay',
        'layout-menu-overlay-active': this.state.overlayMenuActive,
        'menu-layout-slim': this.state.layoutMode === 'slim',
        'menu-layout-horizontal': this.state.layoutMode === 'horizontal',
        'layout-menu-static-inactive': this.state.staticMenuDesktopInactive,
        'layout-menu-static-active': this.state.staticMenuMobileActive
    });
    let menuClassName = classNames('layout-menu-container', {'layout-menu-dark': this.state.darkMenu});
    
    return <div className={layoutClassName} onClick={this.onDocumentClick}>
                <div>
                    <AppTopbar profileMode={this.state.profileMode} horizontal={this.props.horizontal} 
                            topbarMenuActive={this.state.topbarMenuActive} activeTopbarItem={this.state.activeTopbarItem}
                            onMenuButtonClick={this.onMenuButtonClick} onTopbarMenuButtonClick={this.onTopbarMenuButtonClick} 
                            onTopbarItemClick={this.onTopbarItemClick} />

                    <div className={menuClassName} onClick={this.onMenuClick}>
                        <div ref={(el) => this.layoutMenuScroller = el} className="nano">
                            <div className="nano-content menu-scroll-content">
                                {(this.state.profileMode === 'inline' && this.state.layoutMode !== 'horizontal') && <AppInlineProfile />}
                                
                                <AppMenu model={this.menu} onMenuItemClick={this.onMenuItemClick} onRootMenuItemClick={this.onRootMenuItemClick} 
                                        layoutMode={this.state.layoutMode} active={this.state.menuActive} /> 
                            </div>
                        </div>
                    </div>
                    
                    <div className="layout-main">
                        {this.props.children || <Dashboard />}
                    </div>
                    
                    <div className="layout-mask"></div>
                    
                    <AppFooter />
                </div>
            </div>;
}
`
}
</pre>

                        <h1>Menu</h1>
                        <p>Menu is a separate component defined in AppMenu.js file based on PrimeReact MenuModel API. In order to define the menuitems,
                            navigate to createMenu() method App.js file and define your own model as a nested structure. Here is the menu component from the demo application.
                            Notice that menu object is bound to the model property of AppMenu component as shown above.</p>
                            
<pre>
{
`createMenu() {
    this.menu = [
        {label: 'Dashboard', icon: 'fa fa-fw fa-home', command: () => { window.location.hash="/"}},
        {
            label: 'Customization', icon: 'fa fa-fw fa-bars' ,badge: '8',
            items: [
                {label: 'Static Menu', icon: 'fa fa-fw fa-bars',  command: () => this.setState({layoutMode: 'static'}) },
                {label: 'Overlay Menu', icon: 'fa fa-fw fa-bars',  command: () => this.setState({layoutMode: 'overlay'}) },
                {label: 'Slim Menu', icon: 'fa fa-fw fa-bars',  command: () => this.setState({layoutMode: 'slim'}) },
                {label: 'Horizontal Menu', icon: 'fa fa-fw fa-bars',  command: () => this.setState({layoutMode: 'horizontal'}) },
                {label: 'Inline Profile', icon: 'fa fa-sun-o fa-fw',  command: () => this.setState({profileMode: 'inline'}) },
                {label: 'Top Profile', icon: 'fa fa-moon-o fa-fw',  command: () => this.setState({profileMode: 'top'}) },
                {label: 'Light Menu', icon: 'fa fa-sun-o fa-fw',  command: () => this.setState({darkMenu: false}) },
                {label: 'Dark Menu', icon: 'fa fa-moon-o fa-fw',  command: () => this.setState({darkMenu: true}) }
            ]
        },
        {
            label: 'Layout Colors', icon: 'fa fa-fw fa-magic',
            items: [
                {
                    label: 'Flat', 
                    icon: 'fa fa-fw fa-circle',
                    items: [
                        {label: 'Blue', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeLayout('blue')}},
                        {label: 'Purple', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeLayout('purple')}},
                        {label: 'Cyan', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeLayout('cyan')}},
                        {label: 'Indigo', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeLayout('indigo')}},
                        {label: 'Teal', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeLayout('teal')}},
                        {label: 'Pink', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeLayout('pink')}},
                        {label: 'Lime', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeLayout('lime')}},
                        {label: 'Green', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeLayout('green')}},
                        {label: 'Amber', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeLayout('amber')}},
                        {label: 'Dark Grey', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeLayout('darkgrey')}},
                    ]
                },
                {
                    label: 'Special', 
                    icon: 'fa fa-fw fa-fire',
                    items: [
                        {label: 'Influenza', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeLayout('influenza', true)}},
                        {label: 'Suzy', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeLayout('suzy', true)}},
                        {label: 'Calm', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeLayout('calm', true)}},
                        {label: 'Crimson', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeLayout('crimson', true)}},
                        {label: 'Night', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeLayout('night', true)}},
                        {label: 'Skyling', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeLayout('skyline', true)}},
                        {label: 'Sunkist', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeLayout('sunkist', true)}},
                        {label: 'Little Leaf', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeLayout('littleleaf', true)}},
                        {label: 'Joomla', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeLayout('joomla', true)}},
                        {label: 'Firewatch', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeLayout('firewatch', true)}}
                    ]
                }
            ]
        },
        {
            label: 'Themes', icon: 'fa fa-fw fa-paint-brush', badge: '5',
            items: [
                {label: 'Blue', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeTheme('blue')}},
                {label: 'Cyan', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeTheme('cyan')}},
                {label: 'Indigo', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeTheme('indigo')}},
                {label: 'Purple', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeTheme('purple')}},
                {label: 'Teal', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeTheme('teal')}},
                {label: 'Orange', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeTheme('orange')}},
                {label: 'Deep Purple', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeTheme('deeppurple')}},
                {label: 'Light Blue', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeTheme('lightblue')}},
                {label: 'Green', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeTheme('green')}},
                {label: 'Light Green', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeTheme('lightgreen')}},
                {label: 'Lime', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeTheme('lime')}},
                {label: 'Amber', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeTheme('amber')}},
                {label: 'Brown', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeTheme('brown')}},
                {label: 'Dark Grey', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeTheme('darkgrey')}},
            ]
        },
        {
            label: 'Components', icon: 'fa fa-fw fa-sitemap',
            items: [
                {label: 'Sample Page', icon: 'fa fa-fw fa-columns', command: () => { window.location.hash="/sample"; }},
                {label: 'Forms', icon: 'fa fa-fw fa-code', command: () => { window.location.hash="/forms"; }},
                {label: 'Data', icon: 'fa fa-fw fa-table', command: () => { window.location.hash="/data"; }},
                {label: 'Panels', icon: 'fa fa-fw fa-list-alt', command: () => { window.location.hash="/panels"; }},
                {label: 'Overlays', icon: 'fa fa-fw fa-square', command: () => { window.location.hash="/overlays"; }},
                {label: 'Menus', icon: 'fa fa-fw fa-minus-square-o', command: () => { window.location.hash="/menus"; }},
                {label: 'Messages', icon: 'fa fa-fw fa-circle-o-notch', command: () => { window.location.hash="/messages"; }},
                {label: 'Charts', icon: 'fa fa-fw fa-area-chart', command: () => { window.location.hash="/charts"; }},
                {label: 'Misc', icon: 'fa fa-fw fa-user-secret', command: () => { window.location.hash="/misc"; }}
            ]
        },
        {
            label: 'Template Pages', icon: 'fa fa-fw fa-life-saver',
            items: [
                {label: 'Empty Page', icon: 'fa fa-fw fa-square-o', command: () => { window.location.hash="/empty"; }},
                {label: 'Landing', icon: 'fa fa-fw fa-certificate', url: 'assets/pages/landing.html', target: '_blank'},
                {label: 'Login', icon: 'fa fa-fw fa-sign-in', url: 'assets/pages/login.html', target: '_blank'},
                {label: 'Error', icon: 'fa fa-fw fa-exclamation-circle', url: 'assets/pages/error.html', target: '_blank'},
                {label: 'Not Found', icon: 'fa fa-fw fa-times', url: 'assets/pages/notfound.html', target: '_blank'},
                {label: 'Access Denied', icon: 'fa fa-fw fa-exclamation-triangle', url: 'assets/pages/access.html', target: '_blank'}
            ]
        },
        {
            label: 'Menu Hierarchy', icon: 'fa fa-fw fa-gg',
            items: [
                {
                    label: 'Submenu 1', icon: 'fa fa-fw fa-sign-in',
                    items: [
                        {
                            label: 'Submenu 1.1', icon: 'fa fa-fw fa-sign-in',
                            items: [
                                {label: 'Submenu 1.1.1', icon: 'fa fa-fw fa-sign-in'},
                                {label: 'Submenu 1.1.2', icon: 'fa fa-fw fa-sign-in'},
                                {label: 'Submenu 1.1.3', icon: 'fa fa-fw fa-sign-in'},
                            ]
                        },
                        {
                            label: 'Submenu 1.2', icon: 'fa fa-fw fa-sign-in',
                            items: [
                                {label: 'Submenu 1.2.1', icon: 'fa fa-fw fa-sign-in'},
                                {label: 'Submenu 1.2.2', icon: 'fa fa-fw fa-sign-in'}
                            ]
                        },
                    ]
                },
                {
                    label: 'Submenu 2', icon: 'fa fa-fw fa-sign-in',
                    items: [
                        {
                            label: 'Submenu 2.1', icon: 'fa fa-fw fa-sign-in',
                            items: [
                                {label: 'Submenu 2.1.1', icon: 'fa fa-fw fa-sign-in'},
                                {label: 'Submenu 2.1.2', icon: 'fa fa-fw fa-sign-in'},
                                {label: 'Submenu 2.1.3', icon: 'fa fa-fw fa-sign-in'},
                            ]
                        },
                        {
                            label: 'Submenu 2.2', icon: 'fa fa-fw fa-sign-in',
                            items: [
                                {label: 'Submenu 2.2.1', icon: 'fa fa-fw fa-sign-in'},
                                {label: 'Submenu 2.2.2', icon: 'fa fa-fw fa-sign-in'}
                            ]
                        },
                    ]
                }
            ]
        },
        {label: 'Utils', icon: 'fa fa-fw fa-wrench', command: () => { window.location.hash="/utils"; }},
        {label: 'Documentation', icon: 'fa fa-fw fa-book', command: () => { window.location.hash="/documentation"; }}
    ];
}
    
`}
</pre>

                        <p>Dependencies of Avalon are listed below and needs to be added to package.json. Only required
                        dependency is PrimeReact where optional dependencies exist to enable certain components in PrimeReact.</p>
                        
<pre>
{
`"primereact": "^1.0.0",         //required: PrimeReact components
"font-awesome": "^4.7.0"         //required: Icons
"react-router": "^3.0.0",        //optional: Router
"jquery": "^3.1.1",              //optional: schedule and nanoscroller for menu
"chart.js": "^2.4.0",            //optional: charts
"fullcalendar": "^3.1.0",        //optional: schedule
"moment": "^2.17.1",             //optional: chart and schedule
"quill": "^1.1.8",               //optional: editor
`
}
</pre>

                        <p>Last part is adding theme and layout css files, in the demo app they are defined using link tags in index.html so the demo can switch them on
                            the fly by changing the path however if this is not a requirement, you may also import them in App.js so that webpack adds them to the bundle.</p>

                        <h1>Theme</h1>    
                        <p>Avalon provides 15 PrimeReact themes out of the box, setup of a theme simple including the css of theme to your page that are located inside resources/theme folder.</p>
                        
                        <ul>
                            <li>theme-amber</li>
                            <li>theme-blue</li>
                            <li>theme-brown</li>
                            <li>theme-cyan</li>
                            <li>theme-darkgrey</li>
                            <li>theme-deeppurple</li>
                            <li>theme-green</li>
                            <li>theme-indigo</li>
                            <li>theme-lightblue</li>
                            <li>theme-lightgreen</li>
                            <li>theme-lime</li>
                            <li>theme-orange</li>
                            <li>theme-pink</li>
                            <li>theme-purple</li>
                            <li>theme-teal</li>
                        </ul>

                        <p>A custom theme can be developed by the following steps.</p>
                        <ul>
                            <li>Choose a custom theme name such as theme-myown.</li>
                            <li>Create a file named theme-myown.scss under <i>public/assets/theme folder</i>.</li>
                            <li>Define the variables listed below and import the <i>../sass/theme/_theme.scss</i> file.</li>
                            <li>Build the scss to generate css</li>
                            <li>Include the generated theme.css to your application.</li>
                        </ul>

                        <p>Here are the variables required to create a theme.</p>
                            
<pre>
{
`$primaryColor:#337ab7;
$primaryTextColor:#ffffff;
$inputFocusBorderColor:#66afe9;
$highlightBgColor:#337ab7;
$highlightTextColor:#ffffff;
$headerBgColor:#f5f5f5;
$headerHoverBgColor:#dcdcdc;
$headerHoverBorderColor:#c4c4c4;
$headerTextColor:#292B2C;
$headerBorderColor:#dddddd;
$headerIconColor:#999999;
$headerIconHoverColor:#777777;
$datableEvenRowBgColor:#f9f9f9;
$datatableHoverBgColor:#f5f5f5;

@import '../sass/theme/_theme';
`
}
</pre> 

                        <p> An example sass command to compile the css would be;</p>
                            
<pre>
sass public/assets/theme/theme-myown.scss public/assets/theme/theme-myown.css 
</pre> 

                        <p>Watch mode is handy to avoid compiling everytime when a change is made, instead use the following command
                        so that sass generates the file whenever you make a customization. This builds all css files whenever a change is made to any scss file.</p>
<pre>
sass -w src/assets/ --sourcemap=none
</pre>

                        <p>Same can also be applied to layout itself;</p>
                        <ul>
                            <li>Choose a layout name such as layout-myown.</li>
                            <li>Create an empty file named layout-myown.scss inside <i>assets/layout/css</i> folder.</li>
                            <li>Define the variables listed below and import the <i>../sass/layout/_layout.scss</i> file.</li>
                            <li>Build the scss to generate css</li>
                            <li>Serve the css by importing it using a link tag or a bundler.</li>
                        </ul>

                        <p>Here are the variables required to create a layout, you may need to change the last line according to the 
                            relative path of the sass folder in your application.</p>

<pre>
{
`$topbarLeftGradientStartBgColor:#ff8f00;
$topbarLeftGradientEndBgColor:#ffb300;
$topbarRightGradientStartBgColor:#ff8f00;
$topbarRightGradientEndBgColor:#ffb300;
$topbarTextColor:#ffffff;
$menuGradientStartBgColor:#ffffff;
$menuGradientEndBgColor:#ffffff;
$menuitemHoverBgColor:#e8e8e8;
$menuitemActiveColor: #ff8f00;
$menuitemActiveBgColor:#e8e8e8;
$menuButtonBgColor:#ffffff;
$menuButtonColor:#ff6f00;
$badgeBgColor:#3eb839;
$badgeColor:#ffffff;
$darkMenuGradientStartBgColor:#363a41;
$darkMenuGradientEndBgColor:#363a41;
$darkMenuHoverBgColor:#4a4d54;
$darkMenuMenuitemColor:#ffffff;
$darkMenuMenuitemActiveColor:#ffe57f;
$darkMenuMenuitemActiveBgColor:#282b30;

@import '../../sass/layout/_layout';
`
}
</pre> 

                        <h1>Common SASS Variables</h1>
                        <p>In case you would like to customize the shared variables, the _variables.scss files are where the options are defined for layout and theme.</p>

                        <h3>sass/variables/_commons.scss</h3>
<pre>
{
`$fontFamily:"Helvetica Neue",Helvetica,Arial,sans-serif;
$fontSize:14px;
$textColor:#292B2C;
$textSecondaryColor:#777777;
$borderRadius:4px;
$dividerColor:#e5e5e5;
$transitionDuration:.3s;
$disabledBgColor:#eeeeee;

/* Predefined Colors */
$lightestGray:#f5f5f5;
$lightGray:#cccccc;
$gray:#999999;
$darkGray:#777777;
$white:#ffffff;

$blue:#337ab7;
$purple:#6F5499;
$orange:#FF8800;
$lightBlue:#039be5;
$pink:#d81b60;
$green:#7cb342;
$teal:#2EA563;
$black:#000000;
$yellow:#ffb300;
`
}
</pre> 

                        <h3>sass/variables/_layout.scss</h3>
<pre>
{
`@import './_common';

$bodyBgColor: #EEF2F6;
$menuHoverBgColor:#f4f4f4;
`
}
</pre>   

                        <h3>sass/variables/_theme.scss</h3>
<pre>
{
`@import './_common';

/* Icons */
$iconFontSize:1em;
$iconWidth:1.1em;

/* Error */
$errorColor:#a94442;
$disabledColor:#eeeeee;

/*  Invalid Input */
$inputInvalidBorderColor:#b94a48;
$inputInvalidBgColor:#ffffff;

/* Headers */
$headerPadding: 0.714em 1.071em;

/* Contents */
$contentPadding: 1.071em;
$contentBorderColor:#dddddd;
$contentBgColor:#ffffff;
$contentLineHeight:1.43;

/* Forms */
$inputBgColor:#ffffff;
$inputPadding: 0.429em 0.857em;
$inputBorderColor:#cccccc;
$inputHoverBorderColor:#cccccc;
$inputGroupAddonBgColor:#e6e6e6;

/* Buttons */
$buttonTextColor:#ffffff;
$toggleButtonBgColor:#ffffff;
$toggleButtonBorderColor:#cccccc;
$toggleButtonHoverBgColor:#e6e6e6;
$toggleButtonHoverBorderColor:#adadad;

/* List Items */
$listItemPadding:0.429em 1.429em;
$listItemHoverBgColor:#f5f5f5;
$listItemHoverTextColor:#292B2C;

/* Messages */
$infoMessageBgColor:#d9edf7;
$infoMessageBorderColor:#bce8f1;
$infoMessageTextColor:#31708f;
$successMessageBgColor:#dff0d8;
$successMessageBorderColor:#d6e9c6;
$successMessageTextColor:#3c763d;
$warnMessageBgColor:#fcf8e3;
$warnMessageBorderColor:#faebcc;
$warnMessageTextColor:#8a6d3b;
$errorMessageBgColor:#f2dede;
$errorMessageBorderColor:#ebccd1;
$errorMessageTextColor:#a94442;
$fatalMessageBgColor:#999999;
$fatalMessageBorderColor:#6b6b6b;
$fatalMessageTextColor:#ffffff;

/* Overlays */
$overlayBorderColor:#cccccc;

/* Data */
$datatableHeaderBgColor:#ffffff;
$datatableFooterBgColor:#ffffff;
$datatableCellBorderColor:#dddddd;
$datatableCellPadding:0.643em;
$paginatorBgColor:#ffffff;

/* TabView */
$tabHeaderPadding:.6em 1em;

/* Panel */
$panelContentBorderColor:#DCE1E7;
`
}
</pre>

                        <h1>Menu Item Badges</h1>
                        <p>Badges are numerical indicators associated with a link.
                           The badge property is the value of the badge and badgeStyleClass is style class of the badge.</p>
<pre>
label: 'Components', icon: 'list', badge: '2', badgeClassName: 'red-badge'
</pre>  
                        <p>Default badge uses the accent color of avalon layout and there are three more alternative colors.</p>
                        <ul>
                            <li>red-badge</li>
                            <li>purple-badge</li>
                            <li>teal-badge</li>
                        </ul>
                                                
                        <h1>Menu Modes</h1>
                        <p>Menu has 4 modes, static, overlay, slim and horizontal. Main layout container element in App.js is used to define which mode to use by adding specific classes. List
                        below indicates the style classes for each mode.</p>
                        
                        <ul>
                            <li>Static: "layout-wrapper menu-layout-static"</li>
                            <li>Overlay: "layout-wrapper menu-layout-overlay"</li>
                            <li>Slim: "layout-wrapper menu-layout-static menu-layout-slim"</li>
                            <li>Horizontal: "layout-wrapper menu-layout-static menu-layout-horizontal"</li>
                        </ul>

                        <p>For example to create a horizontal menu, the div element should be in following form;</p>
<pre>
&lt;div className="layout-wrapper menu-layout-static menu-layout-horizontal"&gt;
</pre>            

                        <p>It is also possible to leave the choice to the user by keeping the preference at a component and using an expression to bind it so that user can switch between modes. Sample
                        application has an example implementation of such use case. Refer to App.js for an example.</p>          

                        <h1>Dark Menu</h1>
                        <p>Default color scheme of menu is light and alternative dark mode can be activated by adding <i>layout-menu-dark</i> style class to the menu container.</p>

<pre>
&lt;div className="layout-menu-container layout-menu-dark"&gt;
</pre>

                        <h1>Profile Modes</h1>
                        <p>There are two possible locations for the user profile menu, first option is inline located inside the main menu and second option is the topbar menu. For inline mode,
                        profile content should be placed above the menu and for inline mode content goes in topbar-items list. The sample demo application provides examples for
                        both cases.</p>
                                
                        <h1>Grid CSS</h1>
                        <p>Avalon uses PrimeReact Grid CSS (ui-g-*) throughout the samples, although any Grid library can be used we suggest using Grid CSS as your layout framework as it is well tested and supported by PrimeReact. Grid CSS is
                        available inside primereact.min.css.</p> 

                        <h1>Customizing Styles</h1>
                        <p>It is suggested to write your customizations in <i>App.css</i> fileinstead of adding them to the
                            scss files under sass folders to avoid maintenance issues after an update.</p>
                        </div>
                    </div>
                </div>
        )
    }
}