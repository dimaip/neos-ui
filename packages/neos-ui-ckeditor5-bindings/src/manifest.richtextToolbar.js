import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash.omit';
import {$get, $or} from 'plow-js';
import IconButton from '@neos-project/react-ui-components/src/IconButton/';
import LinkIconButton from './EditorToolbar/LinkIconButton';
import {neos} from '@neos-project/neos-ui-decorators';

// import LinkIconButton from './EditorToolbar/LinkIconButton';
import StyleSelect from './EditorToolbar/StyleSelect';
import RichTextToolbarRegistry from './registry/RichTextToolbarRegistry';

@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))
class IconButtonComponent extends PureComponent {
    static propTypes = {
        i18nRegistry: PropTypes.object,
        tooltip: PropTypes.string
    };
    render() {
        const finalProps = omit(this.props, ['formattingRule', 'i18nRegistry', 'tooltip']);
        return (<IconButton {...finalProps} title={this.props.i18nRegistry.translate(this.props.tooltip)}/>);
    }
}

//
// Create richtext editing toolbar registry
//
export default ckEditorRegistry => {
    const richtextToolbar = ckEditorRegistry.set('richtextToolbar', new RichTextToolbarRegistry(`
        Contains the Rich Text Editing Toolbar components.

        Buttons in the Rich Text Editing Toolbar are just plain React components.
        The only way for these components to communicate with CKE is via its commands mechanism
        (@see https://docs.ckeditor.com/ckeditor5/latest/framework/guides/architecture/core-editor-architecture.html#commands)
        Some commands may take arguments.
        Commands are provided and handled by CKE plugins. Refer to manifest.config.js to see how to configure custom plugins.

        The values are objects of the following form:

            {
                commandName: 'bold' // A CKE command that gets dispatched
                commandArgs: [arg1, arg2] // Additional arguments passed together with a command
                component: Button // the React component being used for rendering
                isVisible: (editorOptions, formattingUnderCursor) => true // A function that decides is the button should be visible or not
                isActive: (formattingUnderCursor, editorOptions) => true // A function that decides is the button should be active or not
                callbackPropName: 'onClick' // Name of the callback prop of the Component which is
                                            fired when the component's value changes.

                // all other properties are directly passed on to the component.
            }
    `));

    //
    // Configure richtext editing toolbar
    //

    /**
     * Basic Inline Styles (Bold, Italic, ...)
     */

    // Bold
    richtextToolbar.set('strong', {
        commandName: 'bold',
        component: IconButtonComponent,
        callbackPropName: 'onClick',
        icon: 'bold',
        hoverStyle: 'brand',
        tooltip: 'Neos.Neos.Ui:Main:ckeditor__toolbar__bold',
        isVisible: $get('formatting.strong'),
        isActive: $get('bold')
    });

    // Italic
    richtextToolbar.set('italic', {
        commandName: 'italic',
        component: IconButtonComponent,
        callbackPropName: 'onClick',
        icon: 'italic',
        hoverStyle: 'brand',
        tooltip: 'Neos.Neos.Ui:Main:ckeditor__toolbar__italic',
        isVisible: $get('formatting.em'),
        isActive: $get('italic')
    });

    // Underline
    richtextToolbar.set('underline', {
        commandName: 'underline',
        component: IconButtonComponent,
        callbackPropName: 'onClick',
        icon: 'underline',
        hoverStyle: 'brand',
        tooltip: 'Neos.Neos.Ui:Main:ckeditor__toolbar__underline',
        isVisible: $get('formatting.underline'),
        isActive: $get('underline')
    });

    // Subscript
    richtextToolbar.set('subscript', {
        commandName: 'sub',
        component: IconButtonComponent,
        callbackPropName: 'onClick',
        icon: 'subscript',
        hoverStyle: 'brand',
        tooltip: 'Neos.Neos.Ui:Main:ckeditor__toolbar__subscript',
        isVisible: $get('formatting.sub'),
        isActive: $get('sub')
    });

    // Superscript
    richtextToolbar.set('superscript', {
        commandName: 'sup',
        component: IconButtonComponent,
        callbackPropName: 'onClick',
        icon: 'superscript',
        hoverStyle: 'brand',
        tooltip: 'Neos.Neos.Ui:Main:ckeditor__toolbar__superscript',
        isVisible: $get('formatting.sup'),
        isActive: $get('sup')
    });

    // Strike-Through
    richtextToolbar.set('strikethrough', {
        commandName: 'strikethrough',
        component: IconButtonComponent,
        callbackPropName: 'onClick',
        icon: 'strikethrough',
        hoverStyle: 'brand',
        tooltip: 'Neos.Neos.Ui:Main:ckeditor__toolbar__strikethrough',
        isVisible: $get('formatting.strikethrough'),
        isActive: $get('strikethrough')
    });

    // Strike-Through
    richtextToolbar.set('link', {
        commandName: 'link',
        component: LinkIconButton,
        callbackPropName: 'onClick',
        icon: 'link',
        hoverStyle: 'brand',
        tooltip: 'Neos.Neos.Ui:Main:ckeditor__toolbar__link',
        isVisible: $get('formatting.a'),
        isActive: formattingUnderCursor => {
            const link = $get('link', formattingUnderCursor);
            return Boolean(link === '' || link);
        }
    });

    /**
     * Basic Paragraph Styles (p, h1, h2, pre, ...)
     */
    richtextToolbar.set('style', {
        component: StyleSelect,
        callbackPropName: 'onSelect',
        isVisible: () => true,
        isActive: $get('heading')
    });

    // P tag
    richtextToolbar.set('style/p', {
        commandName: 'heading',
        commandArgs: [{
            value: 'paragraph'
        }],
        label: 'Paragraph',
        isVisible: $get('formatting.p'),
        isActive: formattingUnderCursor => $get('heading', formattingUnderCursor) === false
    });

    // H1
    richtextToolbar.set('style/h1', {
        commandName: 'heading',
        commandArgs: [{
            value: 'heading1'
        }],
        label: 'Headline 1',
        isVisible: $get('formatting.h1'),
        isActive: formattingUnderCursor => $get('heading', formattingUnderCursor) === 'heading1'
    });

    // H2
    richtextToolbar.set('style/h2', {
        commandName: 'heading',
        commandArgs: [{
            value: 'heading2'
        }],
        label: 'Headline 2',
        isVisible: $get('formatting.h2'),
        isActive: formattingUnderCursor => $get('heading', formattingUnderCursor) === 'heading2'
    });

    // H3
    richtextToolbar.set('style/h3', {
        commandName: 'heading',
        commandArgs: [{
            value: 'heading3'
        }],
        label: 'Headline 3',
        isVisible: $get('formatting.h3'),
        isActive: formattingUnderCursor => $get('heading', formattingUnderCursor) === 'heading3'
    });

    // H4
    richtextToolbar.set('style/h4', {
        commandName: 'heading',
        commandArgs: [{
            value: 'heading4'
        }],
        label: 'Headline 4',
        isVisible: $get('formatting.h4'),
        isActive: formattingUnderCursor => $get('heading', formattingUnderCursor) === 'heading4'
    });

    // H5
    richtextToolbar.set('style/h5', {
        commandName: 'heading',
        commandArgs: [{
            value: 'heading5'
        }],
        label: 'Headline 5',
        isVisible: $get('formatting.h5'),
        isActive: formattingUnderCursor => $get('heading', formattingUnderCursor) === 'heading5'
    });

    // H6
    richtextToolbar.set('style/h6', {
        commandName: 'heading',
        commandArgs: [{
            value: 'heading6'
        }],
        label: 'Headline 6',
        isVisible: $get('formatting.h6'),
        isActive: formattingUnderCursor => $get('heading', formattingUnderCursor) === 'heading6'
    });

    // Pre
    richtextToolbar.set('style/pre', {
        commandName: 'heading',
        commandArgs: [{
            value: 'pre'
        }],
        label: 'Preformatted',
        isVisible: $get('formatting.pre'),
        isActive: formattingUnderCursor => $get('heading', formattingUnderCursor) === 'pre'
    });

    // // Example of custom headline
    // // Don't forget about updating the config registry with relevant config
    // // @see https://docs.ckeditor.com/ckeditor5/latest/features/headings.html
    //
    // richtextToolbar.set('style/fancy', {
    //     commandName: 'heading',
    //     commandArgs: [{
    //         value: 'headingFancy'
    //     }],
    //     label: 'Fancy',
    //     isVisible: $get('formatting.h1'),
    //     isActive: formattingUnderCursor => $get('heading', formattingUnderCursor) === 'headingFancy'
    // });

    // /**
    //  * Sorted and Unsorted Lists
    //  */

    // ordered list
    richtextToolbar.set('orderedList', {
        commandName: 'numberedList',
        component: IconButtonComponent,
        callbackPropName: 'onClick',
        icon: 'list-ol',
        hoverStyle: 'brand',
        tooltip: 'Neos.Neos.Ui:Main:ckeditor__toolbar__ordered-list',
        isVisible: $get('formatting.ol'),
        isActive: $get('numberedList')
    });

    // Unordered list
    richtextToolbar.set('unorderedList', {
        commandName: 'bulletedList',
        component: IconButtonComponent,
        callbackPropName: 'onClick',
        icon: 'list-ul',
        hoverStyle: 'brand',
        tooltip: 'Neos.Neos.Ui:Main:ckeditor__toolbar__unordered-list',
        isVisible: $get('formatting.ul'),
        isActive: $get('bulletedList')
    });

    // Indent
    richtextToolbar.set('indent', {
        commandName: 'indentList',
        component: IconButtonComponent,
        callbackPropName: 'onClick',
        icon: 'indent',
        hoverStyle: 'brand',
        tooltip: 'Neos.Neos.Ui:Main:ckeditor__toolbar__indent',
        isVisible: (editorOptions, formattingUnderCursor) => (
            // Cursor in ul
            $get('bulletedList', formattingUnderCursor) ||
            // Cursor in ol
            $get('numberedList', formattingUnderCursor) ||
            // Indent generally enabled
            $get('formatting.indent', editorOptions)
        )
    });

    // Outdent
    richtextToolbar.set('outdent', {
        commandName: 'outdentList',
        component: IconButtonComponent,
        callbackPropName: 'onClick',

        icon: 'outdent',
        hoverStyle: 'brand',
        tooltip: 'Neos.Neos.Ui:Main:ckeditor__toolbar__outdent',
        isVisible: (editorOptions, formattingUnderCursor) => (
            // Cursor in ul
            $get('bulletedList', formattingUnderCursor) ||
            // Cursor in ol
            $get('numberedList', formattingUnderCursor) ||
            // Outdent generally enabled
            $get('formatting.outdent', editorOptions)
        )
    });

    /**
     * Alignment
     */
    richtextToolbar.set('alignleft', {
        commandName: 'alignment',
        commandArgs: [{value: 'left'}],
        component: IconButtonComponent,
        callbackPropName: 'onClick',
        icon: 'align-left',
        hoverStyle: 'brand',
        tooltip: 'Neos.Neos.Ui:Main:ckeditor__toolbar__align-left',
        isVisible: $get('formatting.left'),
        isActive: formattingUnderCursor => $get('alignment', formattingUnderCursor) === 'left'
    });

    richtextToolbar.set('aligncenter', {
        commandName: 'alignment',
        commandArgs: [{value: 'center'}],
        component: IconButtonComponent,
        callbackPropName: 'onClick',
        icon: 'align-center',
        hoverStyle: 'brand',
        tooltip: 'Neos.Neos.Ui:Main:ckeditor__toolbar__align-center',
        isVisible: $get('formatting.center'),
        isActive: formattingUnderCursor => $get('alignment', formattingUnderCursor) === 'center'
    });

    richtextToolbar.set('alignright', {
        commandName: 'alignment',
        commandArgs: [{value: 'right'}],
        component: IconButtonComponent,
        callbackPropName: 'onClick',
        icon: 'align-right',
        hoverStyle: 'brand',
        tooltip: 'Neos.Neos.Ui:Main:ckeditor__toolbar__align-right',
        isVisible: $get('formatting.right'),
        isActive: formattingUnderCursor => $get('alignment', formattingUnderCursor) === 'right'
    });

    richtextToolbar.set('alignjustify', {
        commandName: 'alignment',
        commandArgs: [{value: 'justify'}],
        component: IconButtonComponent,
        callbackPropName: 'onClick',
        icon: 'align-justify',
        hoverStyle: 'brand',
        tooltip: 'Neos.Neos.Ui:Main:ckeditor__toolbar__align-justify',
        isVisible: $get('formatting.justify'),
        isActive: formattingUnderCursor => $get('alignment', formattingUnderCursor) === 'justify'
    });

    /**
     * Tables
     */
    richtextToolbar.set('table', {
        commandName: 'insertTable',
        commandArgs: [{rows: 2, columns: 5}],
        component: IconButtonComponent,
        callbackPropName: 'onClick',
        icon: 'table',
        hoverStyle: 'brand',
        tooltip: 'Neos.Neos.Ui:Main:ckeditor__toolbar__table',
        isVisible: $get('formatting.table'),
        isActive: formattingUnderCursor => $get('table', formattingUnderCursor)
    });

    // /**
    //  * Remove formatting
    //  */
    // richtextToolbar.set('removeFormat', {
    //     formattingRule: 'removeFormat',
    //     component: IconButtonComponent,
    //     callbackPropName: 'onClick',

    //     icon: 'eraser',
    //     hoverStyle: 'brand',
    //     tooltip: 'Neos.Neos.Ui:Main:ckeditor__toolbar__remove-format'
    // });

    return richtextToolbar;
};
