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

const RegisterSchema = z.object({
    name: z.string().min(2).max(20),
    email: z.email().min(1),
    password: z.string().min(8),
});

type RegisterForm = z.infer<typeof RegisterSchema>;


export default function RegisterTab(
    { openEmailVerificationTab }: { openEmailVerificationTab: (email: string) => void }
) {

    const form = useForm<RegisterForm>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
    });

    const { isSubmitting } = form.formState

    async function handleSubmit(data: RegisterForm) {
        const res = await authClient.signUp.email({ ...data, callbackURL: "/auth/login" },
            {
                onError: (error) => {
                    toast.error(error.error.message || "Registration failed");
                }
            });

        if (res.error == null && res.data.user.emailVerified === false) {
            openEmailVerificationTab(data.email);
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

                <Button type="submit" disabled={isSubmitting} className="w-full">
                    <LoadingSwap isLoading={isSubmitting}>
                        Register
                    </LoadingSwap>
                </Button>

            </form>
        </Form>
    )
}
