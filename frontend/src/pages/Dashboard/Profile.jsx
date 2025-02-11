import React, { useState, useEffect } from 'react';
import { FaEdit, FaCamera, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getUserProfile, updateProfile, updateProfilePicture, updateBannerImage, updateSkills } from '../../services/userProfile';
import { useSelector } from 'react-redux';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [editingSkills, setEditingSkills] = useState([]);
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    title: '',
    bio: '',
    profile_picture: 'https://via.placeholder.com/150',
    banner_image: '',
    skills: []
  });

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getUserProfile();
      
      if (!response?.data) {
        throw new Error('Invalid profile data received');
      }

      const data = response.data.data;
      setProfileData({
        first_name: data.user_first_name || '',
        last_name: data.user_last_name || '',
        title: data.title || 'No Title',
        bio: data.bio || '',
        profile_picture: data.profile_picture ? `http://localhost:8000${data.profile_picture}` : 'https://via.placeholder.com/150',
        banner_image: data.banner_image ? `http://localhost:8000${data.banner_image}` : '',
        skills: data.skills || []
      });
      console.log('Profile data:', data);
      
    } catch (error) {
      console.error('Profile fetch error:', error);
      toast.error(error.message || 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  // Handle skills input
  const handleSkillInputChange = (e) => {
    setSkillInput(e.target.value);
  };

  // Handle skills input paste
  const handleSkillInputPaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const skills = pastedText
      .split(/[,\n]/) // Split by comma or newline
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
    
    // Add each skill that isn't already in the list
    skills.forEach(skill => {
      if (!editingSkills.includes(skill)) {
        setEditingSkills(prev => [...prev, skill]);
      }
    });
  };

  // Handle skill input blur
  const handleSkillInputBlur = () => {
    if (skillInput.trim()) {
      addSkill();
    }
  };

  // Handle skill input keydown
  const handleSkillInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill();
    } else if (e.key === 'Backspace' && skillInput === '' && editingSkills.length > 0) {
      // Remove last skill when backspace is pressed on empty input
      setEditingSkills(prev => prev.slice(0, -1));
    }
  };

  // Add skill to the list
  const addSkill = () => {
    const trimmedSkill = skillInput.trim().replace(/,/g, '');
    if (trimmedSkill && !editingSkills.includes(trimmedSkill)) {
      setEditingSkills(prev => [...prev, trimmedSkill]);
      setSkillInput('');
    } else if (trimmedSkill && editingSkills.includes(trimmedSkill)) {
      toast.info('This skill is already in your list');
      setSkillInput('');
    }
  };

  // Remove skill from the list
  const removeSkill = (skillToRemove) => {
    setEditingSkills(prev => prev.filter(skill => skill !== skillToRemove));
  };

  // Initialize skills editing
  const startEditingSkills = () => {
    setEditingSkills(profileData.skills.map(skill => skill.name));
    setSkillInput('');
    setIsEditingSkills(true);
  };

  // Handle skills update
  const handleSkillsUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateSkills(editingSkills);
      await fetchProfile();
      setIsEditingSkills(false);
      toast.success('Skills updated successfully');
    } catch (error) {
      toast.error('Failed to update skills');
    }
  };

  // Handle profile update
  const handleUpdate = async (updateData) => {
    try {
      setLoading(true);
      await updateProfile(updateData);
      await fetchProfile();
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Handle profile picture update
  const handleProfilePictureUpdate = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profile_picture', file);

    try {
      await updateProfilePicture(formData);
      toast.success('Profile picture updated successfully');
      await fetchProfile();
    } catch (error) {
      toast.error('Failed to update profile picture');
    }
  };

  // Handle banner image update
  const handleBannerUpdate = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('banner_image', file);

    try {
      await updateBannerImage(formData);
      toast.success('Banner image updated successfully');
      await fetchProfile();
    } catch (error) {
      toast.error('Failed to update banner image');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Banner Image */}
        <div className="relative h-48">
          <div 
            className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 relative"
            style={profileData.banner_image ? {
              backgroundImage: `url(${profileData.banner_image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            } : {}}
          >
            <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 cursor-pointer transition-opacity">
              <FaCamera className="text-white text-3xl" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleBannerUpdate}
              />
            </label>
          </div>
          {/* Profile Picture */}
          <div className="absolute -bottom-16 left-8">
            <div className="relative group">
              <img
                src={profileData.profile_picture}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
              />
              <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                <FaCamera className="text-white text-2xl" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleProfilePictureUpdate}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-20 px-8 pb-8">
          {isEditing ? (
            <form onSubmit={(e) => handleUpdate({
              first_name: profileData.first_name,
              last_name: profileData.last_name,
              profile: {
                title: profileData.title,
                bio: profileData.bio
              }
            })} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    value={profileData.first_name}
                    onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    value={profileData.last_name}
                    onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={profileData.title}
                  onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Tell us about yourself"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold">
                    {profileData.first_name} {profileData.last_name}
                  </h1>
                  <p className="text-gray-600">{profileData.title}</p>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-500 hover:text-blue-500"
                >
                  <FaEdit size={20} />
                </button>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2">About</h2>
                <p className="text-gray-600">
                  {profileData.bio || 'No bio available'}
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold">Skills</h2>
                  {!isEditingSkills && (
                    <button
                      onClick={startEditingSkills}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Update Skills
                    </button>
                  )}
                </div>
                {isEditingSkills ? (
                  <form onSubmit={handleSkillsUpdate} className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Type a skill and press Enter or comma to add it
                      </label>
                      <div className="p-2 border rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {editingSkills.map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                              {skill}
                              <button
                                type="button"
                                onClick={() => removeSkill(skill)}
                                className="ml-1 text-blue-600 hover:text-blue-800"
                              >
                                <FaTimes size={12} />
                              </button>
                            </span>
                          ))}
                        </div>
                        <input
                          type="text"
                          value={skillInput}
                          onChange={handleSkillInputChange}
                          onKeyDown={handleSkillInputKeyDown}
                          onPaste={handleSkillInputPaste}
                          onBlur={handleSkillInputBlur}
                          className="w-full focus:outline-none"
                          placeholder="Type a skill and press Enter or comma..."
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingSkills(false)}
                        className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Save Skills
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {skill.name}
                      </span>
                    ))}
                    {profileData.skills.length === 0 && (
                      <p className="text-gray-500">No skills added yet</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
