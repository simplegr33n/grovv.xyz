import React, { Component } from 'react';
import '../../../styles/App.css';


class GrowBoxItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            grow: this.props.grow
        };

    }

    componentDidMount() {
        console.log("Grow box grow props")
        console.log(this.props.grow)
    }


    openGrow = () => {
        alert("GrowBoxItem openGrow() TODO")
        //this.props.openGrow(this.props.grow)
    }

    render() {

        var updatedAtDate = new Date(this.props.grow.updatedAt)
        var updatedAt = updatedAtDate.toDateString() + " - " + updatedAtDate.getHours() + ":" + updatedAtDate.getMinutes()

        return (
            <div className="Grow-Box-Item" onClick={this.openGrow}>
                <div className="Grow-Box-Item-Main">
                    <div className="Grow-Box-Item-Header">

                        <div>
                            {this.props.grow.name}
                        </div>
                        <div className="Grow-Box-Created">
                            updated: <i><b>{updatedAt}</b></i>
                        </div>

                        <img alt="preview" src={this.props.grow.previewImage} className="Grow-Box-Preview-Image" />

                    </div>

                    <div className="Grow-Box-Info">
                        info.....
                        <br></br>temp
                        <br></br>fan
                        <br></br>humidity
                        <br></br>humidifier
                    </div>



                </div>

                <div className="Grow-Box-Cam-Div">
					<object className="Grow-Box-Cam" type="text/html" data={this.props.grow.urls.cam} width="100%" height="100%" aria-label="cam" />
                    {/* <img className="Grow-Box-Cam" alt="cam" src={this.props.grow.urls.cam} width="100%" height="100%" style={{ objectFit: 'contain' }}/> */}
                </div>
            </div>
        );
    }
}

export default GrowBoxItem;
