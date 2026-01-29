import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'



export interface ClientProfile {
  id: string
  user_id: string
  full_name: string | null
  phone: string | null
  company: string | null
  language: string
  notifications: string
  currency: string
  default_origin: string | null
  preferred_transporters: string
  insurance_level: string
  profile_picture_url: string | null
  // Billing and payment fields
  card_number: string | null
  card_expiry: string | null
  card_cvv: string | null
  billing_address: string | null
  tax_id: string | null
  billing_company_name: string | null
  created_at: string
  updated_at: string
}

export interface ProfileFormData {
  full_name: string
  phone: string
  company: string
  language: string
  notifications: string
  currency: string
  default_origin: string
  preferred_transporters: string
  insurance_level: string
  // Billing and payment fields
  card_number: string
  card_expiry: string
  card_cvv: string
  billing_address: string
  tax_id: string
  billing_company_name: string
}

export function useClientProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<ClientProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)



  // Fetch profile data
  const fetchProfile = async () => {
    if (!user?.id) {
      return
    }
    const role = (user as any)?.user_metadata?.userType
    if (role && role !== 'client') {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw fetchError
      }

      if (data) {
        setProfile(data)
      } else {
        // Create default profile if none exists
        await createDefaultProfile()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching profile')
    } finally {
      setLoading(false)
    }
  }

  // Create default profile
  const createDefaultProfile = async () => {
    if (!user?.id) {
      return
    }
    const role = (user as any)?.user_metadata?.userType
    if (role && role !== 'client') return

    const defaultProfile = {
      user_id: user.id,
      full_name: user?.user_metadata?.name || null,
      phone: null,
      company: null,
      language: 'es',
      notifications: 'all',
      currency: 'GTQ',
      default_origin: null,
      preferred_transporters: 'any',
      insurance_level: 'basic',
      profile_picture_url: null,
      // Billing and payment defaults
      card_number: null,
      card_expiry: null,
      card_cvv: null,
      billing_address: null,
      tax_id: null,
      billing_company_name: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    try {
      // First, let's check if the table exists and has the right structure
      const { data: tableInfo, error: tableError } = await supabase
        .from('client_profiles')
        .select('*')
        .limit(1)
      
      if (tableError) {
        throw new Error(`Table access error: ${tableError.message}`)
      }

      const { data, error: createError } = await supabase
        .from('client_profiles')
        .insert(defaultProfile)
        .select()
        .single()

      if (createError) {
        throw createError
      }

      setProfile(data)
      setError(null) // Clear any previous errors
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error creating profile'
      setError(errorMessage)
      
      // If it's a table structure issue, provide more helpful error
      if (errorMessage.includes('column') || errorMessage.includes('relation')) {
        setError(`Database structure issue: ${errorMessage}. Please check your Supabase table configuration.`)
      }
    }
  }

  // Update profile
  const updateProfile = async (formData: ProfileFormData) => {
    if (!profile?.id) {
      return { success: false, error: 'No se encontró el perfil. Intenta recargar la página.' }
    }

    try {
      setSaving(true)
      setError(null)

      const updateData = {
        full_name: formData.full_name || null,
        phone: formData.phone || null,
        company: formData.company || null,
        language: formData.language,
        notifications: formData.notifications,
        currency: formData.currency,
        default_origin: formData.default_origin || null,
        preferred_transporters: formData.preferred_transporters,
        insurance_level: formData.insurance_level,
        // Billing and payment fields
        card_number: formData.card_number || null,
        card_expiry: formData.card_expiry || null,
        card_cvv: formData.card_cvv || null,
        billing_address: formData.billing_address || null,
        tax_id: formData.tax_id || null,
        billing_company_name: formData.billing_company_name || null,
        updated_at: new Date().toISOString(),
      }

      const { data, error: updateError } = await supabase
        .from('client_profiles')
        .update(updateData)
        .eq('id', profile.id)
        .select()
        .single()

      if (updateError) throw updateError

      setProfile(data)
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error updating profile'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setSaving(false)
    }
  }

  // Update profile picture
  const updateProfilePicture = async (file: File): Promise<{ success: boolean; url?: string; error?: string }> => {
    if (!user?.id) return { success: false, error: 'User not authenticated' }

    try {
      setSaving(true)
      setError(null)

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `profile-pictures/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update profile with new picture URL
      if (profile?.id) {
        const { error: updateError } = await supabase
          .from('client_profiles')
          .update({ 
            profile_picture_url: publicUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', profile.id)

        if (updateError) throw updateError

        // Update local state
        setProfile(prev => prev ? { ...prev, profile_picture_url: publicUrl } : null)
      }

      return { success: true, url: publicUrl }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error updating profile picture'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setSaving(false)
    }
  }

  // Remove profile picture
  const removeProfilePicture = async (): Promise<{ success: boolean; error?: string }> => {
    if (!profile?.id || !profile.profile_picture_url) return { success: false, error: 'No profile picture to remove' }

    try {
      setSaving(true)
      setError(null)

      // Extract file path from URL
      const urlParts = profile.profile_picture_url.split('/')
      const fileName = urlParts[urlParts.length - 1]
      const filePath = `profile-pictures/${fileName}`

      // Delete file from storage
      const { error: deleteError } = await supabase.storage
        .from('avatars')
        .remove([filePath])

      if (deleteError) throw deleteError

      // Update profile to remove picture URL
      const { error: updateError } = await supabase
        .from('client_profiles')
        .update({ 
          profile_picture_url: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id)

      if (updateError) throw updateError

      // Update local state
      setProfile(prev => prev ? { ...prev, profile_picture_url: null } : null)

      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error removing profile picture'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setSaving(false)
    }
  }

  // Reset profile to default values
  const resetProfile = async () => {
    if (!profile?.id) {
      return { success: false, error: 'No se encontró el perfil. Intenta recargar la página.' }
    }

    try {
      setSaving(true)
      setError(null)

      const defaultValues = {
        full_name: user?.user_metadata?.name || null,
        phone: null,
        company: null,
        language: 'es',
        notifications: 'all',
        currency: 'GTQ',
        default_origin: null,
        preferred_transporters: 'any',
        insurance_level: 'basic',
        updated_at: new Date().toISOString(),
      }

      const { data, error: updateError } = await supabase
        .from('client_profiles')
        .update(defaultValues)
        .eq('id', profile.id)
        .select()
        .single()

      if (updateError) throw updateError

      setProfile(data)
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error resetting profile'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setSaving(false)
    }
  }

  // Fetch profile on mount and when user changes
  useEffect(() => {
    if (user?.id) {
      fetchProfile()
    } else {
      setProfile(null)
      setLoading(false)
    }
  }, [user?.id])







  return {
    profile,
    loading,
    error,
    saving,
    updateProfile,
    updateProfilePicture,
    removeProfilePicture,
    resetProfile,
    refetch: fetchProfile,
  }
}
