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
import { PasskeyButton } from './passkeyButton';
import { useRouter } from 'next/navigation';

const LoginSchema = z.object({
    email: z.email().min(1),
    password: z.string().min(8),
});

type LoginForm = z.infer<typeof LoginSchema>;


export default function LoginTab({ openEmailVerificationTab, openForgotPassword }: { openEmailVerificationTab: (email: string) => void, openForgotPassword: () => void }) {
    const router = useRouter();
    const form = useForm<LoginForm>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const { isSubmitting } = form.formState

    async function handleSubmit(data: LoginForm) {
        await authClient.signIn.email({ ...data, callbackURL: "/" },
            {
                onError: (error) => {
                    if (error.error.code === 'EMAIL_NOT_VERIFIED') {
                        openEmailVerificationTab(data.email);
                    }
                    toast.error(error.error.message || "Login failed");
                }
            });
    }

    return (
        <div className="space-y-4">
            <Form {...form}>
                <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>

                    <FormField
                        name="email"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        autoComplete="email webauthn"
                                        {...field} />
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
                                <div className="flex justify-between items-center">
                                    <FormLabel>Password</FormLabel>
                                    <Button
                                        onClick={openForgotPassword}
                                        type="button"
                                        variant="link"
                                        size="sm"
                                        className="text-sm font-normal underline cursor-pointer"
                                    >
                                        Forgot Password?
                                    </Button>
                                </div>
                                <FormControl>
                                    <PasswordInput
                                        autoComplete="current-password webauthn"
                                        {...field} />
                                </FormControl>
                                <div className="flex justify-between items-center">
                                    <div />
                                    <Button
                                        className="text-sm font-normal underline cursor-pointer"
                                        variant="link"
                                        type="button"
                                        size="sm"
                                        onClick={() => {
                                            router.push("/pricing");
                                        }}
                                    >
                                        Don't have an account? Sign up
                                    </Button>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={isSubmitting} className="w-full cursor-pointer">
                        <LoadingSwap isLoading={isSubmitting}>
                            Login
                        </LoadingSwap>
                    </Button>

                </form>
            </Form>
            <PasskeyButton />
        </div>
    )
}
