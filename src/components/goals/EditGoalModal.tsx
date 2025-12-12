'use client';

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { UpdateGoal } from "@/lib/data/backend/clientCalls";
import { useRouter } from "next/navigation";

const GoalSchema = z.object({
    year: z.number().int().min(2000, "Invalid year"),
    month: z.number().min(1).max(12),
    income_goal: z.string().min(1),
    transaction_goal: z.string().min(1),
    estimated_average_sale_price: z.string().min(1),
    estimated_average_commission_rate: z.string().min(1),
});

type GoalFormValues = z.infer<typeof GoalSchema>;

interface EditGoalModalProps {
    goalID: string;
    initialValues: GoalFormValues;
}

export function EditGoalModal({ goalID, initialValues }: EditGoalModalProps) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const form = useForm<GoalFormValues>({
        resolver: zodResolver(GoalSchema),
        defaultValues: initialValues,
    });

    async function onSubmit(values: GoalFormValues) {
        try {
            await UpdateGoal(
                goalID,
                values.year,
                values.month,
                values.income_goal,
                values.transaction_goal,
                values.estimated_average_sale_price,
                values.estimated_average_commission_rate
            );
            toast.success("Goal updated!");
            setOpen(false);
            router.refresh();
        } catch (err) {
            console.error(err);
            toast.error("Failed to update goal.");
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Edit Goal</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Goal</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="year"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Year</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="month"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Month</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} min={1} max={12} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="income_goal"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Income Goal ($)</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="transaction_goal"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Transaction Goal (#)</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="estimated_average_sale_price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Estimated Average Sale Price ($)</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="estimated_average_commission_rate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Estimated Commission Rate (%)</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full mt-2">
                            Save Changes
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
