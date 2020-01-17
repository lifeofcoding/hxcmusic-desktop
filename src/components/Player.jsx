import React from 'react';

import AudioPlayer from 'react-h5-audio-player';
//import 'react-h5-audio-player/lib/styles.css';
import './Player.scss';
import EventBus from 'eventing-bus';
// import 'react-h5-audio-player/lib/styles.less' Use LESS
// import 'react-h5-audio-player/src/styles.scss' Use SASS

export default class Player extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isPlaying: false
        };

        EventBus.on('play', (data) => {
            this.setState({
              url: data.url,
              image: data.image
            });
        });
    }

    render() {
        return (
            <div
                style={{
                    position: 'fixed',
                    bottom: this.state.url ? '0' : '-90px',
                    transition: 'bottom 1s',
                    width: '100%',
                    display: 'flex',
                    height: '90px',
                    backgroundColor: '#042140de'
                }}
            >
              <div style={{float:'left'}}>
                <img src={this.state.image} width="90px" height="90px"/>
                </div>
                <AudioPlayer
                    color="#333333"
                    ref={(c) => (this.player = c)}
                    autoPlay
                    src={this.state.url}
                    onPlay={(e) => console.log('onPlay')}
                    // other props here
                />
            </div>
        );
    }
}
