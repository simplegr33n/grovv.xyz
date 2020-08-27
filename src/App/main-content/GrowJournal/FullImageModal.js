import React, { Component } from 'react';
import '../../../styles/App.css';


class FullImageModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            imageList: this.props.imageList,
            currentImage: this.props.currentFullImage,
            fullSizeList: []
        };

    }

    componentDidMount() {
        if (this.props.imageList) {
            var tempFullSizeList = []
            this.props.imageList.forEach((image) => {
                tempFullSizeList[tempFullSizeList.length] = image.url
            });
            this.setState({ fullSizeList: tempFullSizeList });
        }

    }

    closeModal = () => {
        this.props.closeModal('');
    }

    nextImage = () => {

        this.state.fullSizeList.forEach((imageUrl, i) => {
            if (imageUrl === this.state.currentImage) {
                if (i < this.state.fullSizeList.length - 1) {
                    this.setState({ currentImage: this.state.fullSizeList[i + 1] });
                }
                return;
            }
        });

    }

    previousImage = () => {

        this.state.fullSizeList.forEach((imageUrl, i) => {
            if (imageUrl === this.state.currentImage) {
                if (i > 0) {
                    this.setState({ currentImage: this.state.fullSizeList[i - 1] });
                }
                return;
            }
        });

    }

    render() {

        console.log("FULLIMAGE MODAL!")
        console.log(this.state.imageList)
        console.log(this.state.currentImage)

        return (
            <div id="Full-Image-Modal-Space">
                <img id="Full-Image-Image" alt="full size" src={this.state.currentImage} />
                <button onClick={this.closeModal} id="Full-Image-Close-Btn">x</button>
                <button onClick={this.previousImage} id="Full-Image-Last-Btn">&#8804;</button>
                <button onClick={this.nextImage} id="Full-Image-Next-Btn">&#8805;</button>
            </div>
        );
    }
}

export default FullImageModal;
