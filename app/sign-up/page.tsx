'use client';

import Link from 'next/link';
import { useState } from 'react';
import AuthSidebar from '@/components/AuthSidebar';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [passwordStrength, setPasswordStrength] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'password') {
      if (value.length === 0) setPasswordStrength('');
      else if (value.length < 8) setPasswordStrength('Weak');
      else if (value.length < 12) setPasswordStrength('Medium strength');
      else setPasswordStrength('Strong');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign up
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12 bg-surface">
        <div className="w-full max-w-sm">
          {/* Logo and Progress */}
          <div className="mb-12">
            <h1 className="text-h2 font-serif text-ink mb-2">MindGym</h1>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-teal-600"></div>
              <div className="w-2 h-2 rounded-full bg-teal-100"></div>
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-h3 font-serif text-ink mb-2">Create your account</h2>
          <p className="text-b3 text-ink-60 mb-8">Start your mental journey</p>

          {/* Google Sign Up */}
          <button
            onClick={() => {
              // Google sign-up logic would go here
              console.log('Sign up with Google');
            }}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-lg hover:bg-teal-10 transition-colors mb-6"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-b2 text-ink">Sign up with Google</span>
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-surface text-ink-60 text-b3">or sign up with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-b4 text-ink-60 block mb-2">First name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Claire"
                  className="w-full px-3 py-2 border border-border rounded-lg text-b2 placeholder:text-ink-30 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
              <div>
                <label className="text-b4 text-ink-60 block mb-2">First name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Claire"
                  className="w-full px-3 py-2 border border-border rounded-lg text-b2 placeholder:text-ink-30 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            <div>
              <label className="text-b4 text-ink-60 block mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Claire@gmail.com"
                className="w-full px-3 py-2 border border-border rounded-lg text-b2 placeholder:text-ink-30 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="text-b4 text-ink-60 block mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className="w-full px-3 py-2 border border-border rounded-lg text-b2 placeholder:text-ink-30 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
              {passwordStrength && (
                <p className="text-b4 text-warning mt-2">
                  {passwordStrength === 'Weak' && '🔴 ' + passwordStrength}
                  {passwordStrength === 'Medium strength' && '🟡 ' + passwordStrength + ' — add a symbol to make it stronger'}
                  {passwordStrength === 'Strong' && '🟢 ' + passwordStrength}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 bg-teal-600 text-white font-sans font-medium rounded-lg hover:bg-teal-700 transition-colors"
            >
              Sign up →
            </button>
          </form>

          {/* Agreement */}
          <div className="flex items-start gap-3 mt-4">
            <input type="checkbox" className="mt-1" />
            <p className="text-b4 text-ink-60">
              I agree to receive personalised coaching tips and session reminders. You can unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Sidebar */}
      <AuthSidebar
        message="The search is hard. Your mindset doesn't have to be."
        subtitle="MindGym · Built for job seekers"
      />
    </div>
  );
}
