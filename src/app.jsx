import React from 'react';
import {Router, Link, createHistory, LocationProvider, Redirect, navigate} from '@reach/router';
import createHashSource from 'hash-source';
import Page1 from './components/Page1';
import Page2 from './components/Page2';

import Player from './components/Player';
import 'bootstrap/dist/css/bootstrap.min.css';
import EventBus from 'eventing-bus';

// use memory-based history for routing in Electron
const history = createHistory(createHashSource());

EventBus.on('getResults', (searchTerms) => {
    fetch(`http://localhost:1337/api/search/${searchTerms}`)
      .then((response) => {
        return response.json();
      })
      .then((myJson) => {
        console.log(myJson);

        if (!myJson.error) {
          EventBus.publish('results', {searchTerms, results:myJson}) 
        }
      });
});

// dummy pages
const Home = () => <Redirect to="/search/Music" />;
const NotFound = ({location}) => (
  <div className="alert-danger p-3">
    Path not found: <strong>{location.pathname}</strong>
  </div>
);

// Bootstrap nav link with active class
const NavLink = ({label, path}) => (
  <li className="nav-item">
    <Link
      to={path}
      getProps={({isCurrent}) => {
        return {
          className: `nav-link${isCurrent ? ' active' : ''}`
        };
      }}
    >
      {label}
    </Link>
  </li>
);

