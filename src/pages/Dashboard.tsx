import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { UpgradeCard } from "@/components/upgrade/UpgradeCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Target, 
  TrendingUp, 
  DollarSign,
  Plus,
  Calendar,
  Eye,
  MessageSquare,
  Heart,
  ExternalLink
} from "lucide-react";

import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ReferralCard from "@/components/referrals/ReferralCard";

const recentCampaigns = [
  {
    id: 1,
    name: "Summer Fashion Launch",
    status: "Active",
    influencers: 12,
    budget: "$5,000",
    performance: "+23%",
    daysLeft: 5
  },
  {
    id: 2,
    name: "Tech Product Review",
    status: "Draft", 
    influencers: 0,
    budget: "$3,500",
    performance: "—",
    daysLeft: 0
  },
  {
    id: 3,
    name: "Wellness Brand Partnership",
    status: "Completed",
    influencers: 8,
    budget: "$2,800",
    performance: "+45%",
    daysLeft: 0
  }
];

const topInfluencers = [
  {
    id: 1,
    name: "Sarah Johnson",
    handle: "@sarahjstyle",
    platform: "Instagram",
    followers: "24.5K",
    engagement: "6.2%",
    niche: "Fashion",
    matchScore: 94
  },
  {
    id: 2,
    name: "Mike Chen",
    handle: "@techreviewmike",
    platform: "YouTube",
    followers: "18.3K",
    engagement: "8.1%",
    niche: "Technology",
    matchScore: 89
  },
  {
    id: 3,
    name: "Emma Wellness",
    handle: "@emmawellness",
    platform: "TikTok",
    followers: "32.1K",
    engagement: "7.4%",
    niche: "Health & Wellness",
    matchScore: 92
  }
];

export const Dashboard = () => {
  const { toast } = useToast();

  useEffect(() => {
    const handleReferral = async () => {
      try {
        const code = localStorage.getItem("refCode");
        if (!code) return;
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;
        if (!user) return;
        const { error } = await supabase.rpc("record_referral", { _code: code });
        if (!error) {
          localStorage.removeItem("refCode");
          toast({ title: "Referral applied", description: "Thanks for joining via a referral!" });
        }
      } catch (e) {
        // Silently ignore errors like invalid/self-referral
      }
    };

    handleReferral();
  }, [toast]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6 space-y-8 max-w-7xl">
          {/* Welcome Section */}
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight">Welcome back, Sarah! 👋</h1>
            <p className="text-lg text-muted-foreground">Here's what's happening with your influencer campaigns today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Active Campaigns"
              value="12"
              change={{ value: "+2", type: "increase" }}
              icon={<Target className="h-4 w-4" />}
            />
            <StatsCard
              title="Total Reach"
              value="2.4M"
              change={{ value: "+23%", type: "increase" }}
              icon={<Users className="h-4 w-4" />}
            />
            <StatsCard
              title="Campaign ROI"
              value="245%"
              change={{ value: "+12%", type: "increase" }}
              icon={<TrendingUp className="h-4 w-4" />}
            />
            <StatsCard
              title="Total Spend"
              value="$24,680"
              change={{ value: "+8%", type: "increase" }}
              icon={<DollarSign className="h-4 w-4" />}
            />
          </div>

          {/* Recent Campaigns & Top Influencers */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Campaigns */}
            <Card className="hover-lift border-0 shadow-card bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Campaigns</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/create-campaign">
                    <Plus className="h-4 w-4 mr-2" />
                    New Campaign
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentCampaigns.map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{campaign.name}</h4>
                        <Badge 
                          variant={campaign.status === "Active" ? "default" : campaign.status === "Completed" ? "secondary" : "outline"}
                          className="text-xs"
                        >
                          {campaign.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{campaign.influencers} influencers</span>
                        <span>{campaign.budget}</span>
                        {campaign.daysLeft > 0 && <span>{campaign.daysLeft} days left</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{campaign.performance}</div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Top Influencers */}
            <Card className="hover-lift border-0 shadow-card bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Top Performing Influencers</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/influencers">View All</Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {topInfluencers.map((influencer) => (
                  <div key={influencer.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-medium">
                        {influencer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium">{influencer.name}</div>
                        <div className="text-sm text-muted-foreground">{influencer.handle}</div>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          {influencer.matchScore}% match
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {influencer.followers} • {influencer.engagement} eng.
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Upgrade Card */}
            <UpgradeCard />
          </div>

          {/* Referral */}
          <ReferralCard />

          {/* Quick Actions */}
          <Card className="hover-lift border-0 shadow-card bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Button variant="outline" size="lg" className="h-20 flex-col space-y-2" asChild>
                  <Link to="/search">
                    <Users className="h-6 w-6" />
                    <span>Search Influencers</span>
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-20 flex-col space-y-2" asChild>
                  <Link to="/create-campaign">
                    <Target className="h-6 w-6" />
                    <span>Create Campaign</span>
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-20 flex-col space-y-2" asChild>
                  <Link to="/analytics">
                    <TrendingUp className="h-6 w-6" />
                    <span>View Analytics</span>
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-20 flex-col space-y-2">
                  <MessageSquare className="h-6 w-6" />
                  <span>Getting Started</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};