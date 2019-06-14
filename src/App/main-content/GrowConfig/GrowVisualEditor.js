import React, { Component } from 'react';
import '../../../styles/App.css';

import { ReactComponent as Area } from './SVGs/area.svg'
import { ReactComponent as Container } from './SVGs/container.svg'



class GrowVisualEditor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            baseDimensionsPixels: null
        };

        this.visualEditorSizeUpdate = 0;
        this.baseDimensions = [0, 0]
        this.editorDimensions = [0, 0]

    }

    componentDidMount() {
        this._ismounted = true;
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    componentDidUpdate() {
        if (this._ismounted === false) {
            return;
        }

        var dateNow = new Date()
        if (((this.state.elementSize !== [this.divRef.clientWidth, this.divRef.clientHeight]) && ((dateNow.getTime() - this.visualEditorSizeUpdate) > 500))) {
            var tempSize = [this.divRef.clientWidth, this.divRef.clientHeight]

            if (tempSize !== this.state.elementSize) {
                this.setState({ editorDimensions: tempSize });
                this.visualEditorSizeUpdate = dateNow.getTime();
            }
        }

        if (this.props.baseDimensions && this.state.editorDimensions) {
            if ((this.props.baseDimensions !== this.baseDimensions) || (this.props.editorDimensions !== this.editorDimensions)) {
                this.baseDimensions = this.props.baseDimensions
                this.editorDimensions = this.props.editorDimensions

                var widthOverHeight = this.props.baseDimensions[0] / this.props.baseDimensions[1]

                var baseWidth;
                var baseHeight;
                if (widthOverHeight <= 1) {
                    baseWidth = (this.state.editorDimensions[1] * 0.9) * widthOverHeight
                    baseHeight = this.state.editorDimensions[1] * 0.9
                } else {
                    baseWidth = this.state.editorDimensions[1] * 0.9
                    baseHeight = (this.state.editorDimensions[1] * 0.9) / widthOverHeight
                }


                var setDimensions = [baseWidth, baseHeight]

                this.setState({ baseDimensionsPixels: setDimensions })

            }

        }

    }



    render() {
        return (

            <div id="Grow-Visual-Editor" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ backgroundColor: '#36454F', margin: '1%', padding: '1%', flex: '1' }} ref={element => this.divRef = element}>
                    {(() => {
                        if (this.state.baseDimensionsPixels) {
                            return (
                                <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', margin: '0 auto', width: this.state.baseDimensionsPixels[0], height: this.state.baseDimensionsPixels[1] }}>
                                    <Area style={{ position: 'absolute', width: '100%', height: '100%' }} />
                                    <div style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'row' }}>
                                        <Container style={{ flex: '1', padding: '1%' }} />
                                        <Container style={{ flex: '1', padding: '1%' }} />
                                    </div>
                                </div>
                            )
                        }
                    })()}


                </div>

                {/* <Area /> */}
            </div>

        );
    }
}

export default GrowVisualEditor;
