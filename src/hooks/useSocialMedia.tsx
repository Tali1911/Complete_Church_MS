import { useState, useEffect, memo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Facebook, Instagram, Youtube, Twitter, Music2, MessageCircle } from "lucide-react";
import { useDebounce } from "./useDebounce";

interface SocialMediaLink {
  platform: string;
  url: string;
  handle: string;
  icon: any;
}

export const useSocialMedia = () => {
  const [socialLinks, setSocialLinks] = useState<SocialMediaLink[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSocialMedia = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('social_media_handles')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;

      const iconMap: Record<string, any> = {
        'Facebook': Facebook,
        'Instagram': Instagram,
        'Youtube': Youtube,
        'YouTube': Youtube,
        'Twitter': Twitter,
        'Spotify': Music2,
        'TikTok': MessageCircle,
      };

      const formattedLinks = (data || []).map((handle) => ({
        platform: handle.platform,
        url: handle.url,
        handle: handle.handle,
        icon: iconMap[handle.icon] || iconMap[handle.platform] || Facebook,
      }));

      setSocialLinks(formattedLinks);
    } catch (error) {
      console.error('Error fetching social media links:', error);
      // Fallback to default links if fetch fails
      setSocialLinks([
        { platform: "Facebook", url: "https://www.facebook.com/share/18B3NZdmb2/", handle: "@totministries", icon: Facebook },
        { platform: "Instagram", url: "https://www.instagram.com/totministries?igsh=aWM3MW5xMGZpcXhx", handle: "@totministries", icon: Instagram },
        { platform: "YouTube", url: "https://youtube.com/@totministries", handle: "TOT Ministries", icon: Youtube },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSocialMedia();
  }, [fetchSocialMedia]);

  return { socialLinks, loading, refreshSocialMedia: fetchSocialMedia };
};