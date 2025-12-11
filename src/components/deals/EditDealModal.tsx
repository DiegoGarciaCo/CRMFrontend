'use client';

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { UpdateDeal } from "@/lib/data/backend/clientCalls";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Deal } from "@/lib/definitions/backend/deals";
import { Pencil } from "lucide-react";

const DealSchema = z.object({
    title: z.string().min(1, "Title is required"),
    price: z.number().min(0, "Price must be >= 0"),
    closing_date: z.string().optional(),
    earnest_money_due_date: z.string().optional(),
    mutual_acceptance_date: z.string().optional(),
    inspection_date: z.string().optional(),
    appraisal_date: z.string().optional(),
    final_walkthrough_date: z.string().optional(),
    possession_date: z.string().optional(),
    commission: z.number().optional(),
    commission_split: z.number().optional(),
    property_address: z.string().optional(),
    property_city: z.string().optional(),
    property_state: z.string().optional(),
    property_zip: z.string().optional(),
    description: z.string().optional(),
    stage_id: z.string().min(1, "Stage is required"),
});

type DealFormValues = z.infer<typeof DealSchema>;

interface EditDealModalProps {
    deal: Deal;
    stages: { id: string; name: string }[];
}

export function EditDealModal({ deal, stages }: EditDealModalProps) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const form = useForm<DealFormValues>({
        resolver: zodResolver(DealSchema),
        defaultValues: {
            title: deal.Title,
            price: deal.Price,
            closing_date: deal.ClosingDate.Valid ? deal.ClosingDate.Time : '',
            earnest_money_due_date: deal.EarnestMoneyDueDate.Valid ? deal.EarnestMoneyDueDate.Time : '',
            mutual_acceptance_date: deal.MutualAcceptanceDate.Valid ? deal.MutualAcceptanceDate.Time : '',
            inspection_date: deal.InspectionDate.Valid ? deal.InspectionDate.Time : '',
            appraisal_date: deal.AppraisalDate.Valid ? deal.AppraisalDate.Time : '',
            final_walkthrough_date: deal.FinalWalkthroughDate.Valid ? deal.FinalWalkthroughDate.Time : '',
            possession_date: deal.PossessionDate.Valid ? deal.PossessionDate.Time : '',
            commission: deal.Commission.Valid ? deal.Commission.Int32 : 0,
            commission_split: deal.CommissionSplit.Valid ? deal.CommissionSplit.Int32 : 0,
            property_address: deal.PropertyAddress.Valid ? deal.PropertyAddress.String : '',
            property_city: deal.PropertyCity.Valid ? deal.PropertyCity.String : '',
            property_state: deal.PropertyState.Valid ? deal.PropertyState.String : '',
            property_zip: deal.PropertyZipCode.Valid ? deal.PropertyZipCode.String : '',
            description: deal.Description.Valid ? deal.Description.String : '',
            stage_id: deal.StageID,
        },
    });

    async function onSubmit(values: DealFormValues) {
        try {
            await UpdateDeal(
                deal.ID,
                deal.ContactID,
                values.title,
                values.price,
                values.closing_date ?? '',
                values.earnest_money_due_date ?? '',
                values.mutual_acceptance_date ?? '',
                values.inspection_date ?? '',
                values.appraisal_date ?? '',
                values.final_walkthrough_date ?? '',
                values.possession_date ?? '',
                values.commission ?? 0,
                values.commission_split ?? 0,
                values.property_address ?? '',
                values.property_city ?? '',
                values.property_state ?? '',
                values.property_zip ?? '',
                values.description ?? '',
                values.stage_id
            );
            toast.success("Deal updated!");
            setOpen(false);
            router.refresh();
        } catch (err) {
            toast.error("Failed to update deal.");
            console.error(err);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto flex flex-col">
                <DialogHeader className="sticky top-0 bg-white dark:bg-zinc-950 z-10">
                    <DialogTitle>Edit Deal</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-1">

                        {/* Title */}
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Price */}
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Dates */}
                        {[
                            { label: "Closing Date", name: "closing_date" },
                            { label: "Earnest Money Due", name: "earnest_money_due_date" },
                            { label: "Mutual Acceptance", name: "mutual_acceptance_date" },
                            { label: "Inspection Date", name: "inspection_date" },
                            { label: "Appraisal Date", name: "appraisal_date" },
                            { label: "Final Walkthrough", name: "final_walkthrough_date" },
                            { label: "Possession Date", name: "possession_date" },
                        ].map(d => (
                            <FormField
                                key={d.name}
                                control={form.control}
                                name={d.name as keyof DealFormValues}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{d.label}</FormLabel>
                                        <FormControl>
                                            <Input type="datetime-local" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}

                        {/* Commission */}
                        <FormField
                            control={form.control}
                            name="commission"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Commission (%)</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="commission_split"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Commission Split (%)</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Property */}
                        <FormField
                            control={form.control}
                            name="property_address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Property Address</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex gap-3">
                            <FormField
                                control={form.control}
                                name="property_city"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>City</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="property_state"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>State</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="property_zip"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Zip</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea rows={4} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Stage */}
                        <FormField
                            control={form.control}
                            name="stage_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Stage</FormLabel>
                                    <FormControl>
                                        <select {...field} className="w-full border rounded p-2">
                                            {stages.map(stage => (
                                                <option key={stage.id} value={stage.id}>{stage.name}</option>
                                            ))}
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="mt-4">
                            <Button type="submit" className="w-full">Save Changes</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
