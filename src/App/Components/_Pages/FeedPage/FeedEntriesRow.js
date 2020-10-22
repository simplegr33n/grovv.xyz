import React, { Component } from 'react'
import '../../../../styles/App.css'



class FeedEntriesRow extends Component {

    constructor(props) {
        super(props);

        this.state = {

        };
    }



    render() {

        var entryTime = new Date(this.props.entry.time * 1000)


        var renderFeedEntryHeaders = this.props.runSubstancesList.map((substance) => {
            return (
                <div key={substance} style={{ background: '#236313', height: '20px', width: '50px', margin: '1px', color: '#fff', fontSize: '10px' }} >{this.props.feedData._SUBSTANCE_DEFS[substance].name}</div>
            )
        })

        var renderEntryValueColumns = this.props.runSubstancesList.map((substance) => {
            if (this.props.entry[substance]) {
                return <div key={substance + this.props.entry.time} style={{ background: '#a8be9d', height: '20px', width: '50px', margin: '1px', color: '#000', fontSize: '10px' }}>{this.props.entry[substance]}</div>
            } else {
                return <div key={substance + this.props.entry.time} style={{ width: '50px', height: '20px', background: '#263225', margin: '1px' }} />
            }

        })


        // MAIN RENDER RETURN
        return (

            <div style={{ display: 'flex', flexDirection: 'column', background: '#667951', marginBottom: '2px' }}>

                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ width: '40px', fontSize: '12px', textAlight: 'right', marginRight: '1px', background: '#000' }}>
                        {entryTime.getMonth() + 1}-{entryTime.getDate()}
                    </div>
                    {renderFeedEntryHeaders}
                </div>




                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ width: '40px', fontSize: '12px', textAlight: 'right', marginRight: '1px', background: '#000' }}>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        {renderEntryValueColumns}
                    </div>
                </div>


                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ width: '40px', fontSize: '12px', textAlight: 'right', marginRight: '1px', background: '#000' }}>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div style={{ background: '#236313', height: '20px', width: '50px', margin: '1px', color: '#fff', fontSize: '10px' }}>
                            ppm pre
                            </div>

                        <div style={{ background: '#236313', height: '20px', width: '50px', margin: '1px', color: '#fff', fontSize: '10px' }}>
                            pH pre
                            </div>

                        <div style={{ background: '#236313', height: '20px', width: '50px', margin: '1px', color: '#fff', fontSize: '10px' }}>
                            ppm post
                            </div>

                        <div style={{ background: '#236313', height: '20px', width: '50px', margin: '1px', color: '#fff', fontSize: '10px' }}>
                            pH post
                            </div>

                    </div>
                </div>



                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ width: '40px', fontSize: '12px', textAlight: 'right', marginRight: '1px', background: '#000' }}>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'row' }}>



                        {(() => {
                            if (this.props.entry['ppm_pre']) {
                                return (
                                    <div style={{ background: '#a8be9d', height: '20px', width: '50px', margin: '1px', color: '#000', fontSize: '10px' }}>
                                        {this.props.entry['ppm_pre']}
                                    </div>
                                )
                            } else {
                                return (
                                    <div style={{ background: '#263225', height: '20px', width: '50px', margin: '1px', color: '#000', fontSize: '10px' }}>
                                    </div>
                                )
                            }
                        })()}

                        {(() => {
                            if (this.props.entry['ph_pre']) {
                                return (
                                    <div style={{ background: '#a8be9d', height: '20px', width: '50px', margin: '1px', color: '#000', fontSize: '10px' }}>
                                        {this.props.entry['ph_pre']}
                                    </div>
                                )
                            } else {
                                return (
                                    <div style={{ background: '#263225', height: '20px', width: '50px', margin: '1px', color: '#000', fontSize: '10px' }}>
                                    </div>
                                )
                            }
                        })()}

                        {(() => {
                            if (this.props.entry['ppm_post']) {
                                return (
                                    <div style={{ background: '#a8be9d', height: '20px', width: '50px', margin: '1px', color: '#000', fontSize: '10px' }}>
                                        {this.props.entry['ppm_post']}
                                    </div>
                                )
                            } else {
                                return (
                                    <div style={{ background: '#263225', height: '20px', width: '50px', margin: '1px', color: '#000', fontSize: '10px' }}>
                                    </div>
                                )
                            }
                        })()}


                        {(() => {
                            if (this.props.entry['ph_post']) {
                                return (
                                    <div style={{ background: '#a8be9d', height: '20px', width: '50px', margin: '1px', color: '#000', fontSize: '10px' }}>
                                        {this.props.entry['ph_post']}
                                    </div>
                                )
                            } else {
                                return (
                                    <div style={{ background: '#263225', height: '20px', width: '50px', margin: '1px', color: '#000', fontSize: '10px' }}>
                                    </div>
                                )
                            }
                        })()}

                    </div>
                </div>

            </div>



        );
    }
}

export default FeedEntriesRow;
