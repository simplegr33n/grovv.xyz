import React, { Component } from 'react';
import '../../../styles/App.css';


class GrowBoxItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            grow: this.props.grow
        };

    }

    openGrow = () => {
        this.props.openGrow(this.props.grow)
    }

    render() {

        var createdAt = new Date(this.props.grow.createdAt).toDateString()
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
                    </div>

                    <div className="Grow-Box-Info">
                        created: <i><b>{createdAt}</b></i>
                    </div>

                </div>

                <img alt="preview" src={this.props.grow.previewImage} className="Grow-Box-Preview-Image" />
            </div>
        );
    }
}

export default GrowBoxItem;
