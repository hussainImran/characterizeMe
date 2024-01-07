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
                    handleInitialEffect();
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
                async function fetchData() {
                    if (postID && attributes.characterID !== '') {
                        try {
                            const data = await makeApiCall(attributes.characterID);

                            if (Object.keys(data).length > 1 && !data.hasOwnProperty('errors')) {
                                handleApiSuccess(data);
                            } else {
                                handleApiError('No record found associated with this character ID');
                            }
                        } catch (error) {
                            handleApiError('Failed to make API call. For more info see console log.', error);
                        }
                    }
                }

                async function makeApiCall(characterID) {
                    const response = await fetch(`https://thronesapi.com/api/v2/Characters/${characterID}`);
                    return response.json();
                }

                function handleFeaturedImage(imageUrl) {
                    getAttachmentID(imageUrl)
                        .then(thumbnailID => {
                            if (thumbnailID) {
                                dispatch('core/editor').editPost({ featured_media: thumbnailID });
                            }
                        })
                        .catch(error => handleApiError('Error getting attachment ID. For more info see console log.', error));
                }

                // Function to get attachment ID based on the image URL
                async function getAttachmentID(imageUrl) {
                    const response = await fetch(`${ajaxurl}?action=get_attachment_id&imageUrl=${imageUrl}&_nonce=${chobj.nonce}`);
                    const data = await response.json();

                    if (!data.error) {
                        return data.attachment_id;
                    }

                    handleApiError(data.message);
                    return 0;
                }

                function handleApiSuccess(data) {
                    setAttributes({ error: '' });
                    dispatch('core/editor').editPost({ title: data.fullName });
                    handleFeaturedImage(data.imageUrl);
                }

                function handleApiError(errorMessage, error = null) {
                    setAttributes({ error: errorMessage });
                    if(error)console.error('API call failed:', error);
                }

                function handleInitialEffect() {
                    // if characterID is blank set default to the post_id
                    if (attributes.characterID === '') {
                        setAttributes({ characterID: postID });
                    }
                }

            }, [attributes.characterID]);

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
