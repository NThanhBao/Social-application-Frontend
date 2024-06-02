import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { avatarBaseUrl } from '../../services/Constants';

const ShowListUserShare = ({ shares }) => {

    console.log("Shares data:", shares);

    return (
        <React.Fragment>
            {shares && shares.length > 0 ? (
                shares.map((sharedUser, index) => (
                    <div key={index} >
                        <Link className="hover:scale-105 transition-transform duration-300 flex items-start mt-4 p-4 border-t border-gray-200 bg-white/50 shadow-lg backdrop-blur-lg rounded-lg" to={`/profile/${sharedUser.createBy.id}`}>
                            {sharedUser.createBy.avatar && (
                                <img src={`${avatarBaseUrl}${sharedUser.createBy.avatar}`} alt="Avatar" className="w-12 h-12 rounded-full mr-4" />
                            )}
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <div>
                                        <p className="text-sm font-semibold">{sharedUser.createBy.firstName} {sharedUser.createBy.lastName}</p>
                                        <p className="text-sm">@{sharedUser.createBy.username}</p>
                                    </div>
                                    <p className="text-xs text-gray-500">{formatDistanceToNow(new Date(sharedUser.createAt), { addSuffix: true })}</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))
            ) : (
                <p className="text-center text-red-500 mt-4">No shares available</p>
            )}
        </React.Fragment>
    );
};

export default ShowListUserShare;
