import React from 'react';

const CreatePost = ({
    showModal,
    handleCloseModal,
    handleFormSubmit,
    handleImageChange,
    handleVideoChange,
    handleImageRemove,
    handleVideoRemove,
    body,
    setBody,
    status,
    setStatus,
    imageUrl,
    videoUrl,
    firstName,
    lastName,
    avatarUrl,
}) => {

    return (
        <>
            {showModal && (
                <div id="crud-modal" tabIndex="-1" aria-hidden="true" className="fixed inset-0 overflow-y-auto z-50">
                    <div className="flex items-center min-h-screen">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                        <div className="absolute w-full mx-auto p-6 bg-white rounded-lg shadow-md z-50 lg:ml-custom  sm:ml-0 lg:w-2/5 sm:w-full">
                            <form onSubmit={handleFormSubmit}>
                                <div className="flex justify-between w-full">
                                    <div className="flex">
                                        <img style={{ marginRight: '1rem' }} src={avatarUrl} alt="User Avatar" className="rounded-full w-10 h-10" />
                                        <div>
                                            <h1 className="text-sm font-medium">{`${firstName} ${lastName}`}</h1>
                                            <div className="mb-4">
                                                <select
                                                    id="status"
                                                    value={status}
                                                    onChange={(e) => setStatus(e.target.value)}
                                                    required
                                                    style={{ fontSize: 'small', padding: '1px', paddingLeft: '2px', width: '70px' }}
                                                    className="block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                                >
                                                    <option value="public">Public</option>
                                                    <option value="private">Private</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-4 h-4"
                                        viewBox="0 0 384 512"
                                        onClick={handleCloseModal}
                                    >
                                        <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                                    </svg>
                                </div>
                                <div className="mb-4">
                                    <textarea
                                        id="body"
                                        value={body}
                                        onChange={(e) => setBody(e.target.value)}
                                        required
                                        className="mt-1 p-2 block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    ></textarea>
                                </div>
                                <div className="_8icz"></div>
                                <div className="flex justify-between mt-4">
                                    <div className="mb-4 flex items-center">
                                        <label htmlFor="image" className="block cursor-pointer">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="w-8 h-8">
                                                <path fill="#54ba40" d="M160 80H512c8.8 0 16 7.2 16 16V320c0 8.8-7.2 16-16 16H490.8L388.1 178.9c-4.4-6.8-12-10.9-20.1-10.9s-15.7 4.1-20.1 10.9l-52.2 79.8-12.4-16.9c-4.5-6.2-11.7-9.8-19.4-9.8s-14.8 3.6-19.4 9.8L175.6 336H160c-8.8 0-16-7.2-16-16V96c0-8.8 7.2-16 16-16zM96 96V320c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H160c-35.3 0-64 28.7-64 64zM48 120c0-13.3-10.7-24-24-24S0 106.7 0 120V344c0 75.1 60.9 136 136 136H456c13.3 0 24-10.7 24-24s-10.7-24-24-24H136c-48.6 0-88-39.4-88-88V120zm208 24a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
                                            </svg>
                                            <input type="file" id="image" onChange={handleImageChange} className="hidden" />
                                        </label>
                                        <p className="ml-2">Image</p>
                                    </div>
                                    <div className="mb-4 flex items-center">
                                        <label htmlFor="live" className="block cursor-pointer ml-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="w-8 h-8">
                                                <path fill="#b81414" d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z" />
                                            </svg>                                        </label>
                                        <label htmlFor="Live" className="ml-2">Live</label>
                                    </div>
                                    <div className="mb-4 flex items-center">
                                        <label htmlFor="video" className="block cursor-pointer ml-2 ">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="w-8 h-6 ">
                                                <path fill="#0285e8" d="M64 64V352H576V64H64zM0 64C0 28.7 28.7 0 64 0H576c35.3 0 64 28.7 64 64V352c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zM128 448H512c17.7 0 32 14.3 32 32s-14.3 32-32 32H128c-17.7 0-32-14.3-32-32s14.3-32 32-32z" />
                                            </svg>
                                            <input type="file" id="video" onChange={handleVideoChange} className="hidden" accept="video/*" title="Video" />
                                        </label>
                                        <label htmlFor="video" className="block text-sm font-medium text-gray-700">Video</label>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="w-8 h-6">
                                            <path fill="#e4c44e" d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm177.6 62.1C192.8 334.5 218.8 352 256 352s63.2-17.5 78.4-33.9c9-9.7 24.2-10.4 33.9-1.4s10.4 24.2 1.4 33.9c-22 23.8-60 49.4-113.6 49.4s-91.7-25.5-113.6-49.4c-9-9.7-8.4-24.9 1.4-33.9s24.9-8.4 33.9 1.4zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
                                        </svg>                                        <p className="ml-2">feeling</p>
                                    </div>
                                </div>
                                {imageUrl && (
                                    <div>
                                        <div className="mb-4 relative">
                                            <button
                                                type="button"
                                                onClick={handleImageRemove}
                                                className="absolute top-0 right-0 text-blue-500 font-semibold hover:text-blue-700 focus:outline-none z-10"
                                            >
                                                Remove Image
                                            </button>
                                            <img src={imageUrl} alt="Selected Image" className="w-full max-h-60 object-contain mb-2" />
                                        </div>
                                    </div>
                                )}

                                {videoUrl && (
                                    <div>
                                        <div className="mb-4 relative">
                                            <button
                                                type="button"
                                                onClick={handleVideoRemove}
                                                className="absolute top-0 right-0 text-blue-500 font-semibold hover:text-blue-700 focus:outline-none z-10"
                                            >
                                                Remove Video
                                            </button>
                                            <video src={videoUrl} controls className="w-full max-h-60 object-contain mb-2"></video>
                                        </div>
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-20 py-3 text-center me-2 mb-2 w-full "
                                >
                                    Created post
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CreatePost;
