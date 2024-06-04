import React, { useState } from 'react';
import { RegisterService, validateFormData } from '../../../services/auth/RegisterService';

function RegisterForm() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        mail: '',
        phoneNumber: '',
        firstName: '',
        lastName: '',
        gender: '',
        dateOfBirth: { day: '', month: '', year: '' }
    });

    const [registrationMessage, setRegistrationMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const validatedData = validateFormData(formData);
            const response = await RegisterService(validatedData);
            setRegistrationMessage(response);
            window.location.href = '/login';
            setError('');
        } catch (error) {
            setError(error);
        }
    };

    return (
        <div style={{ marginTop: '5%' }}>
            <form onSubmit={handleSubmit} style={{ backgroundColor: '#f0f2f5', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }} className="max-w-xl w-full mx-auto p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
            <h5 className="text-center font-bold text-3xl text-gray-900 dark:text-white">Sign Up</h5>
                <div className="relative z-0 w-full mb-5 group">
                    <input type="text" name="username" value={formData.username} onChange={handleChange} id="username" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">User name</label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                    <input type="email" name="mail" value={formData.mail} onChange={handleChange} id="floating_email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                    <input type="password" name="password" value={formData.password} onChange={handleChange} id="floating_password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} id="floating_repeat_password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Confirm password</label>
                </div>
                <div className="grid md:grid-cols-2 md:gap-6">
                    <div className="relative z-0 w-full mb-5 group">
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} id="floating_first_name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">First name</label>
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} id="floating_last_name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Last name</label>
                    </div>
                </div>

                <div className="relative z-0 w-full mb-5 group">
                    <input type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} id="floating_phone" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Phone number (123-456-7890)</label>
                </div>
                <div className="grid md:grid-cols-2 md:gap-6">
                    <div className="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700" style={{ height: '35px', marginBottom: '20px', backgroundColor: 'white' }}>
                        <input id="bordered-radio-1" type="radio" value="male" name="gender" onChange={handleChange} className="w-4 h-3 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        <label className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Male</label>
                    </div>
                    <div className="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700" style={{ height: '35px', marginBottom: '20px', backgroundColor: 'white' }}>
                        <input id="bordered-radio-2" type="radio" value="female" name="gender" onChange={handleChange} className="w-4 h-3 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        <label className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Female</label>
                    </div>
                </div>
                <div className='mb-3'>
                    <div className="day-month-year-container">
                        <div>
                            <select className="form-select" name="day" value={formData.day} onChange={handleChange}>
                                <option value="">Day</option>
                                {[...Array(31)].map((_, index) => (
                                    <option key={index + 1} value={index + 1}>{index + 1}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <select className="form-select" name="month" value={formData.month} onChange={handleChange}>
                                <option value="">Month</option>
                                {[...Array(12)].map((_, index) => (
                                    <option key={index + 1} value={index + 1}>{index + 1}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <select className="form-select" name="year" value={formData.year} onChange={handleChange}>
                                <option value="">Year</option>
                                {[...Array(100)].map((_, index) => (
                                    <option key={index + 1920} value={index + 1920}>{index + 1920}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <button
                        type="submit"
                        style={{ width: '100%' }}
                        className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-20 py-3 text-center me-2 mb-2"
                    >
                        Register
                    </button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {registrationMessage && <p>{registrationMessage}</p>}
                </div>
                <div style={{ marginTop: '15px' }} className="text-sm font-medium text-gray-500 dark:text-gray-300">Already have an account?
                    <a href="/login" className="text-blue-700 hover:underline dark:text-blue-500"> Login account</a>
                </div>
            </form>
        </div>
    );
}

export default RegisterForm;
