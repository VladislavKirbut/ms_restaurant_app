import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { updateProfile } from '../redux/slices/authSlice';
import { User, Mail, Phone, MapPin, Save, Upload } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.street || '',
    city: user?.city || '',
    state: user?.state || '',
    zip: user?.zip || '',
    country: user?.country || '',
    avatar: user?.avatar || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(updateProfile(formData));
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-primary">
      <div className="container-custom py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl text-accent mb-8">My Profile</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Avatar Section */}
              <div className="lg:col-span-1">
                <div className="card p-6">
                  <div className="text-center">
                    <div className="relative inline-block mb-4">
                      <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-medium border-4 border-accent">
                        {formData.avatar ? (
                          <img
                            src={formData.avatar}
                            alt={formData.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-20 h-20 text-gray-light" />
                          </div>
                        )}
                      </div>
                      {isEditing && (
                        <label className="absolute bottom-0 right-0 bg-accent text-primary p-3 rounded-full cursor-pointer hover:scale-110 transition-transform">
                          <Upload className="w-5 h-5" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                    <h2 className="text-2xl text-secondary mb-2">{formData.fullName}</h2>
                    <p className="text-gray-light">{user.role}</p>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="lg:col-span-2">
                <div className="card p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl text-secondary">Personal Information</h2>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="btn-secondary"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                      {/* Basic Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-secondary mb-2">Full Name</label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-light" />
                            <input
                              type="text"
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleChange}
                              disabled={!isEditing}
                              className="input-field pl-12 disabled:opacity-50"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-secondary mb-2">Email</label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-light" />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              disabled={!isEditing}
                              className="input-field pl-12 disabled:opacity-50"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-secondary mb-2">Phone</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-light" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="input-field pl-12 disabled:opacity-50"
                          />
                        </div>
                      </div>

                      {/* Address */}
                      <div className="pt-6 border-t border-gray-medium">
                        <div className="flex items-center gap-2 mb-4">
                          <MapPin className="w-5 h-5 text-accent" />
                          <h3 className="text-xl text-secondary">Delivery Address</h3>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-secondary mb-2">Street</label>
                            <input
                              type="text"
                              name="street"
                              value={formData.street}
                              onChange={handleChange}
                              disabled={!isEditing}
                              className="input-field disabled:opacity-50"
                              placeholder="123 Main Street"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-secondary mb-2">City</label>
                              <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="input-field disabled:opacity-50"
                                placeholder="New York"
                              />
                            </div>
                            <div>
                              <label className="block text-secondary mb-2">State</label>
                              <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="input-field disabled:opacity-50"
                                placeholder="NY"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-secondary mb-2">ZIP Code</label>
                              <input
                                type="text"
                                name="zip"
                                value={formData.zip}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="input-field disabled:opacity-50"
                                placeholder="10001"
                              />
                            </div>
                            <div>
                              <label className="block text-secondary mb-2">Country</label>
                              <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="input-field disabled:opacity-50"
                                placeholder="USA"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex gap-4 mt-8">
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            setFormData({
                              fullName: user?.fullName || '',
                              email: user?.email || '',
                              phone: user?.phone || '',
                              street: user?.street || '',
                              city: user?.city || '',
                              state: user?.state || '',
                              zip: user?.zip || '',
                              country: user?.country || '',
                              avatar: user?.avatar || '',
                            });
                          }}
                          className="flex-1 btn-secondary"
                        >
                          Cancel
                        </button>
                        <button type="submit" className="flex-1 btn-primary flex items-center justify-center gap-2">
                          <Save className="w-5 h-5" />
                          Save Changes
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
