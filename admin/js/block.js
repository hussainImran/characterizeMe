(function( $ ) {
    'use strict';

    const { select, dispatch } = wp.data;
    const { registerBlockType } = wp.blocks;
    const { TextControl } = wp.components;
    const { useEffect, useRef, useState } = wp.element;

    registerBlockType('custom/characterize-block', {
        title: 'Characterize Block',
        icon: 'smiley',
        category: 'common',
        attributes: {
            characterID: {
                type: String,
                default: '',
            },
            error: {
                type: String,
                default: '',
            },
        },
        edit: function (props) {
            const { attributes, setAttributes } = props;
            const postID = select('core/editor').getCurrentPostId();
            // Use a ref to track whether the effect has run
            const hasEffectRun = useRef(false);

            const [typingTimeout, setTypingTimeout] = useState(null);

            useEffect(() => {
                
                // Run the effect only if it hasn't run before
                if (!hasEffectRun.current) {
                    // if characterID is blank set default to the post_id
                    if (attributes.characterID === '' ) {
                        setAttributes({ characterID: postID });
                    }

                    // Mark the effect as run
                    hasEffectRun.current = true;
                }

                 // Clear previous timeout
                 if (typingTimeout) {
                    clearTimeout(typingTimeout);
                }

                // Set a new timeout for 700 milliseconds
                const timeout = setTimeout(() => {
                    fetchData();
                }, 700);

                // Save the timeout ID for cleanup
                setTypingTimeout(timeout);

                // Define an asynchronous function inside useEffect
                const fetchData = async () => {
                    if (postID && attributes.characterID !== '') {
                        try {
                            const response = await fetch('https://thronesapi.com/api/v2/Characters/' + attributes.characterID);
                            const data = await response.json();

                            if ( Object.keys(data).length > 1 && !data.hasOwnProperty('errors') ) {
                                // Remove error message
                                setAttributes({ error: '' });

                                // Update post title to fullName
                                dispatch('core/editor').editPost({ title: data.fullName });

                                // Set featured image to imageUrl
                                const thumbnailID = await getAttachmentID(data.imageUrl);
                                if (thumbnailID) {
                                    dispatch('core/editor').editPost({ featured_media: thumbnailID });
                                }
                            } else {
                                setAttributes({ error: 'No record found associated with this character ID' });
                            }
                        } catch (error) {
                            setAttributes({ error: 'Failed to make API call. For more info see console log.' });
                            console.error('API call failed:', error);
                        }
                    }
                };

            }, [attributes.characterID]);

            // Function to get attachment ID based on the image URL
            async function getAttachmentID(imageUrl) {
                try {
                    const response = await fetch(`${ajaxurl}?action=get_attachment_id&imageUrl=${imageUrl}&_nonce=${chobj.nonce}`);
                    const data = await response.json();
                    if(!data.error) {
                        return data.attachment_id
                    }
                    setAttributes({ error: data.message });
                    return 0;

                } catch (error) {
                    setAttributes({ error: 'Error getting attachment ID. For more info see console log.' });
                    console.error('Error getting attachment ID:', error);
                    return 0;
                }
            }

            return wp.element.createElement(
                'div',
                null,
                wp.element.createElement(TextControl, {
                    label: 'Character ID',
                    value: attributes.characterID,
                    onChange: (value) => {
                        setAttributes({ characterID: value.trim() });
                    },
                    className: attributes.error ? 'error-input' : '',
                }),
                attributes.error && wp.element.createElement(
                    'div',
                    {
                        className: ['character-error']
                    },
                    attributes.error
                )
            );
        },
        save: () => null, 
    });

})( jQuery );
