import React from 'react';

const CreateComment = ({ avatarUrl, handleCommentSubmit, handleInputChange, handleKeyPress, content }) => {
    return (
        <div className="mt-6">
            <form onSubmit={handleCommentSubmit} className="flex items-center">
                <img src={avatarUrl} alt="User Avatar" className="rounded-full w-10 h-10" />
                <input
                    style={{ borderRadius: '50px', marginLeft: '0.5rem' }}
                    className="w-full py-2 px-4 border border-gray-300 rounded-full"
                    placeholder="Add a comment..."
                    value={content}
                    required
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                />
                <button
                    type="submit"
                    onSubmit={handleCommentSubmit}
                    className=" text-blue-700 hover:bg-blue-100 font-bold py-2 px-4 rounded"
                >
                    Send
                </button>   
            </form>
        </div>
    );
};

export default CreateComment;
