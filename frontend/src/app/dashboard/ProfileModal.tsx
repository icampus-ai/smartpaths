import { useState } from 'react';
import { User, Edit, CreditCard, Save, DollarSign } from 'lucide-react';

interface ProfileModalProps {
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'subscription' | 'payment'>('profile');
  const [user, setUser] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    username: '',
    dateOfBirth: '',
    email: '',
    bio: '',
    occupation: '',
    organization: '',
    paymentMethod: '',
    cardName: '',
    cardNumber: '',
    cvv: '',
    expiryDate: '',
    pinCode: '',
    subscriptionPlan: '',
  });

  const occupations = [
    'Select Occupation',
    'High School Teacher',
    'Elementary School Teacher',
    'Middle School Teacher',
    'College Professor',
    'University Lecturer',
    'Special Education Teacher',
    'Preschool Teacher',
    'Kindergarten Teacher',
    'Online Instructor',
    'Tutor',
    'Curriculum Developer',
    'Education Consultant',
    'School Administrator',
    'Education Researcher',
    'Instructional Designer',
    'School Counselor',
    'School Nurse',
    'School Librarian',
    'Education Policy Analyst',
    'Education Technology Specialist',
  ];

  const organizations = [
    'Select Organization',
    'Tech High School',
    'State University',
    'Community College',
    'Private School',
    'Online Learning Platform',
    'National University',
    'International School',
    'Public School',
    'Charter School',
    'Virtual Academy',
    'Educational Institute',
    'Research Institute',
    'Training Center',
    'Academic Institution',
    'Learning Center',
  ];

  const paymentMethods = [
    'Select any',
    'Credit Card',
    'Debit Card',
    'Venmo',
    'CashApp',
    'Zelle',
  ];

  const subscriptionPlans = [
    'Select Plan',
    'Basic',
    'Standard',
    'Premium',
  ];

  const handleTabChange = (tab: 'profile' | 'subscription' | 'payment') => {
    setActiveTab(tab);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Here you can add logic to save the user data
    console.log('User data saved:', user);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">User Profile</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="flex border-b border-gray-200 mb-4">
          <button
            onClick={() => handleTabChange('profile')}
            className={`flex items-center px-4 py-2 text-gray-500 hover:text-gray-700 border-b-2 ${
              activeTab === 'profile' ? 'border-blue-500 text-blue-500' : 'border-transparent'
            }`}
          >
            <Edit className="mr-2" />
            Profile
          </button>
          <button
            onClick={() => handleTabChange('subscription')}
            className={`flex items-center px-4 py-2 text-gray-500 hover:text-gray-700 border-b-2 ${
              activeTab === 'subscription' ? 'border-blue-500 text-blue-500' : 'border-transparent'
            }`}
          >
            <DollarSign className="mr-2" />
            Subscription
          </button>
          <button
            onClick={() => handleTabChange('payment')}
            className={`flex items-center px-4 py-2 text-gray-500 hover:text-gray-700 border-b-2 ${
              activeTab === 'payment' ? 'border-blue-500 text-blue-500' : 'border-transparent'
            }`}
          >
            <CreditCard className="mr-2" />
            Payment
          </button>
        </div>
        {activeTab === 'profile' && (
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-gray-200 border-2 border-dashed rounded-full w-16 h-16 mr-4" />
              <div className="space-y-2">
                <input
                  type="text"
                  name="firstName"
                  value={user.firstName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="First Name"
                />
                <input
                  type="text"
                  name="middleName"
                  value={user.middleName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Middle Name (optional)"
                />
                <input
                  type="text"
                  name="lastName"
                  value={user.lastName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Last Name"
                />
                <input
                  type="text"
                  name="username"
                  value={user.username}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Username"
                />
                <input
                  type="date"
                  name="dateOfBirth"
                  value={user.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Date of Birth"
                />
              </div>
            </div>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 mb-2"
              placeholder="Email"
            />
            <textarea
              name="bio"
              value={user.bio}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 mb-2"
              placeholder="Bio"
              rows={4}
            />
            <div className="space-y-2">
              <select
                name="occupation"
                value={user.occupation}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              >
                {occupations.map((occupation) => (
                  <option key={occupation} value={occupation}>
                    {occupation}
                  </option>
                ))}
              </select>
              <select
                name="organization"
                value={user.organization}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              >
                {organizations.map((organization) => (
                  <option key={organization} value={organization}>
                    {organization}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        {activeTab === 'subscription' && (
          <div>
            <select
              name="subscriptionPlan"
              value={user.subscriptionPlan}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 mb-2"
            >
              {subscriptionPlans.map((plan) => (
                <option key={plan} value={plan}>
                  {plan}
                </option>
              ))}
            </select>
          </div>
        )}
        {activeTab === 'payment' && (
          <div>
            <select
              name="paymentMethod"
              value={user.paymentMethod}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 mb-2"
            >
              {paymentMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
            {(user.paymentMethod === 'Credit Card' || user.paymentMethod === 'Debit Card') && (
              <div className="space-y-2">
                <input
                  type="text"
                  name="cardName"
                  value={user.cardName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Name on Card"
                />
                <input
                  type="text"
                  name="cardNumber"
                  value={user.cardNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Card Number"
                />
                <input
                  type="text"
                  name="cvv"
                  value={user.cvv}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="CVV"
                />
                <input
                  type="text"
                  name="expiryDate"
                  value={user.expiryDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Expiry Date"
                />
                <input
                  type="text"
                  name="pinCode"
                  value={user.pinCode}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Pin Code"
                />
              </div>
            )}
          </div>
        )}
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
          >
            <Save className="mr-2" />
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;