'use client';

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { DeleteStage, UpdateStage } from "@/lib/data/backend/clientCalls";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

const StageSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    client_type: z.string().min(1, "Client type is required"),
    order_index: z.number().int().min(0, "Order index must be >= 0"),
});

type StageFormValues = z.infer<typeof StageSchema>;

interface EditStageModalProps {
    stageID: string;
    name: string;
    description: string;
    client_type: string;
    order_index: number;
    hasDeals?: boolean;
}

export function EditStageModal({ stageID, name, description, client_type, order_index, hasDeals }: EditStageModalProps) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const form = useForm<StageFormValues>({
        resolver: zodResolver(StageSchema),
        defaultValues: {
            name,
            description,
            client_type,
            order_index,
        },
    });

    async function onSubmit(values: StageFormValues) {
        try {
            await UpdateStage(stageID, values.name, values.description ?? "", values.client_type, values.order_index);
            toast.success("Stage updated!");
            form.reset(values);
            setOpen(false);
            router.refresh(); // refresh parent page to reflect changes
        } catch (err) {
            toast.error("Failed to update stage.");
            console.error(err);
        }
    }

    async function handleDelete() {
        try {
            if (hasDeals) {
                toast.error("Cannot delete stage with existing deals.");
                return;
            }
            await DeleteStage(stageID);
            toast.success("Stage deleted!");
            setOpen(false);
            router.refresh(); // refresh parent page to reflect changes
        } catch (err) {
            toast.error("Failed to delete stage.");
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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Stage</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="client_type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Client Type</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="order_index"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Order Index</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <Button type="submit" className="w-full">
                                Save Changes
                            </Button>
                            <Button type="button" variant="destructive" className="w-full" onClick={handleDelete}>
                                Delete Stage
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
