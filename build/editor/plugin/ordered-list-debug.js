/*
Copyright 2014, KISSY v5.0.0
MIT Licensed
build time: Apr 29 15:05
*/
/*
combined modules:
editor/plugin/ordered-list
*/
/**
 * @ignore
 * Add ul/ol button.
 * @author yiminghe@gmail.com
 */
KISSY.add('editor/plugin/ordered-list', [
    './list-utils/btn',
    './ordered-list/cmd'
], function (S, require) {
    var ListButton = require('./list-utils/btn');
    var ListCmd = require('./ordered-list/cmd');
    function orderedList() {
    }
    S.augment(orderedList, {
        pluginRenderUI: function (editor) {
            ListCmd.init(editor);
            ListButton.init(editor, {
                cmdType: 'insertOrderedList',
                buttonId: 'orderedList',
                menu: {
                    width: 75,
                    children: [
                        {
                            content: '1,2,3...',
                            value: 'decimal'
                        },
                        {
                            content: 'a,b,c...',
                            value: 'lower-alpha'
                        },
                        {
                            content: 'A,B,C...',
                            value: 'upper-alpha'
                        },
                        // ie 678 not support!
                        //                        {
                        //                            content: 'α,β,γ...',
                        //                            value: 'lower-greek'
                        //                        },
                        //
                        //                        {
                        //                            content: 'Α,Β,Γ...',
                        //                            value: 'upper-greek'
                        //                        },
                        {
                            content: 'i,ii,iii...',
                            value: 'lower-roman'
                        },
                        {
                            content: 'I,II,III...',
                            value: 'upper-roman'
                        }
                    ]
                },
                tooltip: '\u6709\u5E8F\u5217\u8868'
            });
        }
    });
    return orderedList;
});

