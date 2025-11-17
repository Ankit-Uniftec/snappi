import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Users, Target, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const CreateCampaign = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Upload and form states
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    objective: "",
    type: "",
    kpis: [] as string[],
    budget: "",
    startDate: "",
    endDate: "",
    platforms: [] as string[],
    targetAudience: "",
    deliverables: "",
    compensation: "",
    ageRange: "",
    gender: "",
    location: "",
  });

  // Generic change handler
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // File upload selection
  const handleTemplateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length) {
      setFiles(selected);
      console.log("Selected files:", selected.map((f) => f.name));
    }
  };

  // Upload file to Supabase Storage
  const uploadFileToStorage = async (
    file: File,
    ownerId: string,
    campaignId: string
  ) => {
    const safeName = encodeURIComponent(file.name.replace(/\s+/g, "_"));
    const path = `${ownerId}/campaigns/${campaignId}-${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("campaign-assets")
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (uploadError) throw uploadError;

    const { data: publicData } = supabase.storage
      .from("campaign-assets")
      .getPublicUrl(path);

    const url = publicData?.publicUrl ?? null;
    return { name: file.name, path, url, size: file.size, type: file.type };
  };

  // Submit to Supabase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        data: { session },
        error: sessionErr,
      } = await supabase.auth.getSession();
      if (sessionErr) throw sessionErr;
      if (!session?.user) throw new Error("Not authenticated");

      const ownerId = session.user.id;
      if (!formData.name) {
        toast({
          title: "Missing Field",
          description: "Please enter a campaign name.",
          variant: "destructive",
        });
        return;
      }

      const campaignId = crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

      // Upload files if any
      const attachmentsMeta = [];
      for (const file of files) {
        const meta = await uploadFileToStorage(file, ownerId, campaignId);
        attachmentsMeta.push(meta);
      }

      // Prepare DB payload
      const payload = {
        owner_id: ownerId,
        name: formData.name,
        description: formData.description || null,
        objective: formData.objective || null,
        type: formData.type || "draft",
        kpis: formData.kpis?.length ? formData.kpis : null,
        budget: formData.budget
          ? parseFloat(String(formData.budget))
          : null,
        start_date: formData.startDate || null,
        end_date: formData.endDate || null,
        platforms:
          formData.platforms && formData.platforms.length
            ? formData.platforms
            : null,
        target_audience: `${formData.gender} of the age group ${formData.ageRange} located in ${formData.location}`,
        deliverables: formData.deliverables || null,
        compensation: formData.compensation || null,
        demographics: {
          age_range: formData.ageRange || null,
          gender: formData.gender || null,
          location: formData.location || null,
        },
        attachments: attachmentsMeta.length ? attachmentsMeta : null,
        // status: "active",
        status: formData.type,
        metadata: null,
      };

      const { data: inserted, error: insertError } = await supabase
        .from("campaigns")
        .insert([payload])
        .select()
        .single();

      if (insertError) throw insertError;

      toast({
        title: "Campaign Created 🎉",
        description: `Campaign “${inserted.name}” saved successfully.`,
      });
      navigate("/campaigns");
    } catch (err: any) {
      console.error("Failed to create campaign:", err);
      toast({
        title: "Error Creating Campaign",
        description: err?.message ?? "Unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleSaveAsDraft = async () => {
    // Force type to draft before saving
    setFormData((prev) => ({ ...prev, type: "draft" }));

    // Call the submit handler
    await handleSubmit({
      preventDefault: () => { },
    } as any);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Create New Campaign</h1>
              <p className="text-muted-foreground">
                Set up your influencer marketing campaign
              </p>
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

          {/* Form */}
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
                  {/* Name */}
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

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your campaign goals..."
                      rows={3}
                    />
                  </div>

                  {/* Objective */}
                  <div className="space-y-2">
                    <Label>Campaign Objective</Label>
                    <Select
                      value={formData.objective}
                      onValueChange={(v) =>
                        setFormData({ ...formData, objective: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select objective" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="awareness">
                          Brand Awareness
                        </SelectItem>
                        <SelectItem value="engagement">
                          Engagement & Community
                        </SelectItem>
                        <SelectItem value="content">
                          Content Creation (UGC)
                        </SelectItem>
                        <SelectItem value="traffic">
                          Traffic Generation
                        </SelectItem>
                        <SelectItem value="lead">Lead Generation</SelectItem>
                        <SelectItem value="sales">Sales & Conversions</SelectItem>
                        <SelectItem value="affiliate">
                          Affiliate / Performance
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Type */}
                  <div className="space-y-2">
                    <Label>Campaign Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(v) =>
                        setFormData({ ...formData, type: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="outreach">Outreach</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* KPIs */}
                  <div className="space-y-2">
                    <Label>Key KPIs</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "Impressions",
                        "Engagement",
                        "Leads",
                        "Sales",
                        "Conversions",
                      ].map((kpi) => (
                        <label
                          key={kpi}
                          className="flex items-center space-x-2 text-sm"
                        >
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              if (e.target.checked)
                                setFormData({
                                  ...formData,
                                  kpis: [...formData.kpis, kpi],
                                });
                              else
                                setFormData({
                                  ...formData,
                                  kpis: formData.kpis.filter((k) => k !== kpi),
                                });
                            }}
                          />
                          <span>{kpi}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
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
                  <Label>Total Budget ($)</Label>
                  <Input
                    name="budget"
                    type="number"
                    value={formData.budget}
                    onChange={handleInputChange}
                    placeholder="5000"
                  />

                  {/* Platforms */}
                  <Label>Target Platforms</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "Instagram",
                      "TikTok",
                      "YouTube",
                      "Facebook",
                      "X (Twitter)",
                      "Twitch",
                      "Pinterest",
                      "LinkedIn",
                    ].map((platform) => (
                      <label
                        key={platform}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked)
                              setFormData({
                                ...formData,
                                platforms: [...formData.platforms, platform],
                              });
                            else
                              setFormData({
                                ...formData,
                                platforms: formData.platforms.filter(
                                  (p) => p !== platform
                                ),
                              });
                          }}
                        />
                        <span className="text-sm">{platform}</span>
                      </label>
                    ))}
                  </div>

                  {/* Demographics */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Demographics</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Age Range</Label>
                        <Select
                          onValueChange={(v) =>
                            setFormData({ ...formData, ageRange: v })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {["13-17", "18-24", "25-34", "35-44", "45+"].map(
                              (a) => (
                                <SelectItem key={a} value={a}>
                                  {a}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Gender</Label>
                        <Select
                          onValueChange={(v) =>
                            setFormData({ ...formData, gender: v })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {["All", "Male", "Female", "Non-binary"].map(
                              (g) => (
                                <SelectItem key={g} value={g}>
                                  {g}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="col-span-2">
                        <Label>Location</Label>
                        <Input
                          name="location"
                          placeholder="Country / City"
                          onChange={handleInputChange}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <div>
                    <Label>Compensation Type</Label>
                    <Select
                      value={formData.compensation}
                      onValueChange={(v) =>
                        setFormData({ ...formData, compensation: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paid">Paid Promotion</SelectItem>
                        <SelectItem value="affiliate">
                          Affiliate Commission
                        </SelectItem>
                        <SelectItem value="gifting">
                          Product Gifting
                        </SelectItem>
                        <SelectItem value="hybrid">
                          Hybrid (Paid + Product)
                        </SelectItem>
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
                <Label>Expected Deliverables</Label>
                <Textarea
                  name="deliverables"
                  value={formData.deliverables}
                  onChange={handleInputChange}
                  placeholder="e.g., 2 reels, 3 stories, 1 YouTube video..."
                  rows={3}
                />
                <div className="flex items-center space-x-4">
                  <Button type="button" variant="outline">
                    Use Contract Template
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("contract-upload")?.click()
                    }
                  >
                    <Upload className="h-4 w-4 mr-2" /> Upload Contract
                  </Button>
                  <input
                    id="contract-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={handleTemplateUpload}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveAsDraft}
              >
                Save as Draft
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Campaign"}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};
