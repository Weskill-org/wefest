import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Edit2, Plus, Trash2, SwitchCamera } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/coupons")({
  component: AdminCoupons,
});

interface Coupon {
  id: string;
  code: string;
  name: string;
  discount_amount: number;
  min_plan_amount: number;
  usage_limit: number | null;
  used_count: number;
  expiry_date: string | null;
  is_active: boolean;
  created_at: string;
}

export default function AdminCoupons() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    discount_amount: 0,
    min_plan_amount: 0,
    usage_limit: "" as string | number,
    expiry_date: "",
    is_active: true,
  });

  const { data: coupons, isLoading } = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("discount_coupons")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Coupon[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (coupon: Partial<Coupon>) => {
      // Normalize code to uppercase
      if (coupon.code) {
        coupon.code = coupon.code.toUpperCase().trim();
      }

      if (coupon.id) {
        const { error } = await supabase
          .from("discount_coupons")
          .update(coupon)
          .eq("id", coupon.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("discount_coupons").insert(coupon);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      toast.success("Coupon saved successfully");
      closeDialog();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to save coupon");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("discount_coupons")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      toast.success("Coupon deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete coupon");
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("discount_coupons")
        .update({ is_active })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      toast.success("Status updated");
    },
  });

  const openDialog = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        name: coupon.name,
        discount_amount: coupon.discount_amount,
        min_plan_amount: coupon.min_plan_amount,
        usage_limit: coupon.usage_limit || "",
        expiry_date: coupon.expiry_date
          ? new Date(coupon.expiry_date).toISOString().slice(0, 16)
          : "",
        is_active: coupon.is_active,
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: "",
        name: "",
        discount_amount: 0,
        min_plan_amount: 0,
        usage_limit: "",
        expiry_date: "",
        is_active: true,
      });
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingCoupon(null);
  };

  const handleSave = () => {
    if (!formData.code || formData.discount_amount <= 0) {
      toast.error("Please provide a valid code and discount amount");
      return;
    }

    const payload: Partial<Coupon> = {
      code: formData.code,
      name: formData.name,
      discount_amount: Number(formData.discount_amount),
      min_plan_amount: Number(formData.min_plan_amount),
      usage_limit:
        formData.usage_limit === "" ? null : Number(formData.usage_limit),
      expiry_date: formData.expiry_date
        ? new Date(formData.expiry_date).toISOString()
        : null,
      is_active: formData.is_active,
    };

    if (editingCoupon) {
      payload.id = editingCoupon.id;
    }

    saveMutation.mutate(payload);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Discount Coupons</h2>
          <p className="text-muted-foreground">
            Manage discount codes for company subscriptions.
          </p>
        </div>
        <Button onClick={() => openDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Create Coupon
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Coupons</CardTitle>
          <CardDescription>
            View and manage all your active and inactive discount coupons.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">Loading coupons...</div>
          ) : !coupons?.length ? (
            <div className="text-center p-8 text-muted-foreground">
              No coupons created yet. Click "Create Coupon" to add one.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell className="font-mono font-medium">
                        {coupon.code}
                      </TableCell>
                      <TableCell>{coupon.name || "-"}</TableCell>
                      <TableCell>₹{coupon.discount_amount}</TableCell>
                      <TableCell>
                        {coupon.used_count} /{" "}
                        {coupon.usage_limit === null ? "∞" : coupon.usage_limit}
                      </TableCell>
                      <TableCell>
                        {coupon.expiry_date ? (
                          <span
                            className={
                              new Date(coupon.expiry_date) < new Date()
                                ? "text-destructive"
                                : ""
                            }
                          >
                            {format(new Date(coupon.expiry_date), "PP")}
                          </span>
                        ) : (
                          "Never"
                        )}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={coupon.is_active}
                          onCheckedChange={(checked) =>
                            toggleStatusMutation.mutate({
                              id: coupon.id,
                              is_active: checked,
                            })
                          }
                          disabled={toggleStatusMutation.isPending}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDialog(coupon)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            if (
                              confirm(
                                "Are you sure you want to delete this coupon? This cannot be undone."
                              )
                            ) {
                              deleteMutation.mutate(coupon.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingCoupon ? "Edit Coupon" : "Create Coupon"}
            </DialogTitle>
            <DialogDescription>
              Set up the discount code, amount, and usage limits.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="code">Coupon Code</Label>
              <Input
                id="code"
                placeholder="e.g. SAVE500"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value.toUpperCase() })
                }
                className="uppercase font-mono"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Campaign Name (Optional)</Label>
              <Input
                id="name"
                placeholder="e.g. Spring Sale 2026"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="discount">Discount (₹)</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  value={formData.discount_amount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discount_amount: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="min_plan">Min. Plan (₹)</Label>
                <Input
                  id="min_plan"
                  type="number"
                  min="0"
                  value={formData.min_plan_amount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      min_plan_amount: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="usage_limit">Usage Limit</Label>
                <Input
                  id="usage_limit"
                  type="number"
                  min="1"
                  placeholder="Unlimited"
                  value={formData.usage_limit}
                  onChange={(e) =>
                    setFormData({ ...formData, usage_limit: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  type="datetime-local"
                  value={formData.expiry_date}
                  onChange={(e) =>
                    setFormData({ ...formData, expiry_date: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked })
                }
              />
              <Label htmlFor="active">Coupon is Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Saving..." : "Save Coupon"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
