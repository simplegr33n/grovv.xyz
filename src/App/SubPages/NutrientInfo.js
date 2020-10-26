import React, { Component } from 'react';
import '../../styles/App.css';

import { BiHide } from 'react-icons/bi'
import { MdSettingsApplications } from 'react-icons/md'

class NutrientInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {

    }

    componentDidUpdate = () => {

    }


    render() {
        return (
            <div style={{ width: '100%' }}>

                <div style={{ width: '100%', marginLeft: '4px' }}>
                    <div style={{ textAlign: 'left', fontSize: '30px', userSelect: 'none', display: 'flex', flexDirection: 'row', background: "#1e4354", marginBottom: '2px' }}>

                        <MdSettingsApplications style={{ fontSize: "30px", padding: "4px", background: "#555555", cursor: 'pointer' }} />

                        <div style={{ fontSize: "24px", marginLeft: "2px", marginBottom: '2px' }}>
                            88888
                    </div>
                        <div style={{ flex: 1 }} />

                        <BiHide style={{ fontSize: "24px", padding: "4px", cursor: 'pointer', background: "#5882bf" }} />

                    </div >
                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginLeft: '4px' }}>
                        ....hhg
                    </div>
                </div>


                <div style={{ width: '100%', marginLeft: '4px' }}>
                    <div style={{ textAlign: 'left', fontSize: '30px', userSelect: 'none', display: 'flex', flexDirection: 'row', background: "#1e4354", marginBottom: '2px' }}>

                        <MdSettingsApplications style={{ fontSize: "30px", padding: "4px", background: "#555555", cursor: 'pointer' }} />

                        <div style={{ fontSize: "24px", marginLeft: "2px", marginBottom: '2px' }}>
                            88888
                    </div>
                        <div style={{ flex: 1 }} />

                        <BiHide style={{ fontSize: "24px", padding: "4px", cursor: 'pointer', background: "#5882bf" }} />

                    </div >
                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginLeft: '4px' }}>
                        ....hhg
                    </div>
                </div>
            </div>
        );
    }
}

export default NutrientInfo;
