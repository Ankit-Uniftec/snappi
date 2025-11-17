import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlatformIcon } from "@/components/ui/platform-icon";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  MoreHorizontal,
  Play,
  Pause,
  Eye,
  Download,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "default";
    case "Completed":
      return "secondary";
    case "Paused":
      return "outline";
    default:
      return "outline";
  }
};

const getStatusAction = (status: string) => {
  switch (status) {
    case "Active":
      return { icon: Pause, label: "Pause", next: "Paused" };
    case "Paused":
      return { icon: Play, label: "Resume", next: "Active" };
    case "Draft":
      return { icon: Play, label: "Launch", next: "Active" };
    default:
      return { icon: Eye, label: "View", next: "Active" };
  }
};

export const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCount, setActiveCount]= useState(0);
  const [totalBudget, setTotalBudget]= useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        console.error("No user session found");
        setLoading(false);
        return;
      }

      const userId = session.user.id;
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("owner_id", userId)
        .order("created_at", { ascending: false });

      if (error) console.error("Error fetching campaigns:", error);
      else {
        const normalized = data.map((c) => ({
          ...c,
          status:
            c.status?.charAt(0).toUpperCase() + c.status?.slice(1).toLowerCase(),
        }));
        setCampaigns(normalized);
        // Calculate active campaigns and total budget:
        const active = normalized.filter((c)=> c.status?.toLowerCase()==="active").length;
        setActiveCount(active);
        //Total budget
        const total = normalized.reduce((sum,c)=> sum + (c.budget || 0),0);
        setTotalBudget(total);
      }
      setLoading(false);
    };

    fetchCampaigns();
  }, []);

  const filterCampaignsByStatus = (status: string) => {
    let filtered = campaigns;
    if (status !== "all") {
      filtered = campaigns.filter(
        (c) => c.status?.toLowerCase() === status.toLowerCase()
      );
    }
    if (searchQuery.trim()) {
      filtered = filtered.filter((c) =>
        c.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  };

  const handleStatusChange = async (campaign: any) => {
    const next = getStatusAction(campaign.status).next;
    const { error } = await supabase
      .from("campaigns")
      .update({ status: next.toLowerCase() })
      .eq("id", campaign.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update campaign status.",
        variant: "destructive",
      });
    } else {
      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === campaign.id ? { ...c, status: next } : c
        )
      );
      toast({
        title: "Status Updated",
        description: `${campaign.name} is now ${next}`,
      });
    }
  };
const handleComplete = async (campaign: any) => {
  const { error } = await supabase
    .from("campaigns")
    .update({ status: "completed" })
    .eq("id", campaign.id);

  if (error) {
    toast({
      title: "Error",
      description: "Failed to mark campaign as completed.",
      variant: "destructive",
    });
  } else {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === campaign.id ? { ...c, status: "Completed" } : c
      )
    );
    toast({
      title: "Campaign Updated",
      description: `${campaign.name} marked as Completed`,
    });
  }
};
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading campaigns...
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 space-y-8 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">Campaigns</h1>
              <p className="text-lg text-muted-foreground">
                Manage and track your influencer campaigns
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button size="lg" asChild>
                <Link to="/create-campaign">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Campaign
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => console.log("Exporting campaigns...")}
              >
                <Download className="mr-2 h-4 w-4" />
                Export Campaigns
              </Button>
            </div>
          </div>

          {/* Static Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="hover-lift border-0 shadow-card bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-muted-foreground font-medium">
                    Active Campaigns
                  </p>
                  <p className="text-2xl font-bold mt-1">{activeCount}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-3 bg-success/10 rounded-lg">
                  <DollarSign className="h-5 w-5 text-success" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-muted-foreground font-medium">
                    Total Budget
                  </p>
                  <p className="text-2xl font-bold mt-1">${totalBudget.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <Users className="h-5 w-5 text-accent-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-muted-foreground font-medium">
                    Total Influencers
                  </p>
                  <p className="text-2xl font-bold mt-1">347</p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-muted-foreground font-medium">
                    Average Performance
                  </p>
                  <p className="text-2xl font-bold mt-1">+21%</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card className="hover-lift border-0 shadow-card bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search campaigns..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">All Campaigns</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            {["all", "active", "draft", "completed"].map((tab) => (
              <TabsContent key={tab} value={tab} className="space-y-4">
                {filterCampaignsByStatus(tab).map((campaign) => {
                  const ActionIcon = getStatusAction(campaign.status).icon;
                  return (
                    <Card
                      key={campaign.id}
                      className="shadow-card hover:shadow-elegant transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-3 flex-1">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-lg font-semibold">
                                {campaign.name}
                              </h3>
                              <Badge variant={getStatusColor(campaign.status)}>
                                {campaign.status}
                              </Badge>
                              {/* <Badge variant="outline" className="text-xs">
                                {campaign.type || "General"}
                              </Badge> */}
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Budget</p>
                                <p className="font-medium">
                                  ${campaign.budget || "—"}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Reach</p>
                                <p className="font-medium">
                                  {campaign.reach || "—"}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">
                                  Engagement
                                </p>
                                <p className="font-medium">
                                  {campaign.engagement || "—"}
                                </p>
                              </div>
                            </div>

                            <div className="mt-3 space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Start Date:
                                </span>
                                <span className="font-medium">
                                  {campaign.start_date || "—"}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                  End Date:
                                </span>
                                <span className="font-medium">
                                  {campaign.end_date || "—"}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Target Platforms:
                                </span>
                                <div className="flex items-center space-x-2">
                                  {campaign.platforms?.map((p: string) => (
                                    <div
                                      key={p}
                                      className="flex items-center space-x-1"
                                    >
                                      <PlatformIcon platform={p} />
                                      <span className="text-xs">{p}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(campaign)}
                            >
                              <ActionIcon className="h-4 w-4 mr-2" />
                              {getStatusAction(campaign.status).label}
                            </Button>
                            {/* <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                console.log(
                                  `More options for campaign ${campaign.id}`
                                )
                              }
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button> */}
                            <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="sm">
      <MoreHorizontal className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>

  <DropdownMenuContent align="end">
    <DropdownMenuItem
      onClick={() => handleComplete(campaign)}
      className="cursor-pointer"
    >
      Mark as Completed
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                {filterCampaignsByStatus(tab).length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No {tab} campaigns found
                    </p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </main>
      </div>
    </div>
  );
};