const Header = (props) => (
  <header className="header">
    <div className="navigation-trigger hidden-xl-up" data-sa-action="aside-open" data-sa-target=".sidebar">
      <i className="zmdi zmdi-menu"></i>
    </div>

    <div className="logo hidden-sm-down">
      <h1>
        <a href="index-2.html">HXCMusic</a>
      </h1>
    </div>

    <form className="search" onSubmit={async event => {
      debugger;
      event.preventDefault();
      EventBus.publish('getResults', props.searchTerms);
      //navigate("/search", { searchTerms: props.searchTerms })
      navigate(`/search/${props.searchTerms}`)
      }}>
      <div className="search__inner">
        <input type="text" className="search__text" value={props.searchTerms} onChange={props.onChange} placeholder="Search for people, files, documents..." />
        <i className="zmdi zmdi-search search__helper" data-sa-action="search-close"></i>
      </div>
    </form>

    <ul className="top-nav">
      <li className="hidden-xl-up">
        <a href="#" data-sa-action="search-open">
          <i className="zmdi zmdi-search"></i>
        </a>
      </li>

      <li className="dropdown">
        <a href="#" data-toggle="dropdown" className="top-nav__notify">
          <i className="zmdi zmdi-email"></i>
        </a>
        <div className="dropdown-menu dropdown-menu-right dropdown-menu--block">
          <div className="dropdown-header">
            Messages
            <div className="actions">
              <a href="messages.html" className="actions__item zmdi zmdi-plus"></a>
            </div>
          </div>

          <div className="listview listview--hover">
            <a href="#" className="listview__item">
              <img src="demo/img/profile-pics/1.jpg" className="listview__img" alt="" />

              <div className="listview__content">
                <div className="listview__heading">
                  David Belle <small>12:01 PM</small>
                </div>
                <p>Cum sociis natoque penatibus et magnis dis parturient montes</p>
              </div>
            </a>

            <a href="#" className="listview__item">
              <img src="demo/img/profile-pics/2.jpg" className="listview__img" alt="" />

              <div className="listview__content">
                <div className="listview__heading">
                  Jonathan Morris
                  <small>02:45 PM</small>
                </div>
                <p>Nunc quis diam diamurabitur at dolor elementum, dictum turpis vel</p>
              </div>
            </a>

            <a href="#" className="listview__item">
              <img src="demo/img/profile-pics/3.jpg" className="listview__img" alt="" />

              <div className="listview__content">
                <div className="listview__heading">
                  Fredric Mitchell Jr.
                  <small>08:21 PM</small>
                </div>
                <p>Phasellus a ante et est ornare accumsan at vel magnauis blandit turpis at augue ultricies</p>
              </div>
            </a>

            <a href="#" className="listview__item">
              <img src="demo/img/profile-pics/4.jpg" className="listview__img" alt="" />

              <div className="listview__content">
                <div className="listview__heading">
                  Glenn Jecobs
                  <small>08:43 PM</small>
                </div>
                <p>Ut vitae lacus sem ellentesque maximus, nunc sit amet varius dignissim, dui est consectetur neque</p>
              </div>
            </a>

            <a href="#" className="listview__item">
              <img src="demo/img/profile-pics/5.jpg" className="listview__img" alt="" />

              <div className="listview__content">
                <div className="listview__heading">
                  Bill Phillips
                  <small>11:32 PM</small>
                </div>
                <p>Proin laoreet commodo eros id faucibus. Donec ligula quam, imperdiet vel ante placerat</p>
              </div>
            </a>

            <a href="#" className="view-more">
              View all messages
            </a>
          </div>
        </div>
      </li>

      <li className="dropdown top-nav__notifications">
        <a href="#" data-toggle="dropdown" className="top-nav__notify">
          <i className="zmdi zmdi-notifications"></i>
        </a>
        <div className="dropdown-menu dropdown-menu-right dropdown-menu--block">
          <div className="dropdown-header">
            Notifications
            <div className="actions">
              <a href="#" className="actions__item zmdi zmdi-check-all" data-sa-action="notifications-clear"></a>
            </div>
          </div>

          <div className="listview listview--hover">
            <div className="listview__scroll scrollbar-inner">
              <a href="#" className="listview__item">
                <img src="demo/img/profile-pics/1.jpg" className="listview__img" alt="" />

                <div className="listview__content">
                  <div className="listview__heading">David Belle</div>
                  <p>Cum sociis natoque penatibus et magnis dis parturient montes</p>
                </div>
              </a>

              <a href="#" className="listview__item">
                <img src="demo/img/profile-pics/2.jpg" className="listview__img" alt="" />

                <div className="listview__content">
                  <div className="listview__heading">Jonathan Morris</div>
                  <p>Nunc quis diam diamurabitur at dolor elementum, dictum turpis vel</p>
                </div>
              </a>

              <a href="#" className="listview__item">
                <img src="demo/img/profile-pics/3.jpg" className="listview__img" alt="" />

                <div className="listview__content">
                  <div className="listview__heading">Fredric Mitchell Jr.</div>
                  <p>Phasellus a ante et est ornare accumsan at vel magnauis blandit turpis at augue ultricies</p>
                </div>
              </a>

              <a href="#" className="listview__item">
                <img src="demo/img/profile-pics/4.jpg" className="listview__img" alt="" />

                <div className="listview__content">
                  <div className="listview__heading">Glenn Jecobs</div>
                  <p>Ut vitae lacus sem ellentesque maximus, nunc sit amet varius dignissim, dui est consectetur neque</p>
                </div>
              </a>

              <a href="#" className="listview__item">
                <img src="demo/img/profile-pics/5.jpg" className="listview__img" alt="" />

                <div className="listview__content">
                  <div className="listview__heading">Bill Phillips</div>
                  <p>Proin laoreet commodo eros id faucibus. Donec ligula quam, imperdiet vel ante placerat</p>
                </div>
              </a>

              <a href="#" className="listview__item">
                <img src="demo/img/profile-pics/1.jpg" className="listview__img" alt="" />

                <div className="listview__content">
                  <div className="listview__heading">David Belle</div>
                  <p>Cum sociis natoque penatibus et magnis dis parturient montes</p>
                </div>
              </a>

              <a href="#" className="listview__item">
                <img src="demo/img/profile-pics/2.jpg" className="listview__img" alt="" />

                <div className="listview__content">
                  <div className="listview__heading">Jonathan Morris</div>
                  <p>Nunc quis diam diamurabitur at dolor elementum, dictum turpis vel</p>
                </div>
              </a>

              <a href="#" className="listview__item">
                <img src="demo/img/profile-pics/3.jpg" className="listview__img" alt="" />

                <div className="listview__content">
                  <div className="listview__heading">Fredric Mitchell Jr.</div>
                  <p>Phasellus a ante et est ornare accumsan at vel magnauis blandit turpis at augue ultricies</p>
                </div>
              </a>
            </div>

            <div className="p-1"></div>
          </div>
        </div>
      </li>

      <li className="dropdown hidden-xs-down">
        <a href="#" data-toggle="dropdown">
          <i className="zmdi zmdi-check-circle"></i>
        </a>

        <div className="dropdown-menu dropdown-menu-right dropdown-menu--block" role="menu">
          <div className="dropdown-header">Tasks</div>

          <div className="listview listview--hover">
            <a href="#" className="listview__item">
              <div className="listview__content">
                <div className="listview__heading">HTML5 Validation Report</div>

                <div className="progress mt-1">
                  <div
                    className="progress-bar bg-primary"
                    role="progressbar"
                    style={{width: '25%'}}
                    aria-valuenow="25"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
            </a>

            <a href="#" className="listview__item">
              <div className="listview__content">
                <div className="listview__heading">Google Chrome Extension</div>

                <div className="progress mt-1">
                  <div className="progress-bar bg-warning" style={{width: '43%'}} aria-valuenow="43" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
              </div>
            </a>

            <a href="#" className="listview__item">
              <div className="listview__content">
                <div className="listview__heading">Social Intranet Projects</div>

                <div className="progress mt-1">
                  <div className="progress-bar bg-success" style={{width: '20%'}} aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
              </div>
            </a>

            <a href="#" className="listview__item">
              <div className="listview__content">
                <div className="listview__heading">Bootstrap Admin Template</div>

                <div className="progress mt-1">
                  <div className="progress-bar bg-info" style={{width: '60%'}} aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
              </div>
            </a>

            <a href="#" className="listview__item">
              <div className="listview__content">
                <div className="listview__heading">Youtube Client App</div>

                <div className="progress mt-1">
                  <div className="progress-bar bg-danger" style={{width: '80%'}} aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
              </div>
            </a>

            <a href="#" className="view-more">
              View all Tasks
            </a>
          </div>
        </div>
      </li>

      <li className="dropdown hidden-xs-down">
        <a href="#" data-toggle="dropdown">
          <i className="zmdi zmdi-apps"></i>
        </a>

        <div className="dropdown-menu dropdown-menu-right dropdown-menu--block" role="menu">
          <div className="row app-shortcuts">
            <a className="col-4 app-shortcuts__item" href="#">
              <i className="zmdi zmdi-calendar"></i>
              <small className="">Calendar</small>
            </a>
            <a className="col-4 app-shortcuts__item" href="#">
              <i className="zmdi zmdi-file-text"></i>
              <small className="">Files</small>
            </a>
            <a className="col-4 app-shortcuts__item" href="#">
              <i className="zmdi zmdi-email"></i>
              <small className="">Email</small>
            </a>
            <a className="col-4 app-shortcuts__item" href="#">
              <i className="zmdi zmdi-trending-up"></i>
              <small className="">Reports</small>
            </a>
            <a className="col-4 app-shortcuts__item" href="#">
              <i className="zmdi zmdi-view-headline"></i>
              <small className="">News</small>
            </a>
            <a className="col-4 app-shortcuts__item" href="#">
              <i className="zmdi zmdi-image"></i>
              <small className="">Gallery</small>
            </a>
          </div>
        </div>
      </li>

      <li className="dropdown hidden-xs-down">
        <a href="#" data-toggle="dropdown">
          <i className="zmdi zmdi-more-vert"></i>
        </a>

        <div className="dropdown-menu dropdown-menu-right">
          <div className="dropdown-item theme-switch">
            Theme Switch
            <div className="btn-group btn-group--colors mt-2 d-block" data-toggle="buttons">
              <label className="btn active border-0" style={{backgroundColor: '#772036'}}>
                <input type="radio" value="1" autocomplete="off" checked />
              </label>
              <label className="btn border-0" style={{backgroundColor: '#273C5B'}}>
                <input type="radio" value="2" autocomplete="off" />
              </label>
              <label className="btn border-0" style={{backgroundColor: '#174042'}}>
                <input type="radio" value="3" autocomplete="off" />
              </label>
              <label className="btn border-0" style={{backgroundColor: '#383844'}}>
                <input type="radio" value="4" autocomplete="off" />
              </label>
              <label className="btn border-0" style={{backgroundColor: '#49423F'}}>
                <input type="radio" value="5" autocomplete="off" />
              </label>

              <br />

              <label className="btn border-0" style={{backgroundColor: '#5e3d22'}}>
                <input type="radio" value="6" autocomplete="off" />
              </label>
              <label className="btn border-0" style={{backgroundColor: '#234d6d'}}>
                <input type="radio" value="7" autocomplete="off" />
              </label>
              <label className="btn border-0" style={{backgroundColor: '#3b5e5e'}}>
                <input type="radio" value="8" autocomplete="off" />
              </label>
              <label className="btn border-0" style={{backgroundColor: '#0a4c3e'}}>
                <input type="radio" value="9" autocomplete="off" />
              </label>
              <label className="btn border-0" style={{backgroundColor: '#7b3d54'}}>
                <input type="radio" value="10" autocomplete="off" />
              </label>
            </div>
          </div>
          <a href="#" className="dropdown-item" data-sa-action="fullscreen">
            Fullscreen
          </a>
          <a href="#" className="dropdown-item">
            Clear Local Storage
          </a>
        </div>
      </li>
    </ul>

    <div className="clock hidden-md-down">
      <div className="time">
        <span className="hours"></span>
        <span className="min"></span>
        <span className="sec"></span>
      </div>
    </div>
  </header>
);

