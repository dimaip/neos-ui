import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import {connect} from 'react-redux';
import {
    SideBar,
    Tabs,
    IconButton,
    TextInput,
    ToggablePanel
} from '../../Components/';
import actions from '../../Ducks/';
import style from './style.css';
import {immutableOperations} from '../../../Shared/Util';

const {$get} = immutableOperations;

@connect(state => ({
    isHidden: $get(state, 'ui.rightSidebar.isHidden')
}))
export default class LeftSideBar extends Component {
    static propTypes = {
        isHidden: PropTypes.bool.isRequired,
        dispatch: PropTypes.any.isRequired
    }

    render() {
        const {isHidden} = this.props;
        const classNames = mergeClassNames({
            [style.rightSideBar]: true,
            [style['rightSideBar--isHidden']]: isHidden
        });
        const toggleIcon = isHidden ? 'chevron-left' : 'chevron-right';

        return (
            <SideBar position="right" className={classNames}>
                <Tabs>
                    <Tabs.Panel icon="pencil">
                        <ToggablePanel
                            className={style.rightSideBar__section}
                            title="My fancy configuration"
                            >
                            <TextInput
                                label="Title"
                                placeholder="Type to search"
                                />
                        </ToggablePanel>

                    </Tabs.Panel>
                    <Tabs.Panel icon="cog">
                        <p>Content #2 here</p>
                    </Tabs.Panel>
                    <Tabs.Panel icon="bullseye">
                        <p>Content #3 here</p>
                    </Tabs.Panel>
                </Tabs>

                <IconButton
                    icon={toggleIcon}
                    className={style.rightSideBar__toggleBtn}
                    onClick={this.toggleSidebar.bind(this)}
                    />
            </SideBar>
        );
    }

    toggleSidebar() {
        this.props.dispatch(actions.UI.RightSideBar.toggleSideBar());
    }
}
