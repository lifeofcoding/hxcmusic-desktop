import React from 'react';
import EventBus from 'eventing-bus';

//import ipcRenderer from 'electron'
//const { ipcRenderer } = require('electron')

export default class Home extends React.Component {
  constructor(props) {
	  super(props);
	  
    this.state = {
      searchTerms: '',
      results: []
    };

    //ipcRenderer.send('message', {method:'getResults', value:'music'})
    EventBus.on('results', (params) => {
      console.log(params.results);

      if (!params.results.error) {
        this.setState({
          searchTerms: params.searchTerms,
          results: params.results
        })
      }
    });

    this.play = this.play.bind(this);
  }

  componentDidMount() {
    let { searchTerms } = this.props;

    console.log(`searchTerms ${searchTerms}`)

    EventBus.publish('getResults', searchTerms);

    this.setState({
      searchTerms
    })
    /*
    fetch(`http://localhost:1337/api/search/${searchTerms}`)
      .then((response) => {
        return response.json();
      })
      .then((myJson) => {
        console.log(myJson);

        if (!myJson.error) {
          this.setState({
            searchTerms: searchTerms,
            results: myJson
          })
        }
      });
    */
  }

  download(e) {
    window.downloadFile(`http://localhost:1337/stream/${e.target.dataset.streamid}`); 

   //window.open(`https://hxc-tube.herokuapp.com/${youtubeId}`) 
  }

  play(e) {
    //this.props.play(`https://hxc-tube.herokuapp.com/${e.target.dataset.youtubeid}`);
    EventBus.publish('play', {
      url:`http://localhost:1337/stream/${e.target.dataset.streamid}`,
      image: e.target.dataset.image
    });
  }

  render() {
    return (
        <div class="card">
                    <div class="card-body">
                        <h4 class="card-title">{this.state.searchTerms}</h4>
                        <h6 class="card-subtitle">&nbsp;</h6>

                        <table class="table table-striped mb-0">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Thumbnail</th>
                                <th>Title</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                              this.state.results.map((item, idx) => {
                                return (
                                  <tr key={idx}>
                                      <th scope="row">{idx + 1}</th>
                                      <td><img src={item.coverUrl} width="80px"/></td>
                                      <td>{item.artist} - {item.title}</td>
                                      <td>
                                        <button onClick={this.download} data-streamId={item.streamId} className="btn btn-dark btn--icon-text"><i className="zmdi zmdi-cloud-download"></i> Download</button>
                                      </td>
                                      <td>
                                        <button onClick={this.play} data-image={item.coverUrl} data-streamId={item.streamId} className="btn btn-dark btn--icon-text"><i className="zmdi zmdi-play"></i> Play</button>
                                      </td>
                                  </tr>
                                )
                              })
                            }
                            </tbody>
                        </table>
                    </div>
                  </div>

    )
  }
}
