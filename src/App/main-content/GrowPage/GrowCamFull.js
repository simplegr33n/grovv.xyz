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
        console.log("GrowCamFull Cam URL")
        console.log(this.props.camURL)

        if (this.props.camURL) {
            console.log(this.props.camURL)
            // < div id = "Main-Content" >
            //     <object className="Site-View-Update" style={{ zIndex: this.state.zPlotly }} type="text/html" data={this.state.URL_plotly} width="100%" height="100%" aria-label="plotly" />
            //     <object className="Site-View-Update" style={{ zIndex: this.state.zLivecam }} type="text/html" data={this.state.URL_livecam} width="100%" height="100%" aria-label="live cam" />
            //     <object className="Site-View-Update" style={{ zIndex: this.state.zVeggerPlotly }} type="text/html" data={this.state.URL_vegger_plotly} width="100%" height="100%" aria-label="vegger plotly" />
            //     <img className="Site-View-Update" alt="cam" style={{ zIndex: this.state.zVeggerLivecam, objectFit: 'contain' }} src={this.state.URL_vegger_livecam} width="100%" height="100%" />
            // </div >
        }

        console.log("hmm")

        return (
            <div id="Grow-Cam-Full">
                <div className="Grow-Cam-Full-Exit-Btn" onClick={this.closeCam}>X</div>
                {/* TODO: Remove condition */}
                {(() => {
                    if (this.props.camURL === 'http://96.52.249.69:300/html/cam_pic.php?time=0') {
                        return <object type="text/html" data={'http://96.52.249.69:300/html/'} width="100%" height="100%" aria-label="live cam" />
                    } else {
                        return <img alt="cam" style={{ objectFit: 'contain' }} src={this.props.camURL} width="100%" height="100%" />
                    }
                })()}
            </div>
        );
    }
}

export default GrowCamFull;
