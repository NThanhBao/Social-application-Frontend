import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Mail = () => {
    const [otpList, setOtpList] = useState([]);

    useEffect(() => {
        fetchOtpList();
    }, []);

    const fetchOtpList = async () => {
        try {
            const response = await axios.get('/admin/users-with-otp');
            setOtpList(response.data);
        } catch (error) {
            console.error('Error fetching OTP list:', error);
        }
    };

    return (
      <div style={{ marginLeft: '16%' }} className="container mx-auto mt-28 mb-6">
      <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                  <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" className="text-xs font-medium text-gray-500 uppercase tracking-wider">OTP</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiration Time</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                  <th scope="col" className="text-xs font-medium text-gray-500 uppercase tracking-wider">Used</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {otpList.map((otp) => (
                  <tr key={otp.id} className="hover:bg-gray-100">
                    <td className="px-6 py-4 whitespace-nowrap">{otp.id}</td>
                    <td >{otp.otp}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{otp.mail}</td>
                    <td >{new Date(otp.expirationTime).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(otp.createAt).toLocaleString()}</td>
                    <td >{otp.used ? 'Yes' : 'No'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{otp.userId.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{otp.userId.firstName} {otp.userId.lastName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
      
      
};

export default Mail;
