import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    ArrowLeft,
    Key,
    LinkIcon,
    Loader2Icon,
    Shield,
    Trash2,
    User,
} from "lucide-react"
import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ReactNode, Suspense } from "react"
import { auth } from "@/lib/auth"
import { ProfileUpdateForm } from "@/components/profile/profileUpdateForm"
import { AccountDeletion } from "@/components/profile/accountDeletion"
import { AccountLinking } from "@/components/profile/accountLinking"
import { SessionManagement } from "@/components/profile/sessionManagement"
import { ChangePasswordForm } from "@/components/profile/changePasswordForm"
import { SetPasswordButton } from "@/components/profile/setPasswordButton"
import { TwoFactorAuth } from "@/components/profile/twoFactorAuth"
import AvatarUpload from "@/components/profile/AvatarUploadButton"
import { APIKeyManagement } from "@/components/profile/apiKeyManagement"

export default async function ProfilePage() {
    const session = await auth.api.getSession({ headers: await headers() })
    if (session == null) return redirect("/auth/login")

    return (
        <div className="max-w-4xl mx-auto my-6 px-4">
            <div className="mb-8">
                <Link href="/" className="inline-flex items-center mb-6">
                    <ArrowLeft className="size-4 mr-2" />
                    Back to Home
                </Link>
                <div className="flex items-center space-x-4">
                    <AvatarUpload session={session} />
                    <div className="flex-1">
                        <div className="flex gap-1 justify-between items-start">
                            <h1 className="text-3xl font-bold">
                                {session.user.name || "User Profile"}
                            </h1>
                            <Badge>{session.user.role}</Badge>
                        </div>
                        <p className="text-muted-foreground">{session.user.email}</p>
                    </div>
                </div>
            </div>

            <Tabs className="space-y-2" defaultValue="profile">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="profile">
                        <User />
                        <span className="max-sm:hidden">Profile</span>
                    </TabsTrigger>
                    <TabsTrigger value="security">
                        <Shield />
                        <span className="max-sm:hidden">Security</span>
                    </TabsTrigger>
                    <TabsTrigger value="sessions">
                        <Key />
                        <span className="max-sm:hidden">Sessions</span>
                    </TabsTrigger>
                    <TabsTrigger value="accounts">
                        <LinkIcon />
                        <span className="max-sm:hidden">Accounts</span>
                    </TabsTrigger>
                    <TabsTrigger value="danger">
                        <Trash2 />
                        <span className="max-sm:hidden">Danger</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <Card>
                        <CardContent>
                            <ProfileUpdateForm user={session.user} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security">
                    <LoadingSuspense>
                        <SecurityTab
                            email={session.user.email}
                            isTwoFactorEnabled={session.user.twoFactorEnabled ?? false}
                        />
                    </LoadingSuspense>
                </TabsContent>

                <TabsContent value="sessions">
                    <LoadingSuspense>
                        <SessionsTab currentSessionToken={session.session.token} />
                    </LoadingSuspense>
                </TabsContent>

                <TabsContent value="accounts">
                    <LoadingSuspense>
                        <LinkedAccountsTab />
                    </LoadingSuspense>
                </TabsContent>

                <TabsContent value="danger">
                    <Card className="border border-destructive">
                        <CardHeader>
                            <CardTitle className="text-destructive">Danger Zone</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <AccountDeletion />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

async function LinkedAccountsTab() {
    const accounts = await auth.api.listUserAccounts({ headers: await headers() })
    const nonCredentialAccounts = accounts.filter(
        a => a.providerId !== "credential"
    )

    return (
        <Card>
            <CardContent>
                <AccountLinking currentAccounts={nonCredentialAccounts} />
            </CardContent>
        </Card>
    )
}
async function SessionsTab({
    currentSessionToken,
}: {
    currentSessionToken: string
}) {
    const sessions = await auth.api.listSessions({ headers: await headers() })

    return (
        <Card>
            <CardContent>
                <SessionManagement
                    sessions={sessions}
                    currentSessionToken={currentSessionToken}
                />
            </CardContent>
        </Card>
    )
}

async function SecurityTab({
    email,
    isTwoFactorEnabled,
}: {
    email: string
    isTwoFactorEnabled: boolean
}) {
    const [accounts, apiKeys] = await Promise.all([
        auth.api.listUserAccounts({ headers: await headers() }),
        auth.api.listApiKeys({ headers: await headers() }),
    ])

    const hasPasswordAccount = accounts.some(a => a.providerId === "credential")

    return (
        <div className="space-y-6">
            {hasPasswordAccount ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Change Password</CardTitle>
                        <CardDescription>
                            Update your password for improved security.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChangePasswordForm />
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Set Password</CardTitle>
                        <CardDescription>
                            We will send you a password reset email to set up a password.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SetPasswordButton email={email} />
                    </CardContent>
                </Card>
            )}
            {hasPasswordAccount && (
                <Card>
                    <CardHeader className="flex items-center justify-between gap-2">
                        <CardTitle>Two-Factor Authentication</CardTitle>
                        <Badge variant={isTwoFactorEnabled ? "default" : "secondary"}>
                            {isTwoFactorEnabled ? "Enabled" : "Disabled"}
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <TwoFactorAuth isEnabled={isTwoFactorEnabled} />
                    </CardContent>
                </Card>
            )}


            <Card>
                <CardHeader>
                    <CardTitle>API Keys</CardTitle>
                    <CardDescription>
                        Create and manage API keys for server-side access.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <APIKeyManagement apiKeys={apiKeys} />
                </CardContent>
            </Card>
        </div>
    )
}

function LoadingSuspense({ children }: { children: ReactNode }) {
    return (
        <Suspense fallback={<Loader2Icon className="size-20 animate-spin" />}>
            {children}
        </Suspense>
    )
}
