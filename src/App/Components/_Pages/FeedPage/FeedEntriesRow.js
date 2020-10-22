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

        console.log("MentryTime", entryTime.getMonth())

        console.log("DentryTime", entryTime.getDate())

        var renderEntryColumns = this.props.substancesList.map((substance) => {
            if (this.props.entry[substance]) {
                return <div key={substance + this.props.entry.time} style={{ width: '60px', height: '20px', background: '#a8be9d', margin: '1px', fontSize: '12px', color: '#000' }}>{this.props.entry[substance]}</div>
            } else {
                return <div key={substance + this.props.entry.time} style={{ width: '60px', height: '20px', background: '#263225', margin: '1px' }} />
            }

        })


        // MAIN RENDER RETURN
        return (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ width: '70px', fontSize: '12px', textAlight: 'right', marginRight: '1px', background: '#000' }}>
                    {entryTime.getMonth() + 1}-{entryTime.getDate()}
                </div>

                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    {renderEntryColumns}
                </div>
            </div>
        );
    }
}

export default FeedEntriesRow;
