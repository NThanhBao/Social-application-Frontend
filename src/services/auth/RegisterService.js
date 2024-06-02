import axios from 'axios';

export const RegisterService = async (formData) => {
    try {
        const response = await axios.post('/auth/register', formData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const validateFormData = (formData) => {
    const { day, month, year, gender, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
        throw "Passwords don't match";
    }

    if (!day || !month || !year) {
        throw 'Please select a valid date of birth.';
    }

    const dateOfBirth = new Date(`${year}-${month}-${day}`);
    const isMale = gender === 'male';
    formData.dateOfBirth = dateOfBirth.toISOString();
    formData.gender = isMale;

    return formData;
};
