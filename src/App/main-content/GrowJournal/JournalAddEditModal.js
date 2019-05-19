import React, { Component } from 'react';
import '../../../styles/App.css';

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import Dropzone from 'react-dropzone';


import DbHelper from '../../_utils/DbHelper.js'



class JournalAddEditModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            content: '',
            images: [],
            addedImages: [],
            journalID: this.props.journalID,
            postDate: new Date(),
            trueDate: new Date(),
            growStage: 'veg', // pre, seedling, veg, flower, post
            published: false,
            entryID: ''
        };

        this.dbHelper = new DbHelper();

    }

    componentDidMount() {
        if (this.props.editPost) {
            var tempTrueDate = null

            if (this.props.editPost.datetime_true) {
                tempTrueDate = new Date(this.props.editPost.datetime_true)
            } else {
                tempTrueDate = this.state.trueDate
            }

            var tempPostDate = null
            tempPostDate = new Date(this.props.editPost.datetime_post)

            var tempContent = this.props.editPost.content
            var tempTitle = this.props.editPost.title
            var tempImages = this.props.editPost.images
            if (tempImages === null || tempImages === undefined) {
                tempImages = []
            }
            var tempGrowStage = null
            if (this.props.editPost.grow_stage) {
                tempGrowStage = this.props.editPost.grow_stage
            } else {
                tempGrowStage = this.state.growStage
            }

            var tempPostId = this.props.editPost.id

            this.setState({
                title: tempTitle,
                content: tempContent,
                trueDate: tempTrueDate,
                postDate: tempPostDate,
                growStage: tempGrowStage,
                images: tempImages,
                entryID: tempPostId,
                published: true
            });
        }
    }

    handleTitleChange = (event) => {
        this.setState({ title: event.target.value });
    }

    handleContentChange = (event) => {
        this.setState({ content: event.target.value });
    }

    cancelModal = () => {

        this.deleteAllAddedImages();

        this.props.closeModal(this.state.entryID);
    }

    saveEntry = async () => {
        if (this.state.content === '' && this.state.images.length === 0) {
            alert("Needs content or images!")
            return;
        }
        this.setState({ published: true });

        this.dbHelper.saveJournalEntry(
            this.state.journalID,
            this.state.entryID,
            this.state.trueDate,
            this.state.title,
            this.state.content,
            this.state.growStage,
            this.state.postDate,
            this.state.images,
            this.closeModal
        )


    }

    closeModal = (entryID) => {
        this.props.closeModal(entryID);
    }

    onImageDrop(files) {

        console.log(files);

        files.forEach((file) => {
            this.handleImageUpload(file);
            console.log("upload " + file);
        })

    }

    displayFullImage = () => {

        console.log("JournalAddEditModal todo")
    }


    handleImageUpload = async (file) => {
        try {
            await this.dbHelper.handleImageUpload(file, this.setImages)
        } catch (e) {
            console.log(e);
            return 'caught ' + e
        }
    }

    setImages = (url, thumbURL) => {
        var tempImages = this.state.images;
        var tempAddedImages = this.state.addedImages;
        tempImages.push({ 'url': url, 'thumb': thumbURL })
        tempAddedImages.push({ 'url': url, 'thumb': thumbURL })
        this.setState({
            images: tempImages,
            addedImages: tempAddedImages
        });
    }

    deleteImage = (ev) => {
        let val = ev.target.dataset.value;
        console.log(val);
        console.log(this.state.images);

        let tempImages = []

        this.state.images.forEach((img) => {
            if (img.url.toString() === val) {
                this.handleImageDelete(img.url);
                this.handleImageDelete(img.thumb)
            } else {
                tempImages.push(img)
            }
        })

        this.setState({ images: tempImages });

    }

    deleteAllAddedImages = () => {
        let imagesToDelete = this.state.addedImages;
        // this.setState({ images: [] });

        imagesToDelete.forEach((img) => {
            this.handleImageDelete(img.url);
            this.handleImageDelete(img.thumb);
        })
    }

    handleImageDelete = (url) => {
        this.dbHelper.handleImageDelete(url);
    }

    handleDateChange = (dt) => {
        this.setState({ trueDate: dt });
    }

    handleGrowStageChange = (event) => {
        this.setState({ growStage: event.target.value });
    }


    render() {

        console.log("true DATE!!")
        console.log(this.state.trueDate)

        if (this.state.images) {
            var renderedThumbnails = this.state.images.map((image, i) => <div className="Temp-Image-Div"><img key={i} alt="grow img" data-value={image.url} src={image.url} className="Journal-Entry-Preview-Thumbnail" onClick={this.displayFullImage} /><div data-value={image.url} onClick={this.deleteImage} className="Delete-Image-Btn">X</div></div>)
        }

        return (
            <div id="Journal-Modal-Space">
                <div id="Journal-Edit-Entry-Modal">
                    <div id="Journal-Edit-Topline">
                        {/* DATE PICKER  */}
                        <DatePicker
                            id="journal-edit-datepicker"
                            selected={this.state.trueDate}
                            onChange={this.handleDateChange} />
                        {/* STAGE PICKER  */}
                        <select id="journal-edit-grow-stage" onChange={this.handleGrowStageChange} value={this.state.growStage}>
                            <option value="post">Post</option>
                            <option value="flower">Flower</option>
                            <option value="veg">Veg</option>
                            <option value="seedling">Seedling</option>
                            <option value="pre">Pre</option>
                        </select>
                        {/* TITLE INPUT  */}
                        <input className="journal-modal-edit-title" placeholder="enter title..." value={this.state.title} onChange={this.handleTitleChange} />
                    </div>
                    {/* BODY INPUT  */}
                    <textarea className="journal-modal-edit-body" placeholder="enter body content..." value={this.state.content} onChange={this.handleContentChange} />
                    {/* BODY INPUT  */}
                    <div className="journal-add-images-area">

                        <Dropzone
                            className="journal-add-images-dropzone"
                            onDrop={this.onImageDrop.bind(this)}
                            accept="image/*"
                            multiple={true}>
                            {({ getRootProps, getInputProps }) => {
                                return (
                                    <div {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        {
                                            <p id="Image-Drop-Text">Try dropping some <br></br> images <span role="img" aria-label="camera">&#x1f4f7;</span> here, <br></br>or click to <br></br> select files.</p>
                                        }
                                    </div>
                                )
                            }}
                        </Dropzone>

                        {(() => {
                            if (renderedThumbnails) {
                                return (
                                    <div className="Journal-Edit-Post-Images">
                                        {renderedThumbnails}
                                    </div>
                                )
                            }
                        })()}

                    </div>

                    <div id="journal-cancel-save-btns">
                        <button className="journal-cancel-btn" onClick={this.cancelModal}>Cancel</button>
                        <button className="journal-save-entry-btn" onClick={this.saveEntry}>Save Entry</button>
                    </div>

                </div>
            </div>
        );
    }
}

export default JournalAddEditModal;
