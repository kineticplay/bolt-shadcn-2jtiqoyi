import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PhoneLogin } from '@/components/auth/PhoneLogin';
import { EmailLogin } from '@/components/auth/EmailLogin';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { XCircle } from 'lucide-react';

export function LoginPage() {
  const [activeTab, setActiveTab] = useState<string>('email');
  const { error, clearError } = useAuth();

  return (
    <div className="min-h-[100dvh] w-full bg-[#D84040] text-lg">
      <div 
        className="
          min-h-[100dvh] 
          flex 
          items-center 
          justify-center  
          py-safe 
          px-safe"
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
        }}
      >
        <div className="w-full max-w-sm">
          <Card className="backdrop-blur-xl bg-white/70">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
              <CardDescription>
                Choose your preferred login method
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription className="pt-1">{error}</AlertDescription>
                </Alert>
              )}
              
              <Tabs
                defaultValue={activeTab}
                value={activeTab}
                onValueChange={(value) => {
                  setActiveTab(value);
                  clearError();
                }}
              >
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="phone">Phone</TabsTrigger>
                </TabsList>
                <TabsContent value="email">
                  <EmailLogin />
                </TabsContent>
                <TabsContent value="phone">
                  <PhoneLogin />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}