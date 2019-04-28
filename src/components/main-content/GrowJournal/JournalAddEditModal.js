import React, { Component } from 'react';
import '../../../styles/App.css';

import Dropzone from 'react-dropzone';

import Firebase from '../../../config/firebaseConfig.js'


class JournalAddEditModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            content: '',
            images: []
        };

        this.firebase = new Firebase();

        this.date = new Date();

        this.month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    }

    handleTitleChange = (event) => {
        this.setState({ title: event.target.value });
    }

    handleContentChange = (event) => {
        this.setState({ content: event.target.value });
    }

    closeModal = () => {
        this.props.closeModal("main");
    }

    saveEntry = () => {
        if (this.state.content === '' && this.state.images.length === 0) {
            alert("Needs content or images!")
            return;
        }

        // Journal data in firebase // TODO scalable.
        var ref = this.firebase.db.ref().child('users').child('wR4QKyZ77mho1fL0FQWSMBQ170S2').child('grows').child('-LdG6gTCNZxfu1wU5Xvx').child('journal')

        ref.push({
            'title': this.state.title,
            'content': this.state.content,
            'grow_state': 'veg',
            'datetime_post': this.date.getTime(),
            'datetime_edit': 'last edit datetime',
            'datetime_true': this.date.getTime(),
            'images': this.state.images
        })

        console.log('pushed a new journal entry')

        this.props.closeModal("main");
    }

    uploadPhotos() {

    }

    onImageDrop(files) {
        // this.setState({
        //   uploadedFile: files[0]
        // });

        // this.handleImageUpload(files[0]);

        console.log(files);

        this.handleImageUpload(files[0]);
    }

    displayFullImage = () => {

        console.log("JournalAddEditModal todo")
    }


    handleImageUpload = (file) => {

        // Get storage reference and push file blob 
        var storageRef = this.firebase.storage.ref().child('journals').child('-LdG6gTCNZxfu1wU5Xvx/');

        console.log("filename:" + file.name)

        const metadata = { contentType: file.type };
        const storageTask = storageRef.child(this.date.getTime() + file.name).put(file, metadata);
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


    render() {

        var renderedThumbnails = this.state.images.map((image, i) => <img key={i} alt="grow img" data-value={image.url} src={image.url} className="Journal-Entry-Preview-Thumbnail" onClick={this.displayFullImage} />)

        return (
            <div id="Journal-Modal-Space">
                <div id="Journal-Edit-Entry-Modal">
                    <div id="Journal-Edit-Topline">
                        {/* TITLE INPUT  */}
                        <input className="journal-modal-edit-title" placeholder="enter title..." value={this.state.title} onChange={this.handleTitleChange} />
                        {/* DATE CONTAINER  */}
                        <div className="journal-modal-edit-date-container">
                            <ul className="journal-modal-edit-date">
                                <li className="modal-date-li"><div onClick="">{this.month[this.date.getMonth()]}</div>
                                    <ul className="journal-entry-date-dropdown">
                                        <li className="date-li"><div onClick="">January</div></li>
                                        <li className="date-li"><div onClick="">February</div></li>
                                        <li className="date-li"><div onClick="">March</div></li>
                                        <li className="date-li"><div onClick="">April</div></li>
                                        <li className="date-li"><div onClick="">May</div></li>
                                        <li className="date-li"><div onClick="">June</div></li>
                                        <li className="date-li"><div onClick="">July</div></li>
                                        <li className="date-li"><div onClick="">August</div></li>
                                        <li className="date-li"><div onClick="">September</div></li>
                                        <li className="date-li"><div onClick="">October</div></li>
                                        <li className="date-li"><div onClick="">November</div></li>
                                        <li className="date-li"><div onClick="">December</div></li>
                                    </ul>
                                </li>
                                <li className="modal-date-li"><div onClick="">{this.date.getDate()}</div>
                                    <ul className="journal-entry-date-dropdown">
                                        <li className="date-li"><div onClick="">1</div></li>
                                        <li className="date-li"><div onClick="">2</div></li>
                                        <li className="date-li"><div onClick="">3</div></li>
                                        <li className="date-li"><div onClick="">4</div></li>
                                        <li className="date-li"><div onClick="">5</div></li>
                                        <li className="date-li"><div onClick="">6</div></li>
                                        <li className="date-li"><div onClick="">7</div></li>
                                        <li className="date-li"><div onClick="">8</div></li>
                                        <li className="date-li"><div onClick="">9</div></li>
                                        <li className="date-li"><div onClick="">10</div></li>
                                        <li className="date-li"><div onClick="">11</div></li>
                                        <li className="date-li"><div onClick="">12</div></li>
                                        <li className="date-li"><div onClick="">13</div></li>
                                        <li className="date-li"><div onClick="">14</div></li>
                                        <li className="date-li"><div onClick="">15</div></li>
                                        <li className="date-li"><div onClick="">16</div></li>
                                        <li className="date-li"><div onClick="">17</div></li>
                                        <li className="date-li"><div onClick="">18</div></li>
                                        <li className="date-li"><div onClick="">19</div></li>
                                        <li className="date-li"><div onClick="">20</div></li>
                                        <li className="date-li"><div onClick="">21</div></li>
                                        <li className="date-li"><div onClick="">22</div></li>
                                        <li className="date-li"><div onClick="">23</div></li>
                                        <li className="date-li"><div onClick="">24</div></li>
                                        <li className="date-li"><div onClick="">25</div></li>
                                        <li className="date-li"><div onClick="">26</div></li>
                                        <li className="date-li"><div onClick="">27</div></li>
                                        <li className="date-li"><div onClick="">28</div></li>
                                        <li className="date-li"><div onClick="">29</div></li>
                                        <li className="date-li"><div onClick="">30</div></li>
                                        <li className="date-li"><div onClick="">31</div></li>
                                    </ul>
                                </li>
                                <li className="modal-date-li"><div onClick="">2019</div>
                                    <ul className="journal-entry-date-dropdown">
                                        <li className="date-li"><div onClick="">2019</div></li>
                                    </ul>
                                </li>
                                <li className="modal-date-li"><div onClick="">{this.date.getHours()}:{this.date.getMinutes()}</div>
                                    <ul className="journal-entry-date-dropdown">
                                        <li className="date-li"><div onClick="">00:00</div></li>
                                        <li className="date-li"><div onClick="">01:00</div></li>
                                        <li className="date-li"><div onClick="">02:00</div></li>
                                        <li className="date-li"><div onClick="">03:00</div></li>
                                        <li className="date-li"><div onClick="">04:00</div></li>
                                        <li className="date-li"><div onClick="">05:00</div></li>
                                        <li className="date-li"><div onClick="">06:00</div></li>
                                        <li className="date-li"><div onClick="">07:00</div></li>
                                        <li className="date-li"><div onClick="">08:00</div></li>
                                        <li className="date-li"><div onClick="">09:00</div></li>
                                        <li className="date-li"><div onClick="">10:00</div></li>
                                        <li className="date-li"><div onClick="">11:00</div></li>
                                        <li className="date-li"><div onClick="">12:00</div></li>
                                        <li className="date-li"><div onClick="">13:00</div></li>
                                        <li className="date-li"><div onClick="">14:00</div></li>
                                        <li className="date-li"><div onClick="">15:00</div></li>
                                        <li className="date-li"><div onClick="">16:00</div></li>
                                        <li className="date-li"><div onClick="">17:00</div></li>
                                        <li className="date-li"><div onClick="">18:00</div></li>
                                        <li className="date-li"><div onClick="">19:00</div></li>
                                        <li className="date-li"><div onClick="">20:00</div></li>
                                        <li className="date-li"><div onClick="">21:00</div></li>
                                        <li className="date-li"><div onClick="">22:00</div></li>
                                        <li className="date-li"><div onClick="">23:00</div></li>
                                        <li className="date-li"><div onClick="">24:00</div></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>


                        <div className="journal-modal-edit-stage-container">
                            <ul className="journal-modal-edit-stage">
                                <li className="modal-stage-li"><div onClick="">Veg</div>
                                    <ul className="journal-entry-stage-dropdown">
                                        <li className="stage-li"><div onClick="">Veg</div></li>
                                        <li className="stage-li"><div onClick="">Flower</div></li>
                                        <li className="stage-li"><div onClick="">Seedling</div></li>
                                        <li className="stage-li"><div onClick="">None</div></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>

                    </div>

                    <textarea className="journal-modal-edit-body" placeholder="enter body content..." value={this.state.content} onChange={this.handleContentChange} />

                    <div className="journal-add-images-area">

                        <Dropzone
                            onDrop={this.onImageDrop.bind(this)}
                            accept="image/*"
                            multiple={false}>
                            {({ getRootProps, getInputProps }) => {
                                return (
                                    <div
                                        {...getRootProps()}
                                    >
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
                                    <div className="Journal-Post-Images">
                                        {renderedThumbnails}
                                    </div>
                                )
                            }
                        })()}

                    </div>

                    <button className="journal-cancel-btn" onClick={this.closeModal}>Cancel</button>
                    <button className="journal-save-entry-btn" onClick={this.saveEntry}>Save Entry</button>

                </div>
            </div>
        );
    }
}

export default JournalAddEditModal;
