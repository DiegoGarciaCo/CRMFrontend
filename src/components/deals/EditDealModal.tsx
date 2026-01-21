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
import { DeleteDeal, UpdateDeal } from "@/lib/data/backend/clientCalls";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Deal } from "@/lib/definitions/backend/deals";
import { Pencil } from "lucide-react";
import { TableCell, TableRow } from "../ui/table";

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
    closed_date: z.string().optional(),
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
    variant?: "default" | "table-cell";
}



export function EditDealModal({ deal, stages, variant = "default" }: EditDealModalProps) {
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
            closed_date: deal.ClosedDate.Valid ? deal.ClosedDate.Time : '',
            commission: deal.Commission.Valid ? Number(deal.Commission.String) : 0,
            commission_split: deal.CommissionSplit.Valid ? Number(deal.CommissionSplit.String) : 0,
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
                values.closed_date ?? '',
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

    async function handleDelete() {
        try {
            await DeleteDeal(deal.ID)
            toast.success("Deal deleted!");
            setOpen(false);
            router.refresh();
        } catch (err) {
            toast.error("Failed to delete Deal.");
            console.error(err);
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getStatusBadge = (deal: Deal) => {
        return deal.ClosedDate.Valid ? (
            <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                Closed
            </span>
        ) : deal.ClosingDate.Valid ? (
            <span className="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                Under Contract
            </span>
        ) : (
            <span className="inline-flex rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                Active
            </span>
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {variant === "table-cell" ? (
                    <TableRow className="cursor-pointer">
                        <TableCell>
                            <div className="flex items-start gap-3">
                                <div className="font-medium text-zinc-900 dark:text-zinc-100">
                                    {deal.Title}
                                </div>
                                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                                    {getStatusBadge(deal)}
                                </div>
                                <div>
                                    {deal.Commission.Valid ? (
                                        <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                            {formatCurrency(
                                                (deal.Price * Number(deal.Commission.String)) / 100
                                            )}{" "}
                                        </div>
                                    ) : null}
                                </div>
                                <div className="text-green-600 dark:text-green-400 font-bold">
                                    ${deal.Price.toLocaleString()}
                                </div>
                            </div>
                        </TableCell>
                    </TableRow>
                ) : (

                    <Button variant="outline" size="sm">
                        <Pencil className="h-4 w-4" />
                    </Button>
                )}
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
                            { label: "Closed Date", name: "closed_date" },
                        ].map(d => (
                            <FormField
                                key={d.name}
                                control={form.control}
                                name={d.name as keyof DealFormValues}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{d.label}</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
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
                            <div className="grid grid-cols-2 gap-2 flex-1">
                                <Button type="submit" className="w-full">Save Changes</Button>
                                <Button type="button" variant="destructive" className="w-full" onClick={handleDelete}>Delete</Button>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
