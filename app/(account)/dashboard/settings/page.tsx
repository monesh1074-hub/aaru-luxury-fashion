'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/authStore'
import { User, ShoppingBag, Heart, MapPin, LogOut, Settings, CheckCircle2, AlertCircle } from 'lucide-react'
import axios from 'axios'

export default function AccountSettingsPage() {
  const { logout, isAuthenticated, token } = useAuth()
  const { updateUser } = useAuthStore()

  // Profile form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const navigation = [
    { label: 'Overview', href: '/dashboard', icon: User },
    { label: 'My Orders', href: '/dashboard/orders', icon: ShoppingBag },
    { label: 'Wishlist', href: '/dashboard/wishlist', icon: Heart },
    { label: 'Addresses', href: '/dashboard/addresses', icon: MapPin },
    { label: 'Account Settings', href: '/dashboard/settings', icon: Settings, active: true },
  ]

  // Load current user profile
  useEffect(() => {
    if (!isAuthenticated) return
    axios
      .get('/api/user/profile', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (res.data.success) {
          setName(res.data.user.name || '')
          setEmail(res.data.user.email || '')
          setMobile(res.data.user.mobile || '')
        }
      })
      .catch(() => {})
  }, [isAuthenticated, token])

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileLoading(true)
    setProfileMsg(null)
    try {
      const res = await axios.put(
        '/api/user/profile',
        { name, email, mobile },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (res.data.success) {
        setProfileMsg({ type: 'success', text: 'Profile updated successfully!' })
        if (res.data.user) updateUser(res.data.user)
      } else {
        setProfileMsg({ type: 'error', text: res.data.message || 'Failed to update profile' })
      }
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' })
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordMsg(null)
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match' })
      return
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters' })
      return
    }
    setPasswordLoading(true)
    try {
      const res = await axios.put(
        '/api/user/profile',
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (res.data.success) {
        setPasswordMsg({ type: 'success', text: 'Password changed successfully!' })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setPasswordMsg({ type: 'error', text: res.data.message || 'Failed to change password' })
      }
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: err.response?.data?.message || 'Failed to change password' })
    } finally {
      setPasswordLoading(false)
    }
  }

  const inputClass =
    'w-full border border-[#E8E0D6] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A96E] transition-colors duration-200 bg-white'
  const labelClass = 'block text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary mb-1.5'

  return (
    <div className="bg-background min-h-screen font-body text-text-primary pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-12 border-b border-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-gold text-xs uppercase tracking-[0.3em] font-semibold block mb-1.5">
              Customer Account
            </span>
            <h1 className="font-display text-3xl font-semibold text-dark">Account Settings</h1>
          </div>
          <button
            onClick={logout}
            className="flex items-center space-x-2 text-xs uppercase tracking-wider font-semibold text-error hover:opacity-80 transition-opacity"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <nav className="lg:col-span-3 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-2 border-b lg:border-b-0 lg:border-r border-border pb-4 lg:pb-0 lg:pr-6">
            {navigation.map((nav, idx) => {
              const Icon = nav.icon
              return (
                <Link
                  key={idx}
                  href={nav.href}
                  className={`flex items-center space-x-3 px-4 py-3 text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-colors duration-300 w-full ${
                    nav.active
                      ? 'bg-gold/10 text-gold border-l border-gold font-bold'
                      : 'text-text-secondary hover:text-dark hover:bg-border/20'
                  }`}
                >
                  <Icon size={14} />
                  <span>{nav.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-10">

            {/* ── Profile Information ── */}
            <div className="border border-border bg-white">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-dark">
                  Profile Information
                </h3>
                <p className="text-[11px] text-text-secondary mt-0.5">Update your name, email, and mobile number.</p>
              </div>

              <form onSubmit={handleProfileSubmit} className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Mobile Number</label>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="10-digit mobile"
                      maxLength={10}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className={inputClass}
                  />
                </div>

                {profileMsg && (
                  <div
                    className={`flex items-center gap-2.5 px-4 py-3 text-xs font-medium border ${
                      profileMsg.type === 'success'
                        ? 'bg-green-50 border-green-200 text-green-700'
                        : 'bg-red-50 border-red-200 text-red-600'
                    }`}
                  >
                    {profileMsg.type === 'success' ? (
                      <CheckCircle2 size={14} className="shrink-0" />
                    ) : (
                      <AlertCircle size={14} className="shrink-0" />
                    )}
                    {profileMsg.text}
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="bg-dark text-white px-8 py-3 text-xs uppercase tracking-widest font-bold hover:bg-gold hover:text-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {profileLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>

            {/* ── Change Password ── */}
            <div className="border border-border bg-white">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-dark">
                  Change Password
                </h3>
                <p className="text-[11px] text-text-secondary mt-0.5">
                  Enter your current password and a new password to update it.
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="p-6 space-y-5">
                <div>
                  <label className={labelClass}>Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className={inputClass}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className={inputClass}
                    />
                  </div>
                </div>

                {passwordMsg && (
                  <div
                    className={`flex items-center gap-2.5 px-4 py-3 text-xs font-medium border ${
                      passwordMsg.type === 'success'
                        ? 'bg-green-50 border-green-200 text-green-700'
                        : 'bg-red-50 border-red-200 text-red-600'
                    }`}
                  >
                    {passwordMsg.type === 'success' ? (
                      <CheckCircle2 size={14} className="shrink-0" />
                    ) : (
                      <AlertCircle size={14} className="shrink-0" />
                    )}
                    {passwordMsg.text}
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="bg-dark text-white px-8 py-3 text-xs uppercase tracking-widest font-bold hover:bg-gold hover:text-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {passwordLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
