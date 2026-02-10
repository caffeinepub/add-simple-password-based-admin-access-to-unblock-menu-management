import { ReactNode, useState } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsCallerAdmin, useGetCallerUserProfile, useSaveCallerUserProfile } from '../../hooks/useQueries';
import { useActorWithRefresh } from '../../hooks/useActorWithRefresh';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2, ShieldAlert, Copy, Check, Key } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { sanitizeError } from '../../utils/sanitizeError';
import { setSecretParameter } from '../../utils/urlParams';

interface AdminRouteGuardProps {
  children: ReactNode;
}

const ADMIN_PASSWORD = 'admin 9828';

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { identity, login, loginStatus } = useInternetIdentity();
  const navigate = useNavigate();
  const { actor, isFetching: actorFetching, refreshActor } = useActorWithRefresh();
  const { data: isAdmin, isLoading: isCheckingAdmin, error: adminError, refetch: refetchAdmin } = useIsCallerAdmin();
  
  // Only fetch profile after admin check passes
  const shouldFetchProfile = !!identity && isAdmin === true;
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile({ 
    enabled: shouldFetchProfile 
  });
  const saveProfile = useSaveCallerUserProfile();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [copiedPrincipal, setCopiedPrincipal] = useState(false);

  const isAuthenticated = !!identity;
  const principalString = identity?.getPrincipal().toString() || '';

  // Profile setup only for authenticated admins
  const showProfileSetup = isAuthenticated && isAdmin === true && !profileLoading && isFetched && userProfile === null;

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    try {
      await saveProfile.mutateAsync({
        name: name.trim(),
        email: email.trim() || undefined,
      });
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPassword.trim()) return;

    setIsSubmittingPassword(true);
    setPasswordError('');

    try {
      // Validate password client-side
      if (adminPassword.trim() !== ADMIN_PASSWORD) {
        setPasswordError('Incorrect password. Please try again.');
        setIsSubmittingPassword(false);
        return;
      }

      // Store password in sessionStorage under the admin token key
      setSecretParameter('caffeineAdminToken', adminPassword.trim());
      
      // Force actor recreation to re-run initialization with new token
      refreshActor();
      
      // Wait a bit for actor to recreate, then refetch admin status
      setTimeout(() => {
        refetchAdmin();
      }, 500);
      
      // Clear the input
      setAdminPassword('');
    } catch (error) {
      setPasswordError(sanitizeError(error));
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  const handleCopyPrincipal = async () => {
    try {
      await navigator.clipboard.writeText(principalString);
      setCopiedPrincipal(true);
      setTimeout(() => setCopiedPrincipal(false), 2000);
    } catch (error) {
      console.error('Failed to copy principal:', error);
    }
  };

  const handleRetry = () => {
    refreshActor();
    setTimeout(() => {
      refetchAdmin();
    }, 500);
  };

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="max-w-md w-full mx-4">
          <Alert>
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Authentication Required</AlertTitle>
            <AlertDescription className="mt-2">
              You need to log in to access the admin dashboard.
            </AlertDescription>
          </Alert>
          <div className="mt-4 flex gap-2">
            <Button onClick={login} disabled={loginStatus === 'logging-in'} className="flex-1">
              {loginStatus === 'logging-in' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login with Internet Identity'
              )}
            </Button>
            <Button variant="outline" onClick={() => navigate({ to: '/' })}>
              Back to Menu
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Actor loading or checking admin status
  if (actorFetching || isCheckingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Admin check error
  if (adminError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="max-w-md w-full mx-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Verification Error</AlertTitle>
            <AlertDescription className="whitespace-pre-wrap">
              {sanitizeError(adminError)}
            </AlertDescription>
          </Alert>
          <div className="mt-4 flex gap-2">
            <Button onClick={handleRetry} className="flex-1">
              Retry
            </Button>
            <Button variant="outline" onClick={() => navigate({ to: '/' })}>
              Back to Menu
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Not an admin - show access denied with principal and password input
  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <div className="max-w-md w-full space-y-4">
          <Alert variant="destructive">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You do not have permission to access the admin dashboard.
            </AlertDescription>
          </Alert>

          {/* Show principal with copy button */}
          <div className="bg-card border rounded-lg p-4 space-y-2">
            <Label className="text-sm font-medium">Your Principal ID</Label>
            <div className="flex gap-2">
              <Input
                value={principalString}
                readOnly
                className="font-mono text-xs"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyPrincipal}
                title="Copy principal"
              >
                {copiedPrincipal ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Share this principal ID with the system administrator to request access.
            </p>
          </div>

          {/* Admin password input */}
          <div className="bg-card border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Have an Admin Password?</Label>
            </div>
            <p className="text-xs text-muted-foreground">
              If you have the admin password, enter it below to gain access.
            </p>
            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <Input
                type="password"
                placeholder="Enter admin password"
                value={adminPassword}
                onChange={(e) => {
                  setAdminPassword(e.target.value);
                  setPasswordError('');
                }}
                disabled={isSubmittingPassword}
              />
              {passwordError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    {passwordError}
                  </AlertDescription>
                </Alert>
              )}
              <Button
                type="submit"
                disabled={!adminPassword.trim() || isSubmittingPassword}
                className="w-full"
              >
                {isSubmittingPassword ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Submit Password'
                )}
              </Button>
            </form>
          </div>

          <Button variant="outline" className="w-full" onClick={() => navigate({ to: '/' })}>
            Back to Menu
          </Button>
        </div>
      </div>
    );
  }

  // Profile setup dialog - only for admins
  if (showProfileSetup) {
    return (
      <Dialog open={true}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleProfileSubmit}>
            <DialogHeader>
              <DialogTitle>Welcome! Set up your profile</DialogTitle>
              <DialogDescription>
                Please provide your name to continue.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email (optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={!name.trim() || saveProfile.isPending}>
                {saveProfile.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Continue'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  // Authorized - admin with profile (or profile not required)
  return <>{children}</>;
}
