import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Plus,
  Users,
  TrendingUp,
  Calendar,
  MapPin,
  Star,
  Heart,
  MessageSquare,
  Eye,
  MoreHorizontal,
  Search
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ShortlistedInfluencer {
  id: number;
  name: string;
  handle: string;
  platform: string;
  followers: string;
  engagement: string;
  location: string;
  niche: string;
  matchScore: number;
  addedDate: string;
}

const shortlistedInfluencers: ShortlistedInfluencer[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    handle: "@sarahjstyle",
    platform: "Instagram",
    followers: "24.5K",
    engagement: "6.2%",
    location: "New York, USA",
    niche: "Fashion & Lifestyle",
    matchScore: 94,
    addedDate: "2024-01-15"
  },
  {
    id: 2,
    name: "Mike Chen",
    handle: "@techreviewmike",
    platform: "YouTube",
    followers: "18.3K",
    engagement: "8.1%",
    location: "San Francisco, USA",
    niche: "Technology",
    matchScore: 89,
    addedDate: "2024-01-14"
  },
  {
    id: 3,
    name: "Emma Wellness",
    handle: "@emmawellness",
    platform: "TikTok",
    followers: "32.1K",
    engagement: "7.4%",
    location: "Los Angeles, USA",
    niche: "Health & Wellness",
    matchScore: 92,
    addedDate: "2024-01-13"
  }
];

export const Shortlist = () => {
  const [shortlisted, setShortlisted] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    const loadShortlist = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data, error } = await (supabase as any)
        .from("shortlisted_influencers")
        .select(`
        id,
        created_at,
        influencers (
          id,
          name,
          email,
          categories,
          follower_count,
          engagement_rate,
          location,
          platform,
          profile_image,
          match_score
        )
      `)
        .eq("user_id", user.id);

      if (!error) {
        setShortlisted(data);
      }
    };

    loadShortlist();
  }, []);

  const handleMessageClick = (influencer: any) => {
    if (!influencer.email) {
      alert("No contact email available for this influencer.");
      return;
    }

    const subject = `Collaboration Opportunity with Your Brand`;
    const body = `Hi ${influencer.name},

I hope you're doing great! We would love to collaborate with you.

Looking forward to hearing from you.

Best regards,
[Your Name]`;

    // Try Gmail first
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      influencer.email
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.open(gmailUrl, "_blank");

    // Fallback to default mail app
    setTimeout(() => {
      window.location.href = `mailto:${influencer.email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
    }, 500);
  };
  const handleRemove = async (shortlistId: number) => {
    if (!shortlistId) return;

    const { error } = await (supabase as any)
      .from("shortlisted_influencers")
      .delete()
      .eq("id", shortlistId);

    if (error) {
      console.error("Error removing influencer:", error);
      alert("Failed to remove. Try again.");
      return;
    }

    // Remove from UI instantly
    setShortlisted(prev =>
      prev.filter(item => item.id !== shortlistId)
    );
  };





  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Shortlist</h2>
          <p className="text-muted-foreground">Influencers you've saved for future campaigns</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" asChild>
            <Link to="/search">
              <Plus className="h-4 w-4 mr-2" />
              Add More
            </Link>
          </Button>
          <Button onClick={() => console.log('Creating campaign with shortlisted influencers...')}>
            Create Campaign
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Shortlisted</p>
                <p className="text-2xl font-bold">{shortlisted.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-success/10 rounded-lg">
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Match Score</p>
                <p className="text-2xl font-bold">
                  {shortlisted.length > 0
                    ? Math.round(
                      shortlisted.reduce(
                        (acc, item) => acc + (item.influencers?.match_score || 0),
                        0
                      ) / shortlisted.length
                    )
                    : 0
                  }%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Heart className="h-4 w-4 text-accent-foreground" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Avg Engagement</p>

                <p className="text-2xl font-bold">
                  {shortlisted.length > 0
                    ? (
                      shortlisted.reduce(
                        (acc, item) => acc + (item.influencers?.engagement_rate || 0),
                        0
                      ) / shortlisted.length
                    ).toFixed(1)
                    : "0.0"
                  }%
                </p>
              </div>
            </div>
          </CardContent>

        </Card>
      </div>

      <div className="space-y-4">
        {shortlisted.map(({ id: shortlistId, influencers, created_at }) => (
          <Card key={influencers.id} className="shadow-card hover:shadow-elegant transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">

                <div className="flex items-start space-x-4 flex-1">
                  <div className="h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                    {influencers.name.split(" ").map(n => n[0]).join("")}
                  </div>

                  <div className="space-y-3 flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold">{influencers.name}</h3>
                      <Badge variant="secondary">{influencers.platform}</Badge>
                      {/* <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{influencers.match_score}</span>
                      </div> */}
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>{influencers.location}</span>
                      <span>•</span>
                      <span>{influencers.categories}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Followers</p>
                        <p className="font-medium">{influencers.follower_count || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Engagement</p>
                        <p className="font-medium">{influencers.engagement_rate}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Match Score</p>
                        <p className="font-medium">
                          {influencers.match_score ? influencers.match_score + "%" : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Added</p>
                        <p className="font-medium">{new Date(created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMessageClick(influencers)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemove(shortlistId)}
                  >
                    Remove
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => console.log(`More options for ${influencers.name}`)}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {shortlistedInfluencers.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No influencers shortlisted yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by searching for influencers and adding them to your shortlist
            </p>
            <Button asChild>
              <Link to="/search">
                <Search className="h-4 w-4 mr-2" />
                Search Influencers
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};