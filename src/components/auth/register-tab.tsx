'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { PasswordInput } from '../ui/password-input';
import { LoadingSwap } from '../ui/loading-swap';
import { Button } from '../ui/button';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { STRIPE_PLANS } from '@/lib/stripe';
import { useRouter } from 'next/navigation';

const RegisterSchema = z.object({
    name: z.string().min(2).max(20),
    email: z.email().min(1),
    password: z.string().min(8),
});

type RegisterForm = z.infer<typeof RegisterSchema>;
type tab = 'login' | 'register' | 'email-verification' | 'forgot-password';

export default function RegisterTab(
    { openEmailVerificationTab, setSelectedTab, plan }: { openEmailVerificationTab: (email: string) => void, setSelectedTab: (selectedTab: tab) => void, plan: string | null }
) {

    const form = useForm<RegisterForm>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
    });
    const router = useRouter();

    if (plan == null) {
        router.replace("/pricing");
        return null;
    }


    const stripePlan = STRIPE_PLANS.find(p => p.name.toLowerCase() === plan.toLowerCase());

    if (stripePlan == null || stripePlan == undefined) {
        router.replace("/pricing");
        return null;
    }

    const { isSubmitting } = form.formState

    async function handleSubmit(data: RegisterForm) {
        if (!stripePlan) {
            toast.error("Invalid plan selected");
            return;
        }

        try {
            // 1. Create the user account
            const res = await authClient.signUp.email(
                {
                    ...data,
                    callbackURL: "/auth/login"
                },
                {
                    onError: (error) => {
                        toast.error(error.error.message || "Registration failed");
                    }
                }
            );

            // If registration failed, stop here
            if (res.error) {
                return;
            }

            const userId = res.data.user.id;

            // 2. User created successfully - redirect to checkout
            toast.success('Account created! Redirecting to checkout...');

            const { error } = await authClient.subscription.upgrade({
                plan: stripePlan.name,
                successUrl: "/",
                cancelUrl: "/pricing",
            })

            // 3. If checkout failed, delete the user

            if (error) {
                toast.error('Failed to create checkout session. Please try again.');
                // TODO: Delete the user account here if needed
            }



        } catch (error) {
            console.error('Registration/Checkout error:', error);
            toast.error('Something went wrong. Please try again.');
            // TODO: Delete the user account here if needed
        }
    }

    return (
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
                <FormField
                    name="name"
                    control={form.control}
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
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <PasswordInput {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-between items-center">
                    <div />
                    <Button
                        onClick={() => setSelectedTab('login')}
                        type="button"
                        variant="link"
                        size="sm"
                        className="text-sm font-normal underline cursor-pointer p-0"
                    >
                        Already have an account? Sign In
                    </Button>
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                    <LoadingSwap isLoading={isSubmitting}>
                        Register
                    </LoadingSwap>
                </Button>

            </form>
        </Form>
    )
}
