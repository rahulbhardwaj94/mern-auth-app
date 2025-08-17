import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user, updatePassword, updateProfile } = useAuth();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    mobileNumber: user?.mobileNumber || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const result = await updatePassword(passwordData.currentPassword, passwordData.newPassword);
      
      if (result.success) {
        setSuccess('Password updated successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordForm(false);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await updateProfile(profileData);
      
      if (result.success) {
        setSuccess('Profile updated successfully!');
        setShowProfileForm(false);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Profile Card */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Profile Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">User ID</label>
              <p className="text-gray-800 font-mono text-sm">{user?.userId}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Full Name</label>
              <p className="text-gray-800">{user?.firstName} {user?.lastName}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-gray-800">{user?.email}</p>
              {user?.isEmailVerified && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2">
                  ✓ Verified
                </span>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Mobile Number</label>
              <p className="text-gray-800">{user?.mobileNumber}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Member Since</label>
              <p className="text-gray-800">{formatDate(user?.createdAt)}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Last Updated</label>
              <p className="text-gray-800">{formatDate(user?.updatedAt)}</p>
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            <button
              onClick={() => setShowProfileForm(!showProfileForm)}
              className="btn-secondary w-full"
            >
              {showProfileForm ? 'Cancel Edit' : 'Edit Profile'}
            </button>
            
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="btn-primary w-full"
            >
              {showPasswordForm ? 'Cancel' : 'Change Password'}
            </button>
          </div>
        </div>

        {/* Forms Section */}
        <div className="space-y-6">
          {/* Profile Update Form */}
          {showProfileForm && (
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>
              
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="editFirstName" className="form-label">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="editFirstName"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleProfileChange}
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="editLastName" className="form-label">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="editLastName"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleProfileChange}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="editMobileNumber" className="form-label">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    id="editMobileNumber"
                    name="mobileNumber"
                    value={profileData.mobileNumber}
                    onChange={handleProfileChange}
                    className="input-field"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </form>
            </div>
          )}

          {/* Password Update Form */}
          {showPasswordForm && (
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Change Password</h3>
              
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="form-label">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="form-label">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="input-field"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {success}
        </div>
      )}
    </div>
  );
};

export default Home;
