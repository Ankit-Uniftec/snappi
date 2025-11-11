import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, Calendar, Users, Target, FileText, Download } from "lucide-react";

export const CreateCampaign = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    objective: "",
    budget: "",
    startDate: "",
    endDate: "",
    platforms: [] as string[],
    targetAudience: "",
    deliverables: "",
    compensation: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating campaign:", formData);
    // TODO: Implement campaign creation
    navigate('/campaigns');
  };

  const handleTemplateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Parse template and autofill fields
      console.log("Template uploaded:", file.name);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Create New Campaign</h1>
              <p className="text-muted-foreground">Set up your influencer marketing campaign</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input
                  type="file"
                  accept=".json,.csv,.xlsx"
                  onChange={handleTemplateUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Template
                </Button>
              </div>
              <Button variant="outline" asChild>
                <Link to="/campaigns">Cancel</Link>
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Campaign Details */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Campaign Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Campaign Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Spring Fashion Launch"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your campaign goals and requirements..."
                      rows={4}
                    />
                  </div>

                   <div className="space-y-2">
                     <Label htmlFor="objective">Campaign Objective</Label>
                     <Select value={formData.objective} onValueChange={(value) => setFormData({...formData, objective: value})}>
                       <SelectTrigger>
                         <SelectValue placeholder="Select objective" />
                       </SelectTrigger>
                       <SelectContent align="end" side="bottom">
                         <SelectItem value="awareness">Brand Awareness</SelectItem>
                         <SelectItem value="sales">Increase Sales</SelectItem>
                         <SelectItem value="both">Awareness & Sales</SelectItem>
                         <SelectItem value="engagement">Engagement</SelectItem>
                         <SelectItem value="reach">Reach</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        name="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Budget & Targeting */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Budget & Targeting</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Total Budget ($)</Label>
                    <Input
                      id="budget"
                      name="budget"
                      type="number"
                      value={formData.budget}
                      onChange={handleInputChange}
                      placeholder="5000"
                      required
                    />
                  </div>

                   <div className="space-y-2">
                     <Label>Target Platforms</Label>
                     <div className="grid grid-cols-2 gap-2">
                       {['Instagram', 'TikTok', 'YouTube', 'Facebook', 'X (Twitter)', 'Twitch', 'Pinterest'].map((platform) => (
                        <label key={platform} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({
                                  ...formData,
                                  platforms: [...formData.platforms, platform]
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  platforms: formData.platforms.filter(p => p !== platform)
                                });
                              }
                            }}
                          />
                          <span className="text-sm">{platform}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetAudience">Target Audience</Label>
                    <Textarea
                      id="targetAudience"
                      name="targetAudience"
                      value={formData.targetAudience}
                      onChange={handleInputChange}
                      placeholder="Women aged 25-35, interested in sustainable fashion..."
                      rows={3}
                    />
                  </div>

                   <div className="space-y-2">
                     <Label htmlFor="compensation">Compensation Type</Label>
                     <Select value={formData.compensation} onValueChange={(value) => setFormData({...formData, compensation: value})}>
                       <SelectTrigger>
                         <SelectValue placeholder="Select compensation" />
                       </SelectTrigger>
                       <SelectContent align="end" side="bottom">
                         <SelectItem value="paid">Paid Promotion</SelectItem>
                         <SelectItem value="affiliate">Affiliate Commission</SelectItem>
                         <SelectItem value="gifting">Product Gifting</SelectItem>
                         <SelectItem value="hybrid">Hybrid (Paid + Product)</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                </CardContent>
              </Card>
            </div>

            {/* Deliverables & Contract */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Deliverables & Requirements</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deliverables">Expected Deliverables</Label>
                  <Textarea
                    id="deliverables"
                    name="deliverables"
                    value={formData.deliverables}
                    onChange={handleInputChange}
                    placeholder="2 Instagram posts, 4 Instagram stories, 1 reel..."
                    rows={4}
                  />
                </div>

                 <div className="flex items-center space-x-4">
                   <Button type="button" variant="outline" onClick={() => console.log('Contract template selected')}>
                     <FileText className="h-4 w-4 mr-2" />
                     Use Contract Template
                   </Button>
                   <Button type="button" variant="outline" onClick={() => document.getElementById('contract-upload')?.click()}>
                     <Upload className="h-4 w-4 mr-2" />
                     Upload Custom Contract
                   </Button>
                   <input id="contract-upload" type="file" accept=".pdf,.doc,.docx" className="hidden" />
                 </div>
              </CardContent>
            </Card>

            {/* Submit Actions */}
             <div className="flex items-center justify-end space-x-4">
               <Button type="button" variant="outline" onClick={() => navigate('/campaigns')}>
                 Save as Draft
               </Button>
               <Button type="submit">
                 Create Campaign
               </Button>
             </div>
          </form>
        </main>
      </div>
    </div>
  );
};