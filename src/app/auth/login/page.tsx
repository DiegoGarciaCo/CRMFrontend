'use client';

import { Tabs, TabsContent } from '../../../components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../../components/ui/card';
import RegisterTab from '@/components/auth/register-tab';
import LoginTab from '@/components/auth/login-tab';
import { Separator } from '../../../components/ui/separator';
import SocialAuthButtons from '@/components/auth/socialAuthButtons';
import { useEffect, useState, Suspense } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter, useSearchParams } from 'next/navigation';
import { EmailVerification } from '@/components/auth/emailVerification';
import { ForgotPassword } from '@/components/auth/forgotPassword';

type Tab = 'login' | 'register' | 'email-verification' | 'forgot-password';

function LoginPageContent() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const params = useSearchParams();
    const registerParam = params.get('register');
    const initialTab: Tab = registerParam === 'true' ? 'register' : 'login';
    const planParam = params.get('plan');
    const [selectedTab, setSelectedTab] = useState<Tab>(initialTab);

    useEffect(() => {
        authClient.getSession().then((session) => {
            if (session.data != null) {
                router.push('/');
            }
        });
    }, [router]);

    function openEmailVerificationTab(email: string) {
        setEmail(email);
        setSelectedTab('email-verification');
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="container w-1/2">
                <Tabs value={selectedTab} onValueChange={t => setSelectedTab(t as Tab)} className="max-auto w-full my-6 px-4">
                    <TabsContent value="login">
                        <Card>
                            <CardHeader className="text-2xl font-bold">
                                <CardTitle>Login</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <LoginTab
                                    openEmailVerificationTab={openEmailVerificationTab}
                                    openForgotPassword={() => setSelectedTab('forgot-password')}
                                />
                            </CardContent>

                            <div className="flex items-center">
                                <Separator className="flex-1" />
                                <span className="mx-4 text-sm text-muted-foreground">OR</span>
                                <Separator className="flex-1" />
                            </div>

                            <CardFooter className="grid grid-rows-2 gap-3">
                                <SocialAuthButtons />
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="register">
                        <Card>
                            <CardHeader className="text-2xl font-bold">
                                <CardTitle>Register</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RegisterTab openEmailVerificationTab={openEmailVerificationTab} setSelectedTab={setSelectedTab} plan={planParam} />
                            </CardContent>

                            <div className="flex items-center">
                                <Separator className="flex-1" />
                                <span className="mx-4 text-sm text-muted-foreground">OR</span>
                                <Separator className="flex-1" />
                            </div>

                            <CardFooter className="grid grid-rows-2 gap-3">
                                <SocialAuthButtons />
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="email-verification">
                        <Card>
                            <CardHeader className="text-2xl font-bold">
                                <CardTitle>Verify Your Email</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <EmailVerification email={email} />
                            </CardContent>

                        </Card>
                    </TabsContent>

                    <TabsContent value="forgot-password">
                        <Card>
                            <CardHeader className="text-2xl font-bold">
                                <CardTitle>Forgot Password</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ForgotPassword openSignInTab={() => setSelectedTab('login')} />
                            </CardContent>

                        </Card>
                    </TabsContent>

                </Tabs>
            </div>
        </main>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="container w-1/2">
                    <Card className="max-auto w-full my-6 mx-4">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-center">
                                Loading...
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        }>
            <LoginPageContent />
        </Suspense>
    );
}