// main
export default class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchTerms: '',
      submitted: false
    };

    var loadJS = function(url, implementationCode, location) {
      //url is URL of external file, implementationCode is the code
      //to be called from the file, location is the location to
      //insert the <script> element

      var scriptTag = document.createElement('script');
      scriptTag.src = url;

      scriptTag.onload = implementationCode;
      scriptTag.onreadystatechange = implementationCode;

      location.appendChild(scriptTag);
    };

    var scripts = [
      'https://code.jquery.com/jquery-2.2.4.min.js',
      'vendors/bower_components/popper.js/dist/umd/popper.min.js',
      'vendors/bower_components/bootstrap/dist/js/bootstrap.min.js',
      'vendors/bower_components/jquery.scrollbar/jquery.scrollbar.min.js',
      'vendors/bower_components/jquery-scrollLock/jquery-scrollLock.min.js',
      'vendors/bower_components/salvattore/dist/salvattore.min.js',
      'vendors/bower_components/flot/jquery.flot.js',
      'vendors/bower_components/flot/jquery.flot.resize.js',
      'vendors/bower_components/flot.curvedlines/curvedLines.js',
      'vendors/bower_components/jqvmap/dist/jquery.vmap.min.js',
      'vendors/bower_components/jquery.easy-pie-chart/dist/jquery.easypiechart.min.js',
      'vendors/bower_components/peity/jquery.peity.min.js',
      'vendors/bower_components/moment/min/moment.min.js',
      'vendors/bower_components/fullcalendar/dist/fullcalendar.min.js',
      'vendors/bower_components/mediaelement/build/mediaelement-and-player.min.js',
      //'demo/js/flot-charts/curved-line.js',
      //'demo/js/flot-charts/line.js',
      //'demo/js/flot-charts/dynamic.js',
      //'demo/js/flot-charts/chart-tooltips.js',
      //'demo/js/other-charts.js',
      //'demo/js/jqvmap.js',
      'js/app.min.js'
    ];

    function loadScripts(sources) {
      sources.forEach((src) => {
        var script = document.createElement('script');
        script.src = src;
        script.async = false; //<-- the important part
        document.body.appendChild(script); //<-- make sure to append to body instead of head
      });
    }

    var yourCodeToBeCalled = function() {
      //your code goes here
      console.log('script called');
      loadScripts(scripts);
    };

    loadScripts(scripts);

    loadJS('vendors/bower_components/jquery/dist/jquery.min.js', yourCodeToBeCalled, document.body);

    /*
		scripts.reverse().forEach(function(url, idx) {
			loadJS(url, yourCodeToBeCalled, document.body);
		});
		*/

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.navigate = navigate;
    this.play = this.play.bind(this);
    this.setPlayer = this.setPlayer.bind(this);
  }

  onChange(e) {
    this.setState({
      searchTerms: e.target.value
    });
  }

  onSubmit(e) {
    e.preventDefault();
    debugger;
    this.navigate(`/search/${this.state.searchTerms}`);
  }

  isSubmitted() {
    if (this.state.submitted) {
      this.setState({
        submitted: false
      });
      return <Redirect to={`/search/${this.state.searchTerms}`} />;
    }
  }

  play(url) {
    this.Player.setSrc(url);
    this.Player.play();
  }

  setPlayer(Player) {
    this.Player = Player;
  }

  render() {
    return (
      <>
        {/* wrap all Routes and Links in LocationProvider to use memory-based history */}
        <LocationProvider history={history}>
          {/* Bootstrap navbar */}

          <main className="main">
            <div className="page-loader">
              <div className="page-loader__spinner">
                <svg viewBox="25 25 50 50">
                  <circle cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10" />
                </svg>
              </div>
            </div>

            <Header onSubmit={this.onSubmit} onChange={this.onChange} searchTerms={this.state.searchTerms} />
            <aside className="sidebar">
              <div className="scrollbar-inner">
                <div className="user" style={{display:'none'}}>
                  <div className="user__info" data-toggle="dropdown">
                    <img className="user__img" src="demo/img/profile-pics/8.jpg" alt="" />
                    <div>
                      <div className="user__name">Malinda Hollaway</div>
                      <div className="user__email">malinda-h@gmail.com</div>
                    </div>
                  </div>

                  <div className="dropdown-menu">
                    <a className="dropdown-item" href="#">
                      View Profile
                    </a>
                    <a className="dropdown-item" href="#">
                      Settings
                    </a>
                    <a className="dropdown-item" href="#">
                      Logout
                    </a>
                  </div>
                </div>

                <ul className="navigation">
                  <li className="navigation__active">
                    <a href="index-2.html">
                      <i className="zmdi zmdi-home"></i> Home
                    </a>
                  </li>
                  <li className="navigation__active">
                    <a href="index-2.html">
                      <i className="zmdi zmdi-cloud-download"></i> Downloads
                    </a>
                  </li>
                </ul>
              </div>
            </aside>

            <section className="content">
              {/* body */}

              {/* reach router */}
              <Router>
                <Home exact path="/" default />
                <Page1 path="/search/:searchTerms" play={this.play}/>
                <Page2 path="page2" />
              </Router>

              {this.isSubmitted()}

              <footer className="footer hidden-xs-down">
                <p>© Super Admin Responsive. All rights reserved.</p>

                <ul className="nav footer__nav">
                  <a className="nav-link" href="#">
                    Homepage
                  </a>

                  <a className="nav-link" href="#">
                    Company
                  </a>

                  <a className="nav-link" href="#">
                    Support
                  </a>

                  <a className="nav-link" href="#">
                    News
                  </a>

                  <a className="nav-link" href="#">
                    Contacts
                  </a>
                </ul>
              </footer>
            </section>

            <Player setPlayer={this.setPlayer}/>
          </main>
        </LocationProvider>
      </>
    );
  }
}
