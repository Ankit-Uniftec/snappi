// import { useState, useEffect } from 'react';
// import { supabase } from '@/integrations/supabase/client';

// export interface Influencer {
//   id: string;
//   name: string;
//   platform: string | null;
//   follower_count: number | null;
//   engagement_rate: number;
//   match_score: number | null;
//   categories: string | null;
//   location: string | null;
//   tags: string | null;
//   profile_image: string | null;
//   average_views: number | null;
//   created_at: string | null;
//   // Email will only be available to authorized users
//   email?: string | null;
// }

// interface UseInfluencersReturn {
//   influencers: Influencer[];
//   loading: boolean;
//   error: string | null;
//   canAccessContactInfo: (influencerId: string) => boolean;
// }

// export function useInfluencers(): UseInfluencersReturn {
//   const [influencers, setInfluencers] = useState<Influencer[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [userHasAdminRole, setUserHasAdminRole] = useState(false);
//   const [userCampaignInfluencers, setUserCampaignInfluencers] = useState<Set<string>>(new Set());

//   // Check if current user can access contact info for a specific influencer
//   const canAccessContactInfo = (influencerId: string): boolean => {
//     return userHasAdminRole || userCampaignInfluencers.has(influencerId);
//   };

//   useEffect(() => {
//     const fetchInfluencers = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // Get current user
//         const { data: { user } } = await supabase.auth.getUser();

//         // Fetch influencer data
//         const { data: influencerData, error: influencerError } = await supabase
//           .from('influencers')
//           .select(`
//             id,
//             name,
//             platform,
//             follower_count,
//             engagement_rate,
//             match_score,
//             categories,
//             location,
//             tags,
//             profile_image,
//             average_views,
//             created_at,
//             email
//           `);

//         if (influencerError) {
//           throw influencerError;
//         }

//         // Check user permissions if authenticated
//         if (user) {
//           // Check if user is admin
//           const { data: userRoles } = await supabase
//             .from('user_roles')
//             .select('role')
//             .eq('user_id', user.id);

//           const isAdmin = userRoles?.some(role => role.role === 'admin') || false;
//           setUserHasAdminRole(isAdmin);

//           // Get influencers from user's campaigns
//           const { data: campaignInfluencers } = await supabase
//             .from('campaign_influencers')
//             .select(`
//               influencer_id,
//               campaign_id,
//               campaigns!inner(owner_id)
//             `)
//             .eq('campaigns.owner_id', user.id);

//           const accessibleInfluencerIds = new Set(
//             campaignInfluencers?.map(ci => ci.influencer_id) || []
//           );
//           setUserCampaignInfluencers(accessibleInfluencerIds);

//           // Filter email field based on permissions
//           const filteredInfluencers = influencerData?.map(influencer => ({
//             ...influencer,
//             email: (isAdmin || accessibleInfluencerIds.has(influencer.id)) 
//               ? influencer.email 
//               : null
//           })) || [];

//           setInfluencers(filteredInfluencers);
//         } else {
//           // For non-authenticated users, remove email field entirely
//           const publicInfluencers = influencerData?.map(({ email, ...influencer }) => influencer) || [];
//           setInfluencers(publicInfluencers);
//         }

//       } catch (err) {
//         console.error('Error fetching influencers:', err);
//         setError(err instanceof Error ? err.message : 'Failed to fetch influencers');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInfluencers();
//   }, []);

//   return {
//     influencers,
//     loading,
//     error,
//     canAccessContactInfo
//   };
// }

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Influencer {
  id: string;
  name: string;
  platform: string | null;
  platform_link: string | null;
  follower_count: number | null;
  engagement_rate: number;
  match_score: number | null;
  categories: string | null;
  location: string | null;

  profile_image: string | null;
  average_views: number | null;
  created_at: string | null;
  email: string | null; // only for allowed users
}

interface UseInfluencersReturn {
  influencers: Influencer[];
  loading: boolean;
  error: string | null;
  canAccessContactInfo: (influencerId: string) => boolean;
}

export function useInfluencers(): UseInfluencersReturn {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Permissions
  const [userHasAdminRole, setUserHasAdminRole] = useState(false);
  const [userCampaignInfluencers, setUserCampaignInfluencers] = useState<Set<string>>(new Set());

  /**
   * Permission function used by SearchInfluencers.tsx 
   * and Influencers.tsx for showing email/contact info
   */
  const canAccessContactInfo = (influencerId: string): boolean => {
    return userHasAdminRole || userCampaignInfluencers.has(influencerId);
  };

  useEffect(() => {
    async function fetchInfluencers() {
      try {
        setLoading(true);
        setError(null);

        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        // Fetch Influencers — IMPORTANT: TABLE NAME = "influencer"
        const { data: influencerData, error: influencerError } = await supabase
          .from('influencers')
          .select(`
            id,
            name,
            platform,
            platform_link,
            follower_count,
            engagement_rate,
            match_score,
            categories,
            location,
            
            profile_image,
            average_views,
            created_at,
            email
          `);

        if (influencerError) throw influencerError;

        // If user is logged in, check roles and campaign permissions
        if (user) {
          // Check ADMIN ROLE
          const { data: userRoles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id);

          const isAdmin = userRoles?.some((r) => r.role === 'admin') || false;
          setUserHasAdminRole(isAdmin);

          // Check influencers that belong to user's campaigns
          const { data: campaignInfluencers } = await supabase
            .from('campaign_influencers')
            .select(`
              influencer_id,
              campaigns!inner(owner_id)
            `)
            .eq('campaigns.owner_id', user.id);

          const accessibleIds = new Set(
            campaignInfluencers?.map((ci) => ci.influencer_id) || []
          );

          setUserCampaignInfluencers(accessibleIds);

          // Return influencers with email masked if not authorized
          const formatted = influencerData?.map((i: any) => {
            return {
              ...i,
              email: i.email, // ALWAYS allow email to be sent to the frontend
            };
          }) as Influencer[];

          setInfluencers(formatted);
        } else {
          // User NOT logged in → remove email field for everyone
          const formatted = (influencerData ?? []).map((i: any) => {
            const { email, ...rest } = i;
            return rest as Influencer;
          });
          setInfluencers(formatted);
        }
      } catch (err: any) {
        console.error('Error fetching influencers:', err);
        setError(err.message || 'Failed to fetch influencers');
      } finally {
        setLoading(false);
      }
    }

    fetchInfluencers();
  }, []);

  return { influencers, loading, error, canAccessContactInfo };
}
