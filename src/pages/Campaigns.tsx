import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Instagram,
  Youtube,
  Twitter,
  Twitch,
  Pin
} from "lucide-react";

const campaigns = [
  {
    id: 1,
    name: "Summer Fashion Launch",
    status: "Active",
    type: "Product Launch",
    budget: "$5,000",
    spent: "$2,340",
    influencers: 12,
    applications: 23,
    reach: "124K",
    engagement: "6.2%",
    startDate: "15/01/2024",
    endDate: "15/02/2024",
    performance: "+23%",
    platforms: ["Instagram", "TikTok"]
  },
  {
    id: 2,
    name: "Tech Product Review",
    status: "Draft",
    type: "Product Review",
    budget: "$3,500",
    spent: "$0",
    influencers: 0,
    applications: 0,
    reach: "—",
    engagement: "—",
    startDate: "01/02/2024",
    endDate: "01/03/2024",
    performance: "—",
    platforms: ["YouTube", "X (Twitter)"]
  },
  {
    id: 3,
    name: "Wellness Brand Partnership",
    status: "Completed",
    type: "Brand Partnership",
    budget: "$2,800",
    spent: "$2,800",
    influencers: 8,
    applications: 15,
    reach: "89K",
    engagement: "8.1%",
    startDate: "01/12/2023",
    endDate: "01/01/2024",
    performance: "+45%",
    platforms: ["Instagram", "Pinterest"]
  },
  {
    id: 4,
    name: "Holiday Gift Guide",
    status: "Paused",
    type: "Seasonal",
    budget: "$4,200",
    spent: "$1,890",
    influencers: 6,
    applications: 18,
    reach: "67K",
    engagement: "5.8%",
    startDate: "10/01/2024",
    endDate: "10/02/2024",
    performance: "+12%",
    platforms: ["TikTok", "Twitch"]
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active": return "default";
    case "Completed": return "secondary";
    case "Paused": return "outline";
    default: return "outline";
  }
};

const getStatusAction = (status: string) => {
  switch (status) {
    case "Active": return { icon: Pause, label: "Pause" };
    case "Paused": return { icon: Play, label: "Resume" };
    case "Draft": return { icon: Play, label: "Launch" };
    default: return { icon: Eye, label: "View" };
  }
};

