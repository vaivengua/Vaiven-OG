import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export interface TransporterProfile {
  id: string
  user_id: string
  full_name: string | null
  phone: string | null
  company: string | null
  language: string
  notifications: string
  service_areas: string | null
  vehicle_types: string | null
  capacity_kg: number | null
  bio: string | null
  fleet_size: number | null
  operating_hours: string | null
  vehicle_plate: string | null
  license_number: string | null
  insurance_provider: string | null
  insurance_number: string | null
  years_experience: number | null
  preferred_routes: string | null
  dpi_number: string | null
  birth_date: string | null
  birth_place: string | null
  address: string | null
  profile_picture_url: string | null
  created_at: string
  updated_at: string
}

export interface TransporterProfileFormData {
  full_name: string
  phone: string
  company: string
  language: string
  notifications: string
  service_areas: string
  vehicle_types: string
  capacity_kg: string
  bio: string
  fleet_size: string
  operating_hours: string
  vehicle_plate: string
  license_number: string
  insurance_provider: string
  insurance_number: string
  years_experience: string
  preferred_routes: string
  dpi_number?: string
  birth_date?: string
  birth_place?: string
  address?: string
}

export function useTransporterProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<TransporterProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const fetchProfile = async () => {
    if (!user?.id) return
    // Only transporters should load/create transporter profiles
    const role = (user as any)?.user_metadata?.userType
    if (role !== 'transporter') {
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      setError(null)
      const { data, error: fetchError } = await supabase
        .from('transporter_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()
      if (fetchError) throw fetchError
      if (data) {
        const loaded = data as TransporterProfile
        setProfile(loaded)
        // Sync from auth metadata if missing in profile
        const meta: any = (user as any)?.user_metadata || {}
        const patch: Record<string, any> = {}
        if (!loaded.full_name && meta.name) patch.full_name = meta.name
        if (!loaded.phone && meta.phone) patch.phone = meta.phone
        if (!loaded.company && meta.company) patch.company = meta.company
        if (Object.keys(patch).length > 0) {
          try {
            const { data: updated, error: updErr } = await supabase
              .from('transporter_profiles')
              .update({ ...patch, updated_at: new Date().toISOString() })
              .eq('id', loaded.id)
              .select()
              .single()
            if (!updErr && updated) setProfile(updated as TransporterProfile)
          } catch {
            // ignore sync error
          }
        }
      } else {
        await createDefaultProfile()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching transporter profile')
    } finally {
      setLoading(false)
    }
  }

  const createDefaultProfile = async () => {
    if (!user?.id) return
    const role = (user as any)?.user_metadata?.userType
    if (role !== 'transporter') return
    const defaultProfile = {
      user_id: user.id,
      full_name: user?.user_metadata?.name || null,
      phone: (user as any)?.user_metadata?.phone || null,
      company: (user as any)?.user_metadata?.company || null,
      language: 'es',
      notifications: 'all',
    }
    try {
      const { data, error: insertError } = await supabase
        .from('transporter_profiles')
        .insert(defaultProfile)
        .select()
        .single()
      if (insertError) throw insertError
      setProfile(data as TransporterProfile)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating transporter profile')
    }
  }

  const updateProfile = async (formData: Partial<TransporterProfileFormData>) => {
    if (!profile?.id) return { success: false, error: 'Perfil no encontrado' }
    try {
      setSaving(true)
      setError(null)
      const updateData = {
        full_name: formData.full_name ?? profile.full_name ?? null,
        phone: formData.phone ?? profile.phone ?? null,
        company: formData.company ?? profile.company ?? null,
        language: formData.language ?? profile.language,
        notifications: formData.notifications ?? profile.notifications,
        service_areas: formData.service_areas ?? profile.service_areas ?? null,
        vehicle_types: formData.vehicle_types ?? profile.vehicle_types ?? null,
        capacity_kg: formData.capacity_kg !== undefined ? (formData.capacity_kg ? Number(formData.capacity_kg) : null) : profile.capacity_kg,
        bio: formData.bio ?? profile.bio ?? null,
        fleet_size: formData.fleet_size !== undefined ? (formData.fleet_size ? Number(formData.fleet_size) : null) : profile.fleet_size,
        operating_hours: formData.operating_hours ?? profile.operating_hours ?? null,
        vehicle_plate: formData.vehicle_plate ?? profile.vehicle_plate ?? null,
        license_number: formData.license_number ?? profile.license_number ?? null,
        insurance_provider: formData.insurance_provider ?? profile.insurance_provider ?? null,
        insurance_number: formData.insurance_number ?? profile.insurance_number ?? null,
        years_experience: formData.years_experience !== undefined ? (formData.years_experience ? Number(formData.years_experience) : null) : profile.years_experience,
        preferred_routes: formData.preferred_routes ?? profile.preferred_routes ?? null,
        dpi_number: formData.dpi_number ?? (profile as any).dpi_number ?? null,
        birth_date: formData.birth_date ?? (profile as any).birth_date ?? null,
        birth_place: formData.birth_place ?? (profile as any).birth_place ?? null,
        address: formData.address ?? (profile as any).address ?? null,
        updated_at: new Date().toISOString(),
      }
      const { data, error: updateError } = await supabase
        .from('transporter_profiles')
        .update(updateData)
        .eq('id', profile.id)
        .select()
        .single()
      if (updateError) throw updateError
      setProfile(data as TransporterProfile)
      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error updating transporter profile'
      setError(message)
      return { success: false, error: message }
    } finally {
      setSaving(false)
    }
  }

  const updateProfilePicture = async (file: File) => {
    if (!user?.id || !profile?.id) return { success: false, error: 'User not authenticated' }
    try {
      setSaving(true)
      setError(null)
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `profile-pictures/${fileName}`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)
      if (uploadError) throw uploadError
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)
      const { error: updateError } = await supabase
        .from('transporter_profiles')
        .update({ profile_picture_url: publicUrl, updated_at: new Date().toISOString() })
        .eq('id', profile.id)
      if (updateError) throw updateError
      setProfile(prev => prev ? { ...prev, profile_picture_url: publicUrl } : prev)
      return { success: true, url: publicUrl }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error updating picture'
      setError(message)
      return { success: false, error: message }
    } finally {
      setSaving(false)
    }
  }

  const removeProfilePicture = async () => {
    if (!profile?.id || !profile.profile_picture_url) return { success: false, error: 'No profile picture' }
    try {
      setSaving(true)
      setError(null)
      const urlParts = profile.profile_picture_url.split('/')
      const fileName = urlParts[urlParts.length - 1]
      const filePath = `profile-pictures/${fileName}`
      await supabase.storage.from('avatars').remove([filePath])
      const { error: updateError } = await supabase
        .from('transporter_profiles')
        .update({ profile_picture_url: null, updated_at: new Date().toISOString() })
        .eq('id', profile.id)
      if (updateError) throw updateError
      setProfile(prev => prev ? { ...prev, profile_picture_url: null } : prev)
      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error removing picture'
      setError(message)
      return { success: false, error: message }
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    if (user?.id) fetchProfile()
    else {
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
    refetch: fetchProfile,
  }
}


