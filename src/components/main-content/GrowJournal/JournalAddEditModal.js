import React, { Component } from 'react';
import '../../../styles/App.css';

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import Dropzone from 'react-dropzone';

import Firebase from '../../../config/firebaseConfig.js'


class JournalAddEditModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            content: '',
            images: [], 
            postDate: new Date(),
            trueDate: new Date(),
            growState: 'veg', // pre, seedling, veg, flower, post
            published: false,
            key: ''
        };

        this.firebase = new Firebase();

    }

    componentDidMount() {
        if(!this.props.editPost) {
            var ref = this.firebase.db.ref().child('users').child('wR4QKyZ77mho1fL0FQWSMBQ170S2').child('grows').child('-LdG6gTCNZxfu1wU5Xvx').child('journal')
            var entryRef = ref.push();
            var entryKey = entryRef.key;
            this.setState({ key: entryKey });
            return;
        }

        console.log(this.props.editPost)

        var tempTrueDate = new Date(this.props.editPost.datetime_true)
        var tempContent = this.props.editPost.content
        var tempTitle = this.props.editPost.title
        var tempPostDate = new Date(this.props.editPost.datetime_post)
        var tempImages = this.props.editPost.images
        var tempKey = this.props.editPost.id

        this.setState({ 
            title: tempTitle,
            content: tempContent,
            trueDate: tempTrueDate,
            postDate: tempPostDate,
            images: tempImages,
            key: tempKey, 
            published: true
        });

    }

    handleTitleChange = (event) => {
        this.setState({ title: event.target.value });
    }

    handleContentChange = (event) => {
        this.setState({ content: event.target.value });
    }

    cancelModal = () => {
        // If unpublished, delete any queued images when canceling out of window
        if (this.state.published === false) {
            this.deleteAllImages();
        }

        this.props.closeModal(this.state.key);
    }

    saveEntry = () => {
        if (this.state.content === '' && this.state.images.length === 0) {
            alert("Needs content or images!")
            return;
        }
        this.setState({ published: true });

        // Journal data in firebase // TODO scalable.
        var ref = this.firebase.db.ref().child('users').child('wR4QKyZ77mho1fL0FQWSMBQ170S2').child('grows').child('-LdG6gTCNZxfu1wU5Xvx').child('journal')
        

        ref.child(this.state.key).set({
            'id': this.state.key,
            'title': this.state.title,
            'published': true,
            'content': this.state.content,
            'grow_state': 'veg',
            'datetime_post': this.state.postDate.getTime(),
            'datetime_edit': 'last edit datetime',
            'datetime_true': this.state.trueDate.getTime(),
            'images': this.state.images
        })

        console.log('pushed a journal entry')

        this.props.closeModal(this.state.key);
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


    handleImageUpload = (file) => {

        // Get storage reference and push file blob 
        var storageRef = this.firebase.storage.ref().child('journals').child('-LdG6gTCNZxfu1wU5Xvx/');

        console.log("filename:" + file.name)

        const metadata = { contentType: file.type };
        const storageTask = storageRef.child(this.state.postDate.getTime() + file.name).put(file, metadata);
        storageTask
            .then(snapshot => snapshot.ref.getDownloadURL())
            .then(url => {
                console.log(url)
                // Create thumb url from url (thumbs automatically created via cloud function on upload)
                var urlSplit = url.split("%2F")
                //var urlName = urlSplit[2];
                var thumbUrl = urlSplit[0] + "%2F" + urlSplit[1] + "%2Fthumb_" + urlSplit[2]

                console.log(thumbUrl)

                var tempImages = this.state.images;
                tempImages.push({ 'url': url, 'thumb': thumbUrl  })
                this.setState({ images: tempImages });

            }).then(() => {
                //this.props.goto('studio');
            });
    }

    deleteImage = (ev) => {
            let val = ev.target.dataset.value;  
            console.log(val);
            console.log(this.state.images);

            let tempImages = []

            this.state.images.forEach((img) => {
                if (img.url.toString() === val) {
                    this.deleteImageFromFirebase(img.url);
                    this.deleteImageFromFirebase(img.thumb)
                } else {
                    tempImages.push(img)
                }
            }) 
            
            this.setState({ images: tempImages });
            
    }

    deleteAllImages = () => {
        let imagesToDelete = this.state.images;
        this.setState({ images: [] });

        imagesToDelete.forEach((img) => {
            this.deleteImageFromFirebase(img.url);
            this.deleteImageFromFirebase(img.thumb)
        }) 
    }

    deleteImageFromFirebase = (url) => {
        // Create a reference to the file to delete
        var desertRef = this.firebase.storage.refFromURL(url)

        // Delete the file
        desertRef.delete().then(function() {
        // File deleted successfully
        console.log("deleted " + url + "successfully :)")
        }).catch(function(error) {
        // Uh-oh, an error occurred!
        console.log("deleted " + url + "error :(")
        });
    }

    handleDateChange = (dt) => {
        this.setState({ trueDate: dt });
    }


    render() {

        if (this.state.images) {
            var renderedThumbnails = this.state.images.map((image, i) => <div className="Temp-Image-Div"><img key={i} alt="grow img" data-value={image.url} src={image.url} className="Journal-Entry-Preview-Thumbnail" onClick={this.displayFullImage} /><div data-value={image.url} onClick={this.deleteImage} className="Delete-Image-Btn">X</div></div>)
        }

        return (
            <div id="Journal-Modal-Space">
                <div id="Journal-Edit-Entry-Modal">
                    <div id="Journal-Edit-Topline">
                        {/* TITLE INPUT  */}
                        <input className="journal-modal-edit-title" placeholder="enter title..." value={this.state.title} onChange={this.handleTitleChange} />
                        {/* DATE PICKER  */}
                        <DatePicker
                            selected={this.state.trueDate}
                            onChange={this.handleDateChange} />
                        {/* STAGE PICKER  */}
                        <div className="journal-modal-edit-stage-container">
                            <ul className="journal-modal-edit-stage">
                                <li className="modal-stage-li"><div onClick="">{this.state.growState}</div>
                                    <ul className="journal-entry-stage-dropdown">
                                        <li className="stage-li"><div onClick="">Post</div></li>
                                        <li className="stage-li"><div onClick="">Flower</div></li>
                                        <li className="stage-li"><div onClick="">Veg</div></li>
                                        <li className="stage-li"><div onClick="">Seedling</div></li>
                                        <li className="stage-li"><div onClick="">Pre</div></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                    {/* BODY INPUT  */}
                    <textarea className="journal-modal-edit-body" placeholder="enter body content..." value={this.state.content} onChange={this.handleContentChange} />
                    {/* BODY INPUT  */}
                    <div className="journal-add-images-area">

                        <Dropzone
                            onDrop={this.onImageDrop.bind(this)}
                            accept="image/*"
                            multiple={true}>
                            {({ getRootProps, getInputProps }) => {
                                return (
                                    <div {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        {
                                            <p>Try dropping some images <span role="img" aria-label="camera">&#x1f4f7;</span> here, <br></br>or click to select files to upload.</p>
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

                    <button className="journal-cancel-btn" onClick={this.cancelModal}>Cancel</button>
                    <button className="journal-save-entry-btn" onClick={this.saveEntry}>Save Entry</button>

                </div>
            </div>
        );
    }
}

export default JournalAddEditModal;