export const Campaigns = () => {
  const filterCampaignsByStatus = (status: string) => {
    if (status === "all") return campaigns;
    return campaigns.filter(campaign => campaign.status.toLowerCase() === status.toLowerCase());
  };
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6 space-y-8 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">Campaigns</h1>
              <p className="text-lg text-muted-foreground">Manage and track your influencer campaigns</p>
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
                onClick={() => {
                  console.log('Exporting campaigns...');
                  // TODO: Implement actual export functionality
                }}
              >
                <Download className="mr-2 h-4 w-4" />
                Export Campaigns
              </Button>
            </div>
          </div>

          {/* Campaign Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="hover-lift border-0 shadow-card bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-muted-foreground font-medium">Active Campaigns</p>
                    <p className="text-2xl font-bold mt-1">12</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-success/10 rounded-lg">
                    <DollarSign className="h-5 w-5 text-success" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-muted-foreground font-medium">Total Budget</p>
                    <p className="text-2xl font-bold mt-1">$24.6K</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <Users className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-muted-foreground font-medium">Total Influencers</p>
                    <p className="text-2xl font-bold mt-1">347</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-muted-foreground font-medium">Average Performance</p>
                    <p className="text-2xl font-bold mt-1">+21%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="hover-lift border-0 shadow-card bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search campaigns..." className="pl-10" />
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    console.log('Opening filter options...');
                    // TODO: Implement actual filter functionality
                  }}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Campaigns Tabs */}
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">All Campaigns</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {campaigns.map((campaign) => {
                const ActionIcon = getStatusAction(campaign.status).icon;
                return (
                  <Card key={campaign.id} className="shadow-card hover:shadow-elegant transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold">{campaign.name}</h3>
                            <Badge variant={getStatusColor(campaign.status)}>
                              {campaign.status}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {campaign.type}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Budget</p>
                              <p className="font-medium">{campaign.budget}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Spent</p>
                              <p className="font-medium">{campaign.spent}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Influencers</p>
                              <p className="font-medium">{campaign.influencers}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Reach</p>
                              <p className="font-medium">{campaign.reach}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Engagement</p>
                              <p className="font-medium">{campaign.engagement}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Performance</p>
                              <p className="font-medium text-success">{campaign.performance}</p>
                            </div>
                          </div>
                          
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Start Date:</span>
                              <span className="font-medium">{campaign.startDate}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">End Date:</span>
                              <span className="font-medium">{campaign.endDate}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Target Platforms:</span>
                              <div className="flex items-center space-x-2">
                                {campaign.platforms?.map((platform) => (
                                  <div key={platform} className="flex items-center space-x-1">
                                    <PlatformIcon platform={platform} />
                                    <span className="text-xs">{platform}</span>
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
                            onClick={() => {
                              console.log(`${getStatusAction(campaign.status).label} campaign ${campaign.id}`);
                              // TODO: Implement actual campaign status change functionality
                            }}
                          >
                            <ActionIcon className="h-4 w-4 mr-2" />
                            {getStatusAction(campaign.status).label}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              console.log(`More options for campaign ${campaign.id}`);
                              // TODO: Implement dropdown menu with more options
                            }}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>
            
            <TabsContent value="active" className="space-y-4">
              {filterCampaignsByStatus("active").map((campaign) => {
                const ActionIcon = getStatusAction(campaign.status).icon;
                return (
                  <Card key={campaign.id} className="shadow-card hover:shadow-elegant transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold">{campaign.name}</h3>
                            <Badge variant={getStatusColor(campaign.status)}>
                              {campaign.status}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {campaign.type}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Budget</p>
                              <p className="font-medium">{campaign.budget}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Spent</p>
                              <p className="font-medium">{campaign.spent}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Influencers</p>
                              <p className="font-medium">{campaign.influencers}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Reach</p>
                              <p className="font-medium">{campaign.reach}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Engagement</p>
                              <p className="font-medium">{campaign.engagement}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Performance</p>
                              <p className="font-medium text-success">{campaign.performance}</p>
                            </div>
                          </div>
                          
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Start Date:</span>
                              <span className="font-medium">{campaign.startDate}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">End Date:</span>
                              <span className="font-medium">{campaign.endDate}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Target Platforms:</span>
                              <div className="flex items-center space-x-2">
                                {campaign.platforms?.map((platform) => (
                                  <div key={platform} className="flex items-center space-x-1">
                                    <PlatformIcon platform={platform} />
                                    <span className="text-xs">{platform}</span>
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
                            onClick={() => {
                              console.log(`${getStatusAction(campaign.status).label} campaign ${campaign.id}`);
                              // TODO: Implement actual campaign status change functionality
                            }}
                          >
                            <ActionIcon className="h-4 w-4 mr-2" />
                            {getStatusAction(campaign.status).label}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              console.log(`More options for campaign ${campaign.id}`);
                              // TODO: Implement dropdown menu with more options
                            }}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {filterCampaignsByStatus("active").length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No active campaigns found</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="draft" className="space-y-4">
              {filterCampaignsByStatus("draft").map((campaign) => {
                const ActionIcon = getStatusAction(campaign.status).icon;
                return (
                  <Card key={campaign.id} className="shadow-card hover:shadow-elegant transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold">{campaign.name}</h3>
                            <Badge variant={getStatusColor(campaign.status)}>
                              {campaign.status}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {campaign.type}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Budget</p>
                              <p className="font-medium">{campaign.budget}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Spent</p>
                              <p className="font-medium">{campaign.spent}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Influencers</p>
                              <p className="font-medium">{campaign.influencers}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Reach</p>
                              <p className="font-medium">{campaign.reach}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Engagement</p>
                              <p className="font-medium">{campaign.engagement}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Performance</p>
                              <p className="font-medium text-success">{campaign.performance}</p>
                            </div>
                          </div>
                          
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Start Date:</span>
                              <span className="font-medium">{campaign.startDate}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">End Date:</span>
                              <span className="font-medium">{campaign.endDate}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Target Platforms:</span>
                              <div className="flex items-center space-x-2">
                                {campaign.platforms?.map((platform) => (
                                  <div key={platform} className="flex items-center space-x-1">
                                    <PlatformIcon platform={platform} />
                                    <span className="text-xs">{platform}</span>
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
                            onClick={() => {
                              console.log(`${getStatusAction(campaign.status).label} campaign ${campaign.id}`);
                              // TODO: Implement actual campaign status change functionality
                            }}
                          >
                            <ActionIcon className="h-4 w-4 mr-2" />
                            {getStatusAction(campaign.status).label}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              console.log(`More options for campaign ${campaign.id}`);
                              // TODO: Implement dropdown menu with more options
                            }}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {filterCampaignsByStatus("draft").length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No draft campaigns found</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {filterCampaignsByStatus("completed").map((campaign) => {
                const ActionIcon = getStatusAction(campaign.status).icon;
                return (
                  <Card key={campaign.id} className="shadow-card hover:shadow-elegant transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold">{campaign.name}</h3>
                            <Badge variant={getStatusColor(campaign.status)}>
                              {campaign.status}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {campaign.type}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Budget</p>
                              <p className="font-medium">{campaign.budget}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Spent</p>
                              <p className="font-medium">{campaign.spent}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Influencers</p>
                              <p className="font-medium">{campaign.influencers}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Reach</p>
                              <p className="font-medium">{campaign.reach}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Engagement</p>
                              <p className="font-medium">{campaign.engagement}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Performance</p>
                              <p className="font-medium text-success">{campaign.performance}</p>
                            </div>
                          </div>
                          
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Start Date:</span>
                              <span className="font-medium">{campaign.startDate}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">End Date:</span>
                              <span className="font-medium">{campaign.endDate}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Target Platforms:</span>
                              <div className="flex items-center space-x-2">
                                {campaign.platforms?.map((platform) => (
                                  <div key={platform} className="flex items-center space-x-1">
                                    <PlatformIcon platform={platform} />
                                    <span className="text-xs">{platform}</span>
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
                            onClick={() => {
                              console.log(`${getStatusAction(campaign.status).label} campaign ${campaign.id}`);
                              // TODO: Implement actual campaign status change functionality
                            }}
                          >
                            <ActionIcon className="h-4 w-4 mr-2" />
                            {getStatusAction(campaign.status).label}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              console.log(`More options for campaign ${campaign.id}`);
                              // TODO: Implement dropdown menu with more options
                            }}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {filterCampaignsByStatus("completed").length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No completed campaigns found</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};