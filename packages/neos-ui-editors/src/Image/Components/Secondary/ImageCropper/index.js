import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import ReactCrop from 'react-image-crop';

import Icon from '@neos-project/react-ui-components/src/Icon/';
import IconButton from '@neos-project/react-ui-components/src/IconButton/';
import TextInput from '@neos-project/react-ui-components/src/TextInput/';

import AspectRatioDropDown from './AspectRatioDropDown/index';
import CropConfiguration from './model.js';
import style from './style.css';

/* eslint-disable no-unused-vars */
import ReactCropStyles from './react_crop.vanilla-css';
/* eslint-enable no-unused-vars */

class AspectRatioItem extends PureComponent {
    static propTypes = {
        key: PropTypes.any,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        onChange: PropTypes.func.isRequired,
        onFlipAspectRatio: PropTypes.func.isRequired,
        isLocked: PropTypes.bool
    };

    constructor(props) {
        super(props);

        this.handleWidthInputChange = this.handleInputChange.bind(this, 'width');
        this.handleHeightInputChange = this.handleInputChange.bind(this, 'height');
        this.handleFlipAspectRatio = this.props.onFlipAspectRatio.bind(this);
    }

    render() {
        const {width, height, key, isLocked} = this.props;

        return (
            <span key={key} className={style.dimensionsWrapper}>
                <TextInput
                    className={style.dimensionInput}
                    type="number"
                    value={width}
                    onChange={this.handleWidthInputChange}
                    disabled={isLocked}
                    />
                <IconButton
                    icon="exchange"
                    disabled={isLocked}
                    onClick={this.handleFlipAspectRatio}
                    />
                <TextInput
                    className={style.dimensionInput}
                    type="number"
                    value={height}
                    onChange={this.handleHeightInputChange}
                    disabled={isLocked}
                    />
            </span>
        );
    }

    handleInputChange(type, val) {
        const width = type === 'width' ? val : this.props.width;
        const height = type === 'height' ? val : this.props.height;

        this.props.onChange(Number(width), Number(height));
    }
}

export default class ImageCropper extends PureComponent {
    static propTypes = {
        onComplete: PropTypes.func.isRequired,
        sourceImage: PropTypes.object.isRequired,
        options: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.state = {
            cropConfiguration: CropConfiguration.fromNeosConfiguration(
                this.props.sourceImage,
                this.props.options.crop.aspectRatio
            )
        };

        this.handleSetAspectRatio = this.setAspectRatio.bind(this);
        this.handleClearAspectRatio = this.clearAspectRatio.bind(this);
        this.handleFlipAspectRatio = this.flipAspectRatio.bind(this);
        this.handleSetCustomAspectRatioDimensions = this.setCustomAspectRatioDimensions.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const {cropConfiguration} = this.state;

        this.setState({
            cropConfiguration: cropConfiguration.updateImage(nextProps.sourceImage)
        });
    }

    setAspectRatio(aspectRatioOption) {
        const {cropConfiguration} = this.state;
        this.setState({
            cropConfiguration: cropConfiguration.selectAspectRatioOption(aspectRatioOption)
        });
    }

    setCustomAspectRatioDimensions(width, height) {
        const {cropConfiguration} = this.state;

        this.setState({
            cropConfiguration: cropConfiguration.updateAspectRatioDimensions(width || 1, height || 1)
        });
    }

    flipAspectRatio() {
        const {cropConfiguration} = this.state;

        this.setState({
            cropConfiguration: cropConfiguration.flipAspectRatio()
        });
    }

    clearAspectRatio() {
        const {cropConfiguration} = this.state;

        this.setState({
            cropConfiguration: cropConfiguration.clearAspectRatio()
        });
    }

    render() {
        const {cropConfiguration} = this.state;
        const {height, width} = this.props.options.crop.aspectRatio.locked;
        const aspectRatioLocked = height > 0 && width > 0;
        const {sourceImage, onComplete} = this.props;
        const src = sourceImage.previewUri || '/_Resources/Static/Packages/Neos.Neos/Images/dummy-image.svg';

        if (aspectRatioLocked) {
            cropConfiguration.aspectRatioStrategy.__height = height;
            cropConfiguration.aspectRatioStrategy.__width = width;
        }

        return (
            <div style={{textAlign: 'center'}}>
                <div className={style.tools}>
                    <div className={style.aspectRatioIndicator}>
                        {
                            cropConfiguration.aspectRatioReducedLabel.map((label, index) => (
                                <div key={index}>
                                    <Icon key={index} icon="crop"/>,
                                    <span key={index} title={label}>{label}</span>,
                                    <span key={index}>{aspectRatioLocked ? <Icon icon="lock"/> : null}</span>
                                </div>
                            )).orSome('')
                        }
                    </div>

                    <AspectRatioDropDown
                        placeholder="Aspect Ratio"
                        current={cropConfiguration.aspectRatioStrategy}
                        options={cropConfiguration.aspectRatioOptions}
                        onSelect={this.handleSetAspectRatio}
                        onClear={this.handleClearAspectRatio}
                        isLocked={aspectRatioLocked}
                        />

                    <div className={style.dimensions}>
                        {cropConfiguration.aspectRatioDimensions.map((props, index) => (
                            <AspectRatioItem
                                {...props}
                                isLocked={aspectRatioLocked}
                                onFlipAspectRatio={this.handleFlipAspectRatio}
                                onChange={this.handleSetCustomAspectRatioDimensions}
                                key={index}
                                />
                        )).orSome('')}
                    </div>
                </div>

                <ReactCrop
                    src={src}
                    crop={cropConfiguration.cropInformation}
                    onComplete={onComplete}
                    />
            </div>
        );
    }
}
