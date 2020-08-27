import React, { Component } from 'react';
import '../../../styles/App.css';



class GrowCamFull extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };

    }

    closeCam = () => {
        this.props.closeFullCam()
    }


    render() {
        if (this.props.camURL) {
            console.log("GrowCamFull Cam URL")
            console.log(this.props.camURL)
        }

        return (
            <div id="Grow-Cam-Full">
                <div className="Grow-Cam-Full-Exit-Btn" onClick={this.closeCam}>X</div>
                {/* TODO: Remove condition */}
                {(() => {
                    if (this.props.camURL === 'http://96.52.249.69:300/html/') {
                        return <object type="text/html" data={'http://96.52.249.69:300/html/'} width="100%" height="100%" aria-label="live cam" />
                    } else if (this.props.camURL === 'http://growlab-ag/cam/')  {
                        return <object type="text/html" data={'http://growlab-ag/cam/'} width="100%" height="100%" aria-label="live cam" />
                    } else {
                        return <img alt="cam" style={{ objectFit: 'contain' }} src={this.props.camURL} width="100%" height="100%" />
                    }
                })()}
            </div>
        );
    }
}

export default GrowCamFull;
