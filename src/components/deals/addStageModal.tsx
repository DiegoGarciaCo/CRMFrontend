"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

import { z } from "zod";
import { toast } from "sonner";
import { CreateStage } from "@/lib/data/backend/clientCalls";

const StageSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    client_type: z.string().min(1, "Client type is required"),
    order_index: z.number().int().min(0, "Order index must be >= 0"),
});

type StageFormValues = z.infer<typeof StageSchema>;

export function AddStageModal() {
    const [open, setOpen] = useState(false);

    const form = useForm<StageFormValues>({
        resolver: zodResolver(StageSchema),
        defaultValues: {
            name: "",
            description: "",
            client_type: "",
            order_index: 0,
        },
    });

    async function onSubmit(values: StageFormValues) {
        try {
            await CreateStage(
                values.name,
                values.description ?? "",
                values.client_type,
                values.order_index,
            );

            toast.success("Stage created!");

            form.reset();
            setOpen(false);
        } catch (err) {
            toast.error("Failed to create stage.");
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Stage
                </button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Stage</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        {/* Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Stage Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Optional description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Client type */}
                        <FormField
                            control={form.control}
                            name="client_type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Client Type</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Buyer, Seller" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Order Index */}
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

                        <Button type="submit" className="w-full">
                            Create Stage
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
